"""
Payment Router for CareerForge AI
Handles payment creation, verification, and webhooks for multiple gateways
"""

import logging
import os
from datetime import datetime

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from payment_gateways import (
    PaymentGateway,
    PaymentMethod,
    PaymentRequest,
    PaymentResponse,
    PaymentStatus,
    create_payment,
    get_supported_payment_methods,
    verify_payment,
)

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/payment", tags=["payment"])

# PYDANTIC MODELS

class CreatePaymentRequest(BaseModel):
    plan_id: str
    billing_cycle: str  # "monthly" or "yearly"
    payment_method: str
    user_country: str = "US"
    user_email: str
    user_id: str

class PaymentVerificationRequest(BaseModel):
    payment_id: str
    gateway: str

class WebhookRequest(BaseModel):
    payment_id: str
    gateway: str
    status: str
    amount: float
    currency: str
    transaction_id: str | None = None

class PaymentMethodResponse(BaseModel):
    id: str
    name: str
    gateway: str
    description: str | None = None

class PaymentStatusResponse(BaseModel):
    payment_id: str
    status: str
    gateway: str
    amount: float
    currency: str
    transaction_id: str | None = None
    error_message: str | None = None
    timestamp: str

# PAYMENT ENDPOINTS

@router.post("/create", response_model=PaymentResponse)
async def create_payment_endpoint(request: CreatePaymentRequest):
    """Create a new payment with automatic gateway selection"""
    try:
        # Validate payment method
        try:
            payment_method = PaymentMethod(request.payment_method)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payment method")
        
        # Get plan details from subscription system
        from subscription_plans import get_plan_by_id
        plan = get_plan_by_id(request.plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Calculate amount based on billing cycle
        amount = plan.price_yearly if request.billing_cycle == "yearly" else plan.price_monthly
        
        # Create payment request
        payment_request = PaymentRequest(
            plan_id=request.plan_id,
            billing_cycle=request.billing_cycle,
            amount=amount,
            currency="INR" if request.user_country == "IN" else "USD",
            user_id=request.user_id,
            user_email=request.user_email,
            user_country=request.user_country,
            payment_method=payment_method
        )
        
        # Create payment
        response = await create_payment(payment_request)
        
        if response.status == PaymentStatus.FAILED:
            raise HTTPException(status_code=400, detail=response.error_message or "Payment creation failed")
        
        return response
        
    except Exception as e:
        logger.error("Error creating payment: %s", e)
        raise HTTPException(status_code=500, detail="Payment creation failed")

@router.post("/verify", response_model=PaymentStatusResponse)
async def verify_payment_endpoint(request: PaymentVerificationRequest):
    """Verify payment status"""
    try:
        # Validate gateway
        try:
            gateway = PaymentGateway(request.gateway)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payment gateway")
        
        # Verify payment
        response = await verify_payment(request.payment_id, gateway)
        
        return PaymentStatusResponse(
            payment_id=response.payment_id,
            status=response.status.value,
            gateway=response.gateway.value,
            amount=response.amount,
            currency=response.currency,
            transaction_id=response.transaction_id,
            error_message=response.error_message,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error("Error verifying payment: %s", e)
        raise HTTPException(status_code=500, detail="Payment verification failed")

@router.get("/methods/{country}", response_model=list[PaymentMethodResponse])
async def get_payment_methods(country: str):
    """Get supported payment methods for a country"""
    try:
        methods = get_supported_payment_methods(country)
        
        response_methods = []
        for method in methods:
            response_methods.append(PaymentMethodResponse(
                id=method["id"],
                name=method["name"],
                gateway=method["gateway"],
                description=f"Pay securely with {method['name']}"
            ))
        
        return response_methods
        
    except Exception as e:
        logger.error("Error getting payment methods: %s", e)
        raise HTTPException(status_code=500, detail="Failed to get payment methods")

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        import stripe

        from payment_gateways import payment_manager
        
        # Get webhook secret
        webhook_secret = payment_manager.gateways[PaymentGateway.STRIPE].webhook_secret
        
        # Get the webhook payload
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as _:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError as _:
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        if event["type"] == "payment_intent.succeeded":
            payment_intent = event["data"]["object"]
            logger.info("Payment succeeded: %s", payment_intent['id'])
            
            # Update user subscription here
            # await update_user_subscription(payment_intent['metadata'])
            
        elif event["type"] == "payment_intent.payment_failed":
            payment_intent = event["data"]["object"]
            logger.info("Payment failed: %s", payment_intent['id'])
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error("Error handling Stripe webhook: %s", e)
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.post("/webhook/paypal")
async def paypal_webhook(request: Request):
    """Handle PayPal webhook events"""
    try:
        # Verify PayPal webhook
        payload = await request.json()
        
        # Handle PayPal webhook events
        if payload.get("event_type") == "PAYMENT.CAPTURE.COMPLETED":
            payment_id = payload["resource"]["id"]
            logger.info("PayPal payment completed: %s", payment_id)
            
            # Update user subscription here
            # await update_user_subscription(payment_id)
            
        elif payload.get("event_type") == "PAYMENT.CAPTURE.DENIED":
            payment_id = payload["resource"]["id"]
            logger.info("PayPal payment denied: %s", payment_id)
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error("Error handling PayPal webhook: %s", e)
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhook events"""
    try:
        import hashlib
        import hmac
        
        # Get webhook secret
        webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
        
        # Get the webhook payload
        payload = await request.body()
        signature = request.headers.get("x-razorpay-signature")
        
        # Verify signature
        expected_signature = hmac.new(
            webhook_secret.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected_signature, signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Parse payload
        data = await request.json()
        
        # Handle Razorpay webhook events
        if data.get("event") == "payment.captured":
            payment_id = data["payload"]["payment"]["entity"]["id"]
            logger.info("Razorpay payment completed: %s", payment_id)
            
            # Update user subscription here
            # await update_user_subscription(payment_id)
            
        elif data.get("event") == "payment.failed":
            payment_id = data["payload"]["payment"]["entity"]["id"]
            logger.info("Razorpay payment failed: %s", payment_id)
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error("Error handling Razorpay webhook: %s", e)
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.get("/gateways")
async def get_available_gateways():
    """Get available payment gateways"""
    return {
        "gateways": [
            {
                "id": "stripe",
                "name": "Stripe",
                "description": "Global payment processing",
                "supported_countries": ["US", "CA", "GB", "AU", "DE", "FR", "IN"],
                "supported_methods": ["credit_card", "debit_card"]
            },
            {
                "id": "paypal",
                "name": "PayPal",
                "description": "Secure online payments",
                "supported_countries": ["US", "CA", "GB", "AU", "DE", "FR"],
                "supported_methods": ["paypal"]
            },
            {
                "id": "razorpay",
                "name": "Razorpay",
                "description": "Indian payment gateway",
                "supported_countries": ["IN"],
                "supported_methods": ["credit_card", "debit_card", "upi", "net_banking", "wallet"]
            }
        ]
    }

@router.get("/health")
async def payment_health_check():
    """Health check for payment service"""
    return {
        "status": "healthy",
        "service": "payment",
        "timestamp": datetime.now().isoformat(),
        "gateways": ["stripe", "paypal", "razorpay"]
    } 