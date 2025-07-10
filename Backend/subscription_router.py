"""
Subscription Router for CareerForge AI
Handles subscription plans, pricing, and usage tracking
"""
import logging
from datetime import datetime
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from subscription_plans import (
    check_user_access,
    check_user_usage,
    get_plan_by_id,
    get_plans,
)
from payment_gateways import PayPalGateway

# Setup logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/subscription", tags=["subscription"])

# Initialize PayPal gateway
paypal_gateway = PayPalGateway()

# PYDANTIC MODELS

class PlanResponse(BaseModel):
    id: str
    name: str
    price_monthly: float
    price_yearly: float
    description: str
    features: list[dict[str, Any]]
    limits: dict[str, int]
    popular: bool = False
    savings_percentage: float

class UsageCheckRequest(BaseModel):
    user_plan: str
    feature: str
    current_usage: int

class UsageCheckResponse(BaseModel):
    allowed: bool
    limit: int
    current_usage: int
    remaining: int
    plan_name: str

class FeatureAccessRequest(BaseModel):
    user_plan: str
    feature: str

class FeatureAccessResponse(BaseModel):
    has_access: bool
    feature_name: str
    plan_name: str

class PlansComparisonResponse(BaseModel):
    plans: list[dict[str, Any]]
    features: list[str]
    currency: str
    billing_cycle: str

class UpgradeRequest(BaseModel):
    plan: str
    userId: str
    billing_cycle: str = "monthly"
    user_email: str = ""

class UpgradeResponse(BaseModel):
    success: bool
    checkoutUrl: str | None = None
    message: str

# SUBSCRIPTION ENDPOINTS

@router.get("/plans", response_model=list[PlanResponse])
async def get_subscription_plans():
    """Get all available subscription plans"""
    try:
        plans = get_plans()
        response_plans = []
        
        for plan in plans:
            # Calculate savings percentage for yearly plans
            if plan.price_monthly > 0:
                yearly_cost = plan.price_monthly * 12
                savings = ((yearly_cost - plan.price_yearly) / yearly_cost) * 100
            else:
                savings = 0.0
            
            # Convert features to dict format
            features = []
            for feature in plan.features:
                features.append({
                    "name": feature.name,
                    "description": feature.description,
                    "available": feature.available
                })
            
            response_plans.append(PlanResponse(
                id=plan.id,
                name=plan.name,
                price_monthly=plan.price_monthly,
                price_yearly=plan.price_yearly,
                description=plan.description,
                features=features,
                limits=plan.limits,
                popular=plan.popular,
                savings_percentage=round(savings, 1)
            ))
        
        return response_plans
        
    except Exception as e:
        logger.error("Error fetching subscription plans: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fetch subscription plans")

@router.get("/plans/{plan_id}", response_model=PlanResponse)
async def get_subscription_plan(plan_id: str):
    """Get specific subscription plan by ID"""
    try:
        plan = get_plan_by_id(plan_id)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Calculate savings percentage
        if plan.price_monthly > 0:
            yearly_cost = plan.price_monthly * 12
            savings = ((yearly_cost - plan.price_yearly) / yearly_cost) * 100
        else:
            savings = 0.0
        
        # Convert features to dict format
        features = []
        for feature in plan.features:
            features.append({
                "name": feature.name,
                "description": feature.description,
                "available": feature.available
            })
        
        return PlanResponse(
            id=plan.id,
            name=plan.name,
            price_monthly=plan.price_monthly,
            price_yearly=plan.price_yearly,
            description=plan.description,
            features=features,
            limits=plan.limits,
            popular=plan.popular,
            savings_percentage=round(savings, 1)
        )
        
    except Exception as e:
        logger.error("Error fetching plan %s: %s", plan_id, e)
        raise HTTPException(status_code=500, detail="Failed to fetch plan")

@router.post("/check-usage", response_model=UsageCheckResponse)
async def check_usage_limits(request: UsageCheckRequest):
    """Check if user has exceeded usage limits for a feature"""
    try:
        usage_info = check_user_usage(request.user_plan, request.feature, request.current_usage)
        plan = get_plan_by_id(request.user_plan)
        plan_name = plan.name if plan else "Unknown"
        
        return UsageCheckResponse(
            allowed=usage_info["allowed"],
            limit=usage_info["limit"],
            current_usage=usage_info["current_usage"],
            remaining=usage_info["remaining"],
            plan_name=plan_name
        )
        
    except Exception as e:
        logger.error("Error checking usage limits: %s", e)
        raise HTTPException(status_code=500, detail="Failed to check usage limits")

@router.post("/check-access", response_model=FeatureAccessResponse)
async def check_feature_access(request: FeatureAccessRequest):
    """Check if user has access to a specific feature"""
    try:
        has_access = check_user_access(request.user_plan, request.feature)
        plan = get_plan_by_id(request.user_plan)
        plan_name = plan.name if plan else "Unknown"
        
        return FeatureAccessResponse(
            has_access=has_access,
            feature_name=request.feature,
            plan_name=plan_name
        )
        
    except Exception as e:
        logger.error("Error checking feature access: %s", e)
        raise HTTPException(status_code=500, detail="Failed to check feature access")

@router.get("/comparison", response_model=PlansComparisonResponse)
async def get_plans_comparison():
    """Get detailed plan comparison for pricing page"""
    try:
        from subscription_plans import subscription_manager
        
        comparison = subscription_manager.get_plan_comparison()
        return PlansComparisonResponse(**comparison)
        
    except Exception as e:
        logger.error("Error generating plan comparison: %s", e)
        raise HTTPException(status_code=500, detail="Failed to generate plan comparison")

@router.post("/upgrade", response_model=UpgradeResponse)
async def upgrade_subscription(request: UpgradeRequest):
    """Upgrade user subscription to a new plan using PayPal"""
    try:
        # Validate the requested plan
        plan = get_plan_by_id(request.plan)
        if not plan:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Get pricing based on billing cycle
        if request.billing_cycle == "yearly":
            price = plan.price_yearly
            interval = "year"
        else:
            price = plan.price_monthly
            interval = "month"
        
        # For free plan, just update the user's plan
        if plan.id == "free":
            # Here you would update the user's plan in your database
            # For now, we'll return success
            return UpgradeResponse(
                success=True,
                message="Successfully upgraded to Free plan"
            )
        
        # For paid plans, create PayPal subscription
        try:
            # Create PayPal subscription
            payment_response = await paypal_gateway.create_subscription(
                plan_id=request.plan,
                billing_cycle=interval,
                amount=price,
                user_email=request.user_email
            )
            
            if payment_response.status.value == "pending":
                return UpgradeResponse(
                    success=True,
                    checkoutUrl=payment_response.payment_url,
                    message="PayPal subscription created successfully"
                )
            else:
                raise Exception(f"PayPal subscription creation failed: {payment_response.error_message}")
                
        except ImportError:
            # PayPal SDK not available, return mock response for development
            logger.warning("PayPal SDK not available, returning mock checkout URL")
            return UpgradeResponse(
                success=True,
                checkoutUrl="https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_xclick-subscriptions&business=your-paypal-email@example.com&item_name=CareerForge%20AI%20Subscription&a3=19.00&p3=1&t3=M&src=1&currency_code=USD",
                message="Mock PayPal subscription created (PayPal SDK not configured)"
            )
        
    except Exception as e:
        logger.error("Error upgrading subscription: %s", e)
        raise HTTPException(status_code=500, detail="Failed to upgrade subscription")

@router.get("/features")
async def get_all_features():
    """Get all available features across all plans"""
    try:
        from subscription_plans import FEATURES
        
        features = []
        for feature_id, feature in FEATURES.items():
            features.append({
                "id": feature_id,
                "name": feature.name,
                "description": feature.description
            })
        
        return {"features": features}
        
    except Exception as e:
        logger.error("Error fetching features: %s", e)
        raise HTTPException(status_code=500, detail="Failed to fetch features")

@router.get("/health")
async def subscription_health_check():
    """Health check for subscription service"""
    try:
        plans = get_plans()
        return {
            "status": "healthy",
            "plans_count": len(plans),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error("Subscription health check failed: %s", e)
        raise HTTPException(status_code=500, detail="Subscription service unhealthy") 