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
        features: list[str] | None = None,
        limits: dict[str, Any] | None = None,
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

# Define subscription plans to match frontend pricing
SUBSCRIPTION_PLANS = {
    PlanType.FREE: SubscriptionPlan(
        id="free",
        name="Free Plan",
        price=0.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "Access to GPT-4o mini and reasoning",
            "Standard voice mode",
            "Real-time data from the web with search",
            "Limited access to GPT-4o and o4-mini",
            "Limited access to file uploads, advanced data analysis, and image generation",
            "Use custom GPTs"
        ],
        limits={
            "ai_chats": 5,
            "resume_parsing": 2,
            "job_matching": 3
        }
    ),
    
    PlanType.BASIC: SubscriptionPlan(
        id="plus",
        name="Plus Plan",
        price=599.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "Everything in Free",
            "Extended limits on messaging, file uploads, advanced data analysis, and image generation",
            "Standard and advanced voice mode",
            "Access to deep research, multiple reasoning models (o4-mini, o4-mini-high, and o3), and a research preview of GPT-4.5",
            "Create and use tasks, projects, and custom GPTs",
            "Limited access to Sora video generation",
            "Opportunities to test new features"
        ],
        limits={
            "ai_chats": 100,
            "resume_parsing": 20,
            "job_matching": 50
        },
        popular=True
    ),
    
    PlanType.PREMIUM: SubscriptionPlan(
        id="pro",
        name="Pro Plan",
        price=1399.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "Everything in Plus",
            "Unlimited access to all reasoning models and GPT-4o",
            "Unlimited access to advanced voice",
            "Extended access to deep research, which conducts multi-step online research for complex tasks",
            "Access to research previews of GPT-4.5 and Operator",
            "Access to o3 pro mode, which uses more compute for the best answers to the hardest questions",
            "Extended access to Sora video generation"
        ],
        limits={
            "ai_chats": -1,  # Unlimited
            "resume_parsing": -1,  # Unlimited
            "job_matching": -1  # Unlimited
        }
    ),
    
    PlanType.ENTERPRISE: SubscriptionPlan(
        id="business",
        name="Business Plan",
        price=1999.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "Everything in Pro",
            "Team management and collaboration tools",
            "Advanced security and compliance",
            "Priority support",
            "Custom integrations",
            "Enterprise-grade analytics"
        ],
        limits={
            "ai_chats": -1,  # Unlimited
            "resume_parsing": -1,  # Unlimited
            "job_matching": -1  # Unlimited
        }
    )
}

def get_plan(plan_id: str) -> SubscriptionPlan | None:
    """Get a subscription plan by ID"""
    for plan in SUBSCRIPTION_PLANS.values():
        if plan.id == plan_id:
            return plan
    return None

def get_all_plans() -> dict[str, SubscriptionPlan]:
    """Get all subscription plans"""
    return {plan.id: plan for plan in SUBSCRIPTION_PLANS.values()}

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