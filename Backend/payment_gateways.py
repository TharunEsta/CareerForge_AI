"""
Payment Gateways Module
Handles payment processing for CareerForge AI
Currently supports: Razorpay (domestic payments only)
"""

import os
import logging
import razorpay
from typing import Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum

logger = logging.getLogger(__name__)

class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentMethod(str, Enum):
    UPI = "upi"
    NET_BANKING = "net_banking"
    CARD = "card"
    WALLET = "wallet"

class PaymentRequest(BaseModel):
    amount: float
    currency: str = "INR"
    user_id: str
    user_email: str
    user_name: str
    description: str
    plan_id: str
    payment_method: PaymentMethod

class PaymentResponse(BaseModel):
    payment_id: str
    status: PaymentStatus
    amount: float
    currency: str
    payment_url: Optional[str] = None
    transaction_id: Optional[str] = None
    error_message: Optional[str] = None

class RazorpayGateway:
    """Razorpay payment gateway implementation for domestic payments"""
    
    def __init__(self):
        self.client_id = os.getenv("RAZORPAY_KEY_ID")
        self.client_secret = os.getenv("RAZORPAY_KEY_SECRET")
        self.mode = os.getenv("RAZORPAY_MODE", "test")  # test or live
        
        if not self.client_id or not self.client_secret:
            logger.warning("Razorpay credentials not configured")
            return
            
        self.client = razorpay.Client(auth=(self.client_id, self.client_secret))
    
    def create_payment(self, request: PaymentRequest) -> PaymentResponse:
        """Create a Razorpay payment order"""
        try:
            if not self.client:
                raise Exception("Razorpay client not initialized")
            
            # Convert amount to paise (Razorpay expects amount in smallest currency unit)
            amount_in_paise = int(request.amount * 100)
            
            # Create order
            order_data = {
                "amount": amount_in_paise,
                "currency": request.currency,
                "receipt": f"order_{request.user_id}_{request.plan_id}",
                "notes": {
                    "user_id": request.user_id,
                    "plan_id": request.plan_id,
                    "description": request.description
                }
            }
            
            order = self.client.order.create(data=order_data)
            
            # Create payment link
            payment_data = {
                "amount": amount_in_paise,
                "currency": request.currency,
                "order_id": order["id"],
                "email": request.user_email,
                "contact": "",  # Add phone if available
                "name": request.user_name,
                "description": request.description,
                "callback_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment/success",
                    "cancel_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment/cancel",
                "prefill": {
                    "name": request.user_name,
                    "email": request.user_email
                },
                "notes": {
                    "user_id": request.user_id,
                    "plan_id": request.plan_id
                }
            }
            
            payment = self.client.payment_link.create(data=payment_data)
            
            return PaymentResponse(
                payment_id=order["id"],
                status=PaymentStatus.PENDING,
                amount=request.amount,
                currency=request.currency,
                payment_url=payment["short_url"]
            )
            
        except Exception as e:
            logger.error(f"Razorpay payment creation failed: {e}")
            return PaymentResponse(
                payment_id="",
                status=PaymentStatus.FAILED,
                amount=request.amount,
                currency=request.currency,
                error_message=str(e)
            )
    
    def verify_payment(self, payment_id: str, signature: str, order_id: str) -> PaymentResponse:
        """Verify Razorpay payment signature"""
        try:
            if not self.client:
                raise Exception("Razorpay client not initialized")
            
            # Verify signature
            params_dict = {
                'razorpay_payment_id': payment_id,
                'razorpay_order_id': order_id,
                'razorpay_signature': signature
            }
            
            self.client.utility.verify_payment_signature(params_dict)
            
            # Get payment details
            payment = self.client.payment.fetch(payment_id)
            
            status_map = {
                "created": PaymentStatus.PENDING,
                "authorized": PaymentStatus.PENDING,
                "captured": PaymentStatus.SUCCESS,
                "failed": PaymentStatus.FAILED,
                "refunded": PaymentStatus.REFUNDED
            }
            
            return PaymentResponse(
                payment_id=payment_id,
                status=status_map.get(payment["status"], PaymentStatus.FAILED),
                amount=float(payment["amount"]) / 100,  # Convert from paise
                currency=payment["currency"],
                transaction_id=payment_id
            )
            
        except Exception as e:
            logger.error(f"Razorpay payment verification failed: {e}")
            return PaymentResponse(
                payment_id=payment_id,
                status=PaymentStatus.FAILED,
                amount=0,
                currency="INR",
                error_message=str(e)
            )

    def get_supported_payment_methods(self) -> Dict[str, Any]:
        """Get supported payment methods for domestic payments"""
        return {
            "upi": {
                "name": "UPI",
                "description": "Pay using UPI apps like Google Pay, PhonePe, Paytm",
                "enabled": True
            },
            "net_banking": {
                "name": "Net Banking",
                "description": "Pay using your bank's net banking",
                "enabled": True
            },
            "card": {
                "name": "Credit/Debit Card",
                "description": "Pay using credit or debit cards",
                "enabled": True
            },
            "wallet": {
                "name": "Digital Wallets",
                "description": "Pay using digital wallets like Paytm, PhonePe",
                "enabled": True
            }
        }

# Initialize Razorpay gateway
razorpay_gateway = RazorpayGateway()

def create_payment(request: PaymentRequest) -> PaymentResponse:
    """Create a payment using Razorpay"""
    return razorpay_gateway.create_payment(request)

def verify_payment(payment_id: str, signature: str, order_id: str) -> PaymentResponse:
    """Verify a payment using Razorpay"""
    return razorpay_gateway.verify_payment(payment_id, signature, order_id)

def get_supported_payment_methods() -> Dict[str, Any]:
    """Get supported payment methods"""
    return razorpay_gateway.get_supported_payment_methods() 