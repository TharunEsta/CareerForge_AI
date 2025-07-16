"""
Payment Router
Handles payment-related endpoints for CareerForge AI
Currently supports: Razorpay (domestic payments only) with enhanced real-time features
"""

import hashlib
import hmac
import logging
import os

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from payment_gateways import (
    PaymentMethod,
    PaymentRequest,
    create_payment,
    get_payment_status,
    get_supported_payment_methods,
    verify_payment,
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/create")
async def create_payment_endpoint(request: PaymentRequest):
    """Create a new payment order with enhanced features"""
    try:
        # Validate payment method for domestic payments
        if request.payment_method not in [PaymentMethod.UPI, PaymentMethod.NET_BANKING, PaymentMethod.CARD, PaymentMethod.WALLET, PaymentMethod.EMI]:
            raise HTTPException(status_code=400, detail="Invalid payment method for domestic payments")
        
        # Validate currency (only INR for domestic)
        if request.currency != "INR":
            raise HTTPException(status_code=400, detail="Only INR currency is supported for domestic payments")
        
        # Create payment
        payment_response = create_payment(request)
        
        if payment_response.status == "failed":
            raise HTTPException(status_code=400, detail=payment_response.error_message)
        
        return {
            "success": True,
            "payment_id": payment_response.payment_id,
            "payment_url": payment_response.payment_url,
            "qr_code_url": payment_response.qr_code_url,
            "amount": payment_response.amount,
            "currency": payment_response.currency,
            "status": payment_response.status,
            "payment_methods": payment_response.payment_methods,
            "expires_at": payment_response.expires_at.isoformat() if payment_response.expires_at else None
        }
        
    except Exception as e:
        logger.error("Payment creation failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_payment_endpoint(payment_id: str, signature: str, order_id: str):
    """Verify payment signature"""
    try:
        is_valid = verify_payment(payment_id, signature, order_id)
        
        if is_valid:
            return {"success": True, "message": "Payment verified successfully"}
        else:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
            
    except Exception as e:
        logger.error("Payment verification failed: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status/{payment_id}")
async def get_payment_status_endpoint(payment_id: str):
    """Get real-time payment status"""
    try:
        status = get_payment_status(payment_id)
        
        if "error" in status:
            raise HTTPException(status_code=400, detail=status["error"])
        
        return {
            "success": True,
            "payment_status": status
        }
        
    except Exception as e:
        logger.error("Failed to get payment status: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks):
    """Handle Razorpay webhook events with enhanced processing"""
    try:
        # Get webhook data
        webhook_data = await request.json()
        webhook_signature = request.headers.get("X-Razorpay-Signature")
        
        # Verify webhook signature
        if not webhook_signature:
            raise HTTPException(status_code=400, detail="Missing signature")
        
        # Verify webhook signature
        expected_signature = hmac.new(
            os.getenv("RAZORPAY_KEY_SECRET").encode(),
            await request.body(),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(webhook_signature, expected_signature):
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Process webhook event
        event = webhook_data.get("event")
        payment_data = webhook_data.get("payload", {}).get("payment", {})
        
        logger.info("Received Razorpay webhook: %s", event)
        
        # Handle different events
        if event == "payment.captured":
            # Payment successful
            background_tasks.add_task(process_successful_payment, payment_data)
            return {"success": True, "message": "Payment processed successfully"}
            
        elif event == "payment.failed":
            # Payment failed
            background_tasks.add_task(process_failed_payment, payment_data)
            return {"success": True, "message": "Payment failure processed"}
            
        elif event == "order.paid":
            # Order paid
            background_tasks.add_task(process_order_paid, payment_data)
            return {"success": True, "message": "Order paid successfully"}
        
        return {"success": True, "message": "Webhook processed"}
        
    except Exception as e:
        logger.error("Error handling Razorpay webhook: %s", e)
        raise HTTPException(status_code=500, detail="Webhook processing failed")

async def process_successful_payment(payment_data: dict):
    """Process successful payment"""
    try:
        payment_id = payment_data.get("id")
        amount = payment_data.get("amount", 0) / 100  # Convert from paise
        
        logger.info("Processing successful payment: %s, Amount: %s", payment_id, amount)
        
        # Update user subscription
        # Add your subscription update logic here
        
    except Exception as e:
        logger.error("Error processing successful payment: %s", e)

async def process_failed_payment(payment_data: dict):
    """Process failed payment"""
    try:
        payment_id = payment_data.get("id")
        error_description = payment_data.get("error_description")
        
        logger.info("Processing failed payment: %s, Error: %s", payment_id, error_description)
        
        # Handle failed payment
        # Add your failure handling logic here
        
    except Exception as e:
        logger.error("Error processing failed payment: %s", e)

async def process_order_paid(payment_data: dict):
    """Process order paid event"""
    try:
        order_id = payment_data.get("id")
        
        logger.info("Processing order paid: %s", order_id)
        
        # Handle order completion
        # Add your order completion logic here
        
    except Exception as e:
        logger.error("Error processing order paid: %s", e)

@router.get("/gateways")
async def get_payment_gateways():
    """Get available payment gateways"""
    return {
        "gateways": [
            {
                "id": "razorpay",
                "name": "Razorpay",
                "description": "Indian payment gateway with UPI, cards, net banking",
                "supported_countries": ["IN"],
                "supported_currencies": ["INR"],
                "features": [
                    "UPI payments",
                    "Credit/Debit cards",
                    "Net banking",
                    "Digital wallets",
                    "EMI options",
                    "QR code payments",
                    "Real-time status",
                    "Instant settlements"
                ]
            }
        ]
    }

@router.get("/methods")
async def get_payment_methods():
    """Get supported payment methods"""
    return {
        "methods": get_supported_payment_methods()
    } 