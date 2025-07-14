"""
Subscription Plans Module
Defines subscription plans for CareerForge AI (Domestic - INR only)
"""

from enum import Enum
from typing import Any


class PlanType(str, Enum):
    FREE = "free"
    BASIC = "basic"
    PREMIUM = "premium"
    ENTERPRISE = "enterprise"

class BillingCycle(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"

class SubscriptionPlan:
    def __init__(
        self,
        id: str,
        name: str,
        price: float,
        currency: str = "INR",
        billing_cycle: BillingCycle = BillingCycle.MONTHLY,
        features: list[str] = None,
        limits: dict[str, Any] = None,
        popular: bool = False
    ):
        self.id = id
        self.name = name
        self.price = price
        self.currency = currency
        self.billing_cycle = billing_cycle
        self.features = features or []
        self.limits = limits or {}
        self.popular = popular

# Define subscription plans for domestic market (INR)
SUBSCRIPTION_PLANS = {
    PlanType.FREE: SubscriptionPlan(
        id="free",
        name="Free Plan",
        price=0.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "5 AI chats per month",
            "Basic resume analysis",
            "Community support",
            "Basic job matching"
        ],
        limits={
            "ai_chats": 5,
            "resume_parsing": 2,
            "job_matching": 3
        }
    ),
    
    PlanType.BASIC: SubscriptionPlan(
        id="basic",
        name="Basic Plan",
        price=299.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "50 AI chats per month",
            "Advanced resume analysis",
            "Job matching",
            "Email support",
            "Cover letter generation"
        ],
        limits={
            "ai_chats": 50,
            "resume_parsing": 10,
            "job_matching": 20
        }
    ),
    
    PlanType.PREMIUM: SubscriptionPlan(
        id="premium",
        name="Premium Plan",
        price=599.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "Unlimited AI chats",
            "Advanced resume analysis",
            "Priority job matching",
            "Voice assistant",
            "LinkedIn optimization",
            "Priority support",
            "All features unlocked"
        ],
        limits={
            "ai_chats": -1,  # Unlimited
            "resume_parsing": -1,  # Unlimited
            "job_matching": -1  # Unlimited
        },
        popular=True
    ),
    
    PlanType.ENTERPRISE: SubscriptionPlan(
        id="enterprise",
        name="Enterprise Plan",
        price=1499.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "All Premium features",
            "Custom integrations",
            "API access",
            "Dedicated support",
            "Custom branding",
            "Team management"
        ],
        limits={
            "ai_chats": -1,  # Unlimited
            "resume_parsing": -1,  # Unlimited
            "job_matching": -1  # Unlimited
        }
    )
}

def get_plan(plan_id: str) -> SubscriptionPlan:
    """Get a subscription plan by ID"""
    return SUBSCRIPTION_PLANS.get(plan_id)

def get_all_plans() -> dict[str, SubscriptionPlan]:
    """Get all subscription plans"""
    return SUBSCRIPTION_PLANS

def get_plan_features(plan_id: str) -> list[str]:
    """Get features for a specific plan"""
    plan = get_plan(plan_id)
    return plan.features if plan else []

def get_plan_limits(plan_id: str) -> dict[str, Any]:
    """Get limits for a specific plan"""
    plan = get_plan(plan_id)
    return plan.limits if plan else {}

def is_feature_available(plan_id: str, feature: str) -> bool:
    """Check if a feature is available in a plan"""
    plan = get_plan(plan_id)
    if not plan:
        return False
    
    # Free plan has limited features
    if plan_id == "free":
        return feature in ["ai_chats", "resume_parsing", "job_matching"]
    
    # All other plans have all features
    return True

def get_plan_price(plan_id: str, billing_cycle: BillingCycle = BillingCycle.MONTHLY) -> float:
    """Get price for a plan"""
    plan = get_plan(plan_id)
    if not plan:
        return 0.0
    
    # Apply yearly discount
    if billing_cycle == BillingCycle.YEARLY and plan_id != "free":
        return plan.price * 10  # 2 months free for yearly
    
    return plan.price 