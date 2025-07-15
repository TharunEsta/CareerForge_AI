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
            "3 Resume Analysis per month",
            "Basic AI chat (5 per month)",
            "Community support",
            "Basic job matching (3 per month)"
        ],
        limits={
            "resume_analysis": 3,
            "ai_chats": 5,
            "job_matching": 3,
            "resume_rewriting": 0,
            "cover_letter_generation": 0,
            "image_generation": 0,
            "voice_assistant": False,
            "daily_news": False
        }
    ),
    
    PlanType.BASIC: SubscriptionPlan(
        id="plus",
        name="Plus Plan",
        price=599.0,
        currency="INR",
        billing_cycle=BillingCycle.MONTHLY,
        features=[
            "Resume Analysis + Rewriting (45 times)",
            "Cover Letter Generation with Job Description (45 times)",
            "Job Matching (50 times per month)",
            "Image Generation",
            "Daily News Updates",
            "Voice Assistant",
            "Advanced AI chat (100 per month)",
            "Email support"
        ],
        limits={
            "resume_analysis": -1,  # Unlimited
            "resume_rewriting": 45,
            "cover_letter_generation": 45,
            "job_matching": 50,
            "image_generation": 20,
            "ai_chats": 100,
            "voice_assistant": True,
            "daily_news": True
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
            "Unlimited Resume Analysis",
            "Unlimited Resume Rewriting",
            "Unlimited Cover Letter Generation",
            "Unlimited Job Matching",
            "Unlimited Image Generation",
            "Unlimited AI Chats",
            "Advanced Voice Assistant",
            "Priority support",
            "All features unlocked"
        ],
        limits={
            "resume_analysis": -1,  # Unlimited
            "resume_rewriting": -1,  # Unlimited
            "cover_letter_generation": -1,  # Unlimited
            "job_matching": -1,  # Unlimited
            "image_generation": -1,  # Unlimited
            "ai_chats": -1,  # Unlimited
            "voice_assistant": True,
            "daily_news": True
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
            "Team Management",
            "Advanced Security & Compliance",
            "Priority Support",
            "Custom Integrations",
            "Enterprise Analytics",
            "All features unlimited"
        ],
        limits={
            "resume_analysis": -1,  # Unlimited
            "resume_rewriting": -1,  # Unlimited
            "cover_letter_generation": -1,  # Unlimited
            "job_matching": -1,  # Unlimited
            "image_generation": -1,  # Unlimited
            "ai_chats": -1,  # Unlimited
            "voice_assistant": True,
            "daily_news": True
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