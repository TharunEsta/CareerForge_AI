"""
Subscription Router
Handles subscription-related endpoints for CareerForge AI
"""

import logging

from fastapi import APIRouter, HTTPException

from payment_gateways import PaymentMethod, PaymentRequest
from payment_router import create_payment_endpoint
from subscription_plans import BillingCycle, get_all_plans, get_plan, get_plan_price

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/plans")
async def get_subscription_plans():
    """Get all available subscription plans"""
    try:
        plans = get_all_plans()
        plans_data = []
        
        for plan_id, plan in plans.items():
            plans_data.append({
                "id": plan.id,
                "name": plan.name,
                "price": plan.price,
                "currency": plan.currency,
                "features": plan.features,
                "limits": plan.limits,
                "popular": plan.popular,
                "monthly_price": get_plan_price(plan.id, BillingCycle.MONTHLY),
                "yearly_price": get_plan_price(plan.id, BillingCycle.YEARLY)
            })
        
        return {
            "success": True,
            "plans": plans_data,
            "currency": "INR",
            "region": "India"
        }
        
    except Exception as e:
        logger.error(f"Failed to get subscription plans: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/plans/{plan_id}")
async def get_subscription_plan(plan_id: str):
    """Get a specific subscription plan"""
    try:
        plan = get_plan(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        return {
            "success": True,
            "plan": {
                "id": plan.id,
                "name": plan.name,
                "price": plan.price,
                "currency": plan.currency,
                "features": plan.features,
                "limits": plan.limits,
                "popular": plan.popular,
                "monthly_price": get_plan_price(plan.id, BillingCycle.MONTHLY),
                "yearly_price": get_plan_price(plan.id, BillingCycle.YEARLY)
            }
        }
        
    except Exception as e:
        logger.error(f"Failed to get subscription plan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upgrade")
async def upgrade_subscription(
    plan_id: str,
    billing_cycle: BillingCycle = BillingCycle.MONTHLY,
    user_id: str = None,
    user_email: str = None,
    user_name: str = None,
    payment_method: PaymentMethod = PaymentMethod.UPI
):
    """Upgrade user subscription"""
    try:
        # Validate plan
        plan = get_plan(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Get plan price
        price = get_plan_price(plan_id, billing_cycle)
        
        # Create payment request
        payment_request = PaymentRequest(
            amount=price,
            currency="INR",
            user_id=user_id or "anonymous",
            user_email=user_email or "user@example.com",
            user_name=user_name or "User",
            description=f"CareerForge AI - {plan.name} ({billing_cycle.value})",
            plan_id=plan_id,
            payment_method=payment_method
        )
        
        # Create payment
        payment_response = await create_payment_endpoint(payment_request)
        
        return {
            "success": True,
            "plan_id": plan_id,
            "billing_cycle": billing_cycle.value,
            "price": price,
            "currency": "INR",
            "payment": payment_response
        }
        
    except Exception as e:
        logger.error(f"Subscription upgrade failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}")
async def get_user_subscription(user_id: str):
    """Get user's current subscription"""
    try:
        # Mock user subscription data
        # In production, this would come from database
        user_subscription = {
            "user_id": user_id,
            "plan_id": "free",
            "status": "active",
            "current_usage": {
                "ai_chats": 2,
                "resume_parsing": 1,
                "job_matching": 1
            },
            "limits": {
                "ai_chats": 5,
                "resume_parsing": 2,
                "job_matching": 3
            }
        }
        
        return {
            "success": True,
            "subscription": user_subscription
        }
        
    except Exception as e:
        logger.error(f"Failed to get user subscription: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/cancel")
async def cancel_subscription(user_id: str):
    """Cancel user subscription"""
    try:
        # Mock cancellation
        # In production, this would update database
        logger.info(f"Subscription cancelled for user: {user_id}")
        
        return {
            "success": True,
            "message": "Subscription cancelled successfully"
        }
        
    except Exception as e:
        logger.error(f"Failed to cancel subscription: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def subscription_health_check():
    """Health check for subscription service"""
    return {
        "status": "healthy",
        "service": "subscription",
        "currency": "INR",
        "region": "India"
    } 