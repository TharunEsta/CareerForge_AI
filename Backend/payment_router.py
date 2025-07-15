"""
Payment Router
Handles payment-related endpoints for CareerForge AI
Currently supports: Razorpay (domestic payments only)
"""

import logging

from fastapi import APIRouter, HTTPException, Request

from payment_gateways import (
    PaymentMethod,
    PaymentRequest,
    create_payment,
    get_supported_payment_methods,
    verify_payment,
)

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/create")
async def create_payment_endpoint(request: PaymentRequest):
    """Create a new payment order"""
    try:
        # Validate payment method for domestic payments
        if request.payment_method not in [PaymentMethod.UPI, PaymentMethod.NET_BANKING, PaymentMethod.CARD, PaymentMethod.WALLET]:
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
            "amount": payment_response.amount,
            "currency": payment_response.currency,
            "status": payment_response.status
        }
        
    except Exception as e:
        logger.error(f"Payment creation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify")
async def verify_payment_endpoint(
    payment_id: str,
    signature: str,
    order_id: str
):
    """Verify a payment signature"""
    try:
        payment_response = verify_payment(payment_id, signature, order_id)
        
        if payment_response.status == "failed":
            raise HTTPException(status_code=400, detail=payment_response.error_message)
        
        return {
            "success": True,
            "payment_id": payment_response.payment_id,
            "status": payment_response.status,
            "amount": payment_response.amount,
            "currency": payment_response.currency,
            "transaction_id": payment_response.transaction_id
        }
        
    except Exception as e:
        logger.error(f"Payment verification failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/methods")
async def get_payment_methods():
    """Get supported payment methods for domestic payments"""
    try:
        methods = get_supported_payment_methods()
        return {
            "success": True,
            "methods": methods,
            "currency": "INR",
            "region": "India"
        }
        
    except Exception as e:
        logger.error(f"Failed to get payment methods: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhook events"""
    try:
        # Get webhook data
        webhook_data = await request.json()
        
        # Log webhook event
        logger.info(f"Received Razorpay webhook: {webhook_data.get('event', 'unknown')}")
        
        # Handle different webhook events
        event = webhook_data.get('event')
        
        if event == 'payment.captured':
            # Payment successful
            payment_id = webhook_data['payload']['payment']['entity']['id']
            order_id = webhook_data['payload']['payment']['entity']['order_id']
            
            logger.info(f"Payment captured: {payment_id} for order: {order_id}")
            
            # Here you can update user subscription, send emails, etc.
            
        elif event == 'payment.failed':
            # Payment failed
            payment_id = webhook_data['payload']['payment']['entity']['id']
            logger.warning(f"Payment failed: {payment_id}")
            
        elif event == 'refund.processed':
            # Refund processed
            refund_id = webhook_data['payload']['refund']['entity']['id']
            logger.info(f"Refund processed: {refund_id}")
        
        return {"success": True, "message": "Webhook processed"}
        
    except Exception as e:
        logger.error(f"Webhook processing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def payment_health_check():
    """Health check for payment service"""
    return {
        "status": "healthy",
        "gateway": "razorpay",
        "currency": "INR",
        "region": "India"
    } 