"""
Payment Gateways Module
Handles payment processing for CareerForge AI
Currently supports: Razorpay (domestic payments only) with enhanced features
"""

import logging
import os
import json
import hashlib
import hmac
from enum import Enum
from typing import Any, Dict, List
from datetime import datetime, timedelta

import razorpay
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    EXPIRED = "expired"

class PaymentMethod(str, Enum):
    UPI = "upi"
    NET_BANKING = "net_banking"
    CARD = "card"
    WALLET = "wallet"
    QR_CODE = "qr_code"
    EMI = "emi"

class PaymentRequest(BaseModel):
    amount: float
    currency: str = "INR"
    user_id: str
    user_email: str
    user_name: str
    description: str
    plan_id: str
    payment_method: PaymentMethod
    billing_cycle: str = "monthly"
    phone: str = ""

class PaymentResponse(BaseModel):
    payment_id: str
    status: PaymentStatus
    amount: float
    currency: str
    payment_url: str = ""
    qr_code_url: str = ""
    payment_methods: Dict[str, Any] = {}
    expires_at: datetime = None
    error_message: str = ""

class RazorpayGateway:
    """Enhanced Razorpay payment gateway implementation with real-time features"""
    
    def __init__(self):
        self.client_id = os.getenv("RAZORPAY_KEY_ID")
        self.client_secret = os.getenv("RAZORPAY_KEY_SECRET")
        self.mode = os.getenv("RAZORPAY_MODE", "test")  # test or live
        
        if not self.client_id or not self.client_secret:
            logger.warning("Razorpay credentials not configured")
            return
            
        self.client = razorpay.Client(auth=(self.client_id, self.client_secret))
    
    def create_payment(self, request: PaymentRequest) -> PaymentResponse:
        """Create a Razorpay payment order with enhanced features"""
        try:
            if not self.client:
                raise Exception("Razorpay client not initialized")
            
            # Convert amount to paise (Razorpay expects amount in smallest currency unit)
            amount_in_paise = int(request.amount * 100)
            
            # Create order with enhanced metadata
            order_data = {
                "amount": amount_in_paise,
                "currency": request.currency,
                "receipt": f"order_{request.user_id}_{request.plan_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "notes": {
                    "user_id": request.user_id,
                    "plan_id": request.plan_id,
                    "description": request.description,
                    "billing_cycle": request.billing_cycle,
                    "payment_method": request.payment_method.value
                },
                "partial_payment": False,
                "payment_capture": 1
            }
            
            order = self.client.order.create(data=order_data)
            
            # Create payment link with enhanced features
            payment_link_data = {
                "amount": amount_in_paise,
                "currency": request.currency,
                "accept_partial": False,
                "first_min_partial_amount": 0,
                "reference_id": order["id"],
                "description": request.description,
                "customer": {
                    "name": request.user_name,
                    "email": request.user_email,
                    "contact": request.phone
                },
                "notify": {
                    "sms": True,
                    "email": True
                },
                "reminder_enable": True,
                "notes": {
                    "user_id": request.user_id,
                    "plan_id": request.plan_id,
                    "billing_cycle": request.billing_cycle
                },
                "callback_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment/success",
                "callback_method": "get",
                "expire_by": int((datetime.now() + timedelta(hours=24)).timestamp()),
                "options": {
                    "checkout": {
                        "name": "CareerForge AI",
                        "description": request.description,
                        "prefill": {
                            "name": request.user_name,
                            "email": request.user_email,
                            "contact": request.phone
                        },
                        "theme": {
                            "color": "#2563eb"
                        }
                    }
                }
            }
            
            payment_link = self.client.payment_link.create(data=payment_link_data)
            
            # Generate QR code for UPI payments
            qr_code_url = ""
            if request.payment_method == PaymentMethod.UPI:
                qr_code_url = self._generate_upi_qr_code(order["id"], amount_in_paise, request.user_name)
            
            # Get supported payment methods
            payment_methods = self.get_supported_payment_methods()
            
            return PaymentResponse(
                payment_id=order["id"],
                status=PaymentStatus.PENDING,
                amount=request.amount,
                currency=request.currency,
                payment_url=payment_link["short_url"],
                qr_code_url=qr_code_url,
                payment_methods=payment_methods,
                expires_at=datetime.now() + timedelta(hours=24)
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
    
    def _generate_upi_qr_code(self, order_id: str, amount: int, payee_name: str) -> str:
        """Generate UPI QR code for payments"""
        try:
            # Create UPI QR code data
            upi_data = {
                "pa": self.client_id,  # Payee UPI ID
                "pn": payee_name,
                "tn": f"CareerForge AI - Order {order_id}",
                "am": str(amount / 100),  # Amount in rupees
                "cu": "INR",
                "tr": order_id
            }
            
            # Generate QR code URL (you can use any QR code service)
            qr_data = f"upi://pay?pa={upi_data['pa']}&pn={upi_data['pn']}&tn={upi_data['tn']}&am={upi_data['am']}&cu={upi_data['cu']}&tr={upi_data['tr']}"
            
            # Return QR code image URL (using a QR code service)
            return f"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={qr_data}"
            
        except Exception as e:
            logger.error(f"QR code generation failed: {e}")
            return ""
    
    def verify_payment(self, payment_id: str, signature: str, order_id: str) -> bool:
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
            return True
            
        except Exception as e:
            logger.error(f"Razorpay payment verification failed: {e}")
            return False
    
    def get_payment_status(self, payment_id: str) -> Dict[str, Any]:
        """Get real-time payment status"""
        try:
            if not self.client:
                raise Exception("Razorpay client not initialized")
            
            payment = self.client.payment.fetch(payment_id)
            
            return {
                "payment_id": payment["id"],
                "status": payment["status"],
                "amount": payment["amount"] / 100,  # Convert from paise to rupees
                "currency": payment["currency"],
                "method": payment["method"],
                "created_at": payment["created_at"],
                "updated_at": payment.get("updated_at", payment["created_at"])
            }
            
        except Exception as e:
            logger.error(f"Failed to get payment status: {e}")
            return {"error": str(e)}
    
    def get_supported_payment_methods(self) -> Dict[str, Any]:
        """Get enhanced supported payment methods with real-time features"""
        return {
            "upi": {
                "name": "UPI",
                "description": "Pay using UPI apps like Google Pay, PhonePe, Paytm",
                "enabled": True,
                "features": ["qr_code", "deep_link", "instant_payment"],
                "apps": ["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"]
            },
            "net_banking": {
                "name": "Net Banking",
                "description": "Pay using your bank's net banking",
                "enabled": True,
                "features": ["secure_banking", "instant_verification"],
                "banks": ["HDFC", "ICICI", "SBI", "Axis", "Kotak", "Yes Bank"]
            },
            "card": {
                "name": "Credit/Debit Card",
                "description": "Pay using credit or debit cards",
                "enabled": True,
                "features": ["3d_secure", "emi_options", "rewards"],
                "types": ["Visa", "Mastercard", "RuPay", "American Express"]
            },
            "wallet": {
                "name": "Digital Wallets",
                "description": "Pay using digital wallets like Paytm, PhonePe",
                "enabled": True,
                "features": ["instant_payment", "cashback"],
                "wallets": ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"]
            },
            "emi": {
                "name": "EMI",
                "description": "Pay in easy monthly installments",
                "enabled": True,
                "features": ["no_cost_emi", "flexible_tenure"],
                "tenures": ["3 months", "6 months", "9 months", "12 months"]
            }
        }

# Initialize Razorpay gateway
razorpay_gateway = RazorpayGateway()

def create_payment(request: PaymentRequest) -> PaymentResponse:
    """Create a payment using Razorpay"""
    return razorpay_gateway.create_payment(request)

def verify_payment(payment_id: str, signature: str, order_id: str) -> bool:
    """Verify a payment using Razorpay"""
    return razorpay_gateway.verify_payment(payment_id, signature, order_id)

def get_supported_payment_methods() -> Dict[str, Any]:
    """Get supported payment methods"""
    return razorpay_gateway.get_supported_payment_methods()

def get_payment_status(payment_id: str) -> Dict[str, Any]:
    """Get real-time payment status"""
    return razorpay_gateway.get_payment_status(payment_id) 