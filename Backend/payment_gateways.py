"""
Payment Gateway Integration for CareerForge AI
Supports PayPal, Stripe, Razorpay, and credit/debit cards
"""

import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from enum import Enum
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logger = logging.getLogger(__name__)

class PaymentGateway(str, Enum):
    STRIPE = "stripe"
    PAYPAL = "paypal"
    RAZORPAY = "razorpay"

class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"
    UPI = "upi"
    NET_BANKING = "net_banking"
    WALLET = "wallet"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"

class PaymentRequest(BaseModel):
    plan_id: str
    billing_cycle: str  # "monthly" or "yearly"
    amount: float
    currency: str = "USD"
    user_id: str
    user_email: str
    user_country: str = "US"
    payment_method: PaymentMethod
    gateway: Optional[PaymentGateway] = None

class PaymentResponse(BaseModel):
    payment_id: str
    status: PaymentStatus
    gateway: PaymentGateway
    amount: float
    currency: str
    payment_url: Optional[str] = None
    transaction_id: Optional[str] = None
    error_message: Optional[str] = None

class PaymentGatewayManager:
    """Manages multiple payment gateways with automatic selection"""
    
    def __init__(self):
        self.gateways = {
            PaymentGateway.STRIPE: StripeGateway(),
            PaymentGateway.PAYPAL: PayPalGateway(),
            PaymentGateway.RAZORPAY: RazorpayGateway()
        }
        
        # Gateway preferences by country
        self.country_gateways = {
            "IN": [PaymentGateway.RAZORPAY, PaymentGateway.STRIPE],  # India
            "US": [PaymentGateway.STRIPE, PaymentGateway.PAYPAL],     # USA
            "CA": [PaymentGateway.STRIPE, PaymentGateway.PAYPAL],     # Canada
            "GB": [PaymentGateway.STRIPE, PaymentGateway.PAYPAL],     # UK
            "AU": [PaymentGateway.STRIPE, PaymentGateway.PAYPAL],     # Australia
            "DE": [PaymentGateway.STRIPE, PaymentGateway.PAYPAL],     # Germany
            "FR": [PaymentGateway.STRIPE, PaymentGateway.PAYPAL],     # France
        }
        
        # Default gateway order
        self.default_gateways = [PaymentGateway.STRIPE, PaymentGateway.PAYPAL, PaymentGateway.RAZORPAY]
    
    def get_preferred_gateway(self, country: str, payment_method: PaymentMethod) -> PaymentGateway:
        """Get the best gateway for user's country and payment method"""
        try:
            # Get country-specific gateways
            country_gateways = self.country_gateways.get(country.upper(), self.default_gateways)
            
            # For Indian users, prioritize Razorpay for UPI/Net Banking
            if country.upper() == "IN" and payment_method in [PaymentMethod.UPI, PaymentMethod.NET_BANKING]:
                return PaymentGateway.RAZORPAY
            
            # For PayPal method, use PayPal gateway
            if payment_method == PaymentMethod.PAYPAL:
                return PaymentGateway.PAYPAL
            
            # For cards, prefer Stripe globally
            if payment_method in [PaymentMethod.CREDIT_CARD, PaymentMethod.DEBIT_CARD]:
                return PaymentGateway.STRIPE
            
            # Return first available gateway for the country
            return country_gateways[0]
            
        except Exception as e:
            logger.error("Error selecting gateway: %s", e)
            return PaymentGateway.STRIPE  # Fallback to Stripe
    
    async def create_payment(self, request: PaymentRequest) -> PaymentResponse:
        """Create payment with automatic gateway selection"""
        try:
            # Auto-select gateway if not specified
            if not request.gateway:
                request.gateway = self.get_preferred_gateway(
                    request.user_country, 
                    request.payment_method
                )
            
            # Get the appropriate gateway
            gateway = self.gateways.get(request.gateway)
            if not gateway:
                raise Exception(f"Gateway {request.gateway} not available")
            
            # Create payment
            return await gateway.create_payment(request)
            
        except Exception as e:
            logger.error("Payment creation failed: %s", e)
            return PaymentResponse(
                payment_id="",
                status=PaymentStatus.FAILED,
                gateway=request.gateway or PaymentGateway.STRIPE,
                amount=request.amount,
                currency=request.currency,
                error_message=str(e)
            )
    
    async def verify_payment(self, payment_id: str, gateway: PaymentGateway) -> PaymentResponse:
        """Verify payment status"""
        try:
            gateway_instance = self.gateways.get(gateway)
            if not gateway_instance:
                raise Exception(f"Gateway {gateway} not available")
            
            return await gateway_instance.verify_payment(payment_id)
            
        except Exception as e:
            logger.error("Payment verification failed: %s", e)
            return PaymentResponse(
                payment_id=payment_id,
                status=PaymentStatus.FAILED,
                gateway=gateway,
                amount=0,
                currency="USD",
                error_message=str(e)
            )

class StripeGateway:
    """Stripe payment gateway implementation"""
    
    def __init__(self):
        self.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.publishable_key = os.getenv("STRIPE_PUBLISHABLE_KEY")
        self.webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    async def create_payment(self, request: PaymentRequest) -> PaymentResponse:
        """Create Stripe payment"""
        try:
            import stripe
            stripe.api_key = self.api_key
            
            # Create payment intent
            intent = stripe.PaymentIntent.create(
                amount=int(request.amount * 100),  # Convert to cents
                currency=request.currency.lower(),
                metadata={
                    "plan_id": request.plan_id,
                    "billing_cycle": request.billing_cycle,
                    "user_id": request.user_id,
                    "user_email": request.user_email
                }
            )
            
            return PaymentResponse(
                payment_id=intent.id,
                status=PaymentStatus.PENDING,
                gateway=PaymentGateway.STRIPE,
                amount=request.amount,
                currency=request.currency,
                transaction_id=intent.id
            )
            
        except Exception as e:
            logger.error("Stripe payment creation failed: %s", e)
            return PaymentResponse(
                payment_id="",
                status=PaymentStatus.FAILED,
                gateway=PaymentGateway.STRIPE,
                amount=request.amount,
                currency=request.currency,
                error_message=str(e)
            )
    
    async def verify_payment(self, payment_id: str) -> PaymentResponse:
        """Verify Stripe payment"""
        try:
            import stripe
            stripe.api_key = self.api_key
            
            intent = stripe.PaymentIntent.retrieve(payment_id)
            
            status_map = {
                "succeeded": PaymentStatus.SUCCESS,
                "processing": PaymentStatus.PENDING,
                "requires_payment_method": PaymentStatus.FAILED,
                "canceled": PaymentStatus.CANCELLED
            }
            
            return PaymentResponse(
                payment_id=payment_id,
                status=status_map.get(intent.status, PaymentStatus.FAILED),
                gateway=PaymentGateway.STRIPE,
                amount=intent.amount / 100,
                currency=intent.currency.upper(),
                transaction_id=intent.id
            )
            
        except Exception as e:
            logger.error("Stripe payment verification failed: %s", e)
            return PaymentResponse(
                payment_id=payment_id,
                status=PaymentStatus.FAILED,
                gateway=PaymentGateway.STRIPE,
                amount=0,
                currency="USD",
                error_message=str(e)
            )

class PayPalGateway:
    """PayPal payment gateway implementation"""
    
    def __init__(self):
        self.client_id = os.getenv("PAYPAL_CLIENT_ID")
        self.client_secret = os.getenv("PAYPAL_CLIENT_SECRET")
        self.mode = os.getenv("PAYPAL_MODE", "sandbox")  # sandbox or live
    
    async def create_payment(self, request: PaymentRequest) -> PaymentResponse:
        """Create PayPal payment"""
        try:
            import paypalrestsdk
            
            paypalrestsdk.configure({
                "mode": self.mode,
                "client_id": self.client_id,
                "client_secret": self.client_secret
            })
            
            payment = paypalrestsdk.Payment({
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment/success",
                    "cancel_url": f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": f"CareerForge AI - {request.plan_id.title()} Plan",
                            "sku": request.plan_id,
                            "price": str(request.amount),
                            "currency": request.currency,
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "total": str(request.amount),
                        "currency": request.currency
                    },
                    "description": f"CareerForge AI {request.billing_cycle} subscription"
                }]
            })
            
            if payment.create():
                return PaymentResponse(
                    payment_id=payment.id,
                    status=PaymentStatus.PENDING,
                    gateway=PaymentGateway.PAYPAL,
                    amount=request.amount,
                    currency=request.currency,
                    payment_url=payment.links[1].href  # PayPal approval URL
                )
            else:
                raise Exception(f"PayPal payment creation failed: {payment.error}")
                
        except Exception as e:
            logger.error("PayPal payment creation failed: %s", e)
            return PaymentResponse(
                payment_id="",
                status=PaymentStatus.FAILED,
                gateway=PaymentGateway.PAYPAL,
                amount=request.amount,
                currency=request.currency,
                error_message=str(e)
            )
    
    async def verify_payment(self, payment_id: str) -> PaymentResponse:
        """Verify PayPal payment"""
        try:
            import paypalrestsdk
            
            paypalrestsdk.configure({
                "mode": self.mode,
                "client_id": self.client_id,
                "client_secret": self.client_secret
            })
            
            payment = paypalrestsdk.Payment.find(payment_id)
            
            status_map = {
                "approved": PaymentStatus.SUCCESS,
                "pending": PaymentStatus.PENDING,
                "failed": PaymentStatus.FAILED,
                "canceled": PaymentStatus.CANCELLED
            }
            
            return PaymentResponse(
                payment_id=payment_id,
                status=status_map.get(payment.state, PaymentStatus.FAILED),
                gateway=PaymentGateway.PAYPAL,
                amount=float(payment.transactions[0].amount.total),
                currency=payment.transactions[0].amount.currency,
                transaction_id=payment.id
            )
            
        except Exception as e:
            logger.error("PayPal payment verification failed: %s", e)
            return PaymentResponse(
                payment_id=payment_id,
                status=PaymentStatus.FAILED,
                gateway=PaymentGateway.PAYPAL,
                amount=0,
                currency="USD",
                error_message=str(e)
            )

class RazorpayGateway:
    """Razorpay payment gateway implementation for Indian users"""
    
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    
    async def create_payment(self, request: PaymentRequest) -> PaymentResponse:
        """Create Razorpay payment"""
        try:
            import razorpay
            
            client = razorpay.Client(auth=(self.key_id, self.key_secret))
            
            # Create order
            order_data = {
                "amount": int(request.amount * 100),  # Convert to paise
                "currency": "INR" if request.currency == "USD" else request.currency,
                "receipt": f"careerforge_{request.user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                "notes": {
                    "plan_id": request.plan_id,
                    "billing_cycle": request.billing_cycle,
                    "user_id": request.user_id,
                    "user_email": request.user_email
                }
            }
            
            order = client.order.create(data=order_data)
            
            return PaymentResponse(
                payment_id=order["id"],
                status=PaymentStatus.PENDING,
                gateway=PaymentGateway.RAZORPAY,
                amount=request.amount,
                currency=request.currency,
                payment_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/payment/razorpay/{order['id']}"
            )
            
        except Exception as e:
            logger.error("Razorpay payment creation failed: %s", e)
            return PaymentResponse(
                payment_id="",
                status=PaymentStatus.FAILED,
                gateway=PaymentGateway.RAZORPAY,
                amount=request.amount,
                currency=request.currency,
                error_message=str(e)
            )
    
    async def verify_payment(self, payment_id: str) -> PaymentResponse:
        """Verify Razorpay payment"""
        try:
            import razorpay
            
            client = razorpay.Client(auth=(self.key_id, self.key_secret))
            
            payment = client.payment.fetch(payment_id)
            
            status_map = {
                "captured": PaymentStatus.SUCCESS,
                "authorized": PaymentStatus.PENDING,
                "failed": PaymentStatus.FAILED,
                "refunded": PaymentStatus.REFUNDED
            }
            
            return PaymentResponse(
                payment_id=payment_id,
                status=status_map.get(payment["status"], PaymentStatus.FAILED),
                gateway=PaymentGateway.RAZORPAY,
                amount=payment["amount"] / 100,
                currency=payment["currency"].upper(),
                transaction_id=payment["id"]
            )
            
        except Exception as e:
            logger.error("Razorpay payment verification failed: %s", e)
            return PaymentResponse(
                payment_id=payment_id,
                status=PaymentStatus.FAILED,
                gateway=PaymentGateway.RAZORPAY,
                amount=0,
                currency="INR",
                error_message=str(e)
            )

# Global payment manager instance
payment_manager = PaymentGatewayManager()

# Convenience functions for API endpoints
async def create_payment(request: PaymentRequest) -> PaymentResponse:
    """Create payment with automatic gateway selection"""
    return await payment_manager.create_payment(request)

async def verify_payment(payment_id: str, gateway: PaymentGateway) -> PaymentResponse:
    """Verify payment status"""
    return await payment_manager.verify_payment(payment_id, gateway)

def get_supported_payment_methods(country: str) -> List[Dict[str, Any]]:
    """Get supported payment methods for a country"""
    methods = []
    
    if country.upper() == "IN":
        # India - Razorpay methods
        methods.extend([
            {"id": "credit_card", "name": "Credit Card", "gateway": "razorpay"},
            {"id": "debit_card", "name": "Debit Card", "gateway": "razorpay"},
            {"id": "upi", "name": "UPI", "gateway": "razorpay"},
            {"id": "net_banking", "name": "Net Banking", "gateway": "razorpay"},
            {"id": "wallet", "name": "Digital Wallets", "gateway": "razorpay"}
        ])
    else:
        # International - Stripe and PayPal
        methods.extend([
            {"id": "credit_card", "name": "Credit Card", "gateway": "stripe"},
            {"id": "debit_card", "name": "Debit Card", "gateway": "stripe"},
            {"id": "paypal", "name": "PayPal", "gateway": "paypal"}
        ])
    
    return methods 