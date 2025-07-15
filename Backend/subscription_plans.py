"""
Subscription Plans Module
Defines subscription plans and pricing for CareerForge AI
"""

from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class BillingCycle(str, Enum):
    MONTHLY = "monthly"
    YEARLY = "yearly"

class PlanType(str, Enum):
    FREE = "free"
    PLUS = "plus"
    PRO = "pro"
    BUSINESS = "business"

class SubscriptionPlan:
    def __init__(
        self,
        id: str,
        name: str,
        price: float,
        description: str,
        features: List[str],
        limits: Dict[str, int],
        billing_cycles: List[BillingCycle] = None
    ):
        self.id = id
        self.name = name
        self.price = price
        self.description = description
        self.features = features
        self.limits = limits
        self.billing_cycles = billing_cycles or [BillingCycle.MONTHLY]

# Define subscription plans
SUBSCRIPTION_PLANS = {
    PlanType.FREE: SubscriptionPlan(
        id="free",
        name="Free",
        price=0.0,
        description="Basic career tools to get started",
        features=[
            "3 Resume Analysis per month",
            "Basic AI chat (5 per month)",
            "Community support",
            "Basic job matching (3 per month)"
        ],
        limits={
            "resume_analysis": 3,
            "ai_chat": 5,
            "job_matching": 3,
            "resume_rewrite": 0,
            "cover_letter": 0,
            "image_generation": 0,
            "voice_assistant": 0
        }
    ),
    
    PlanType.PLUS: SubscriptionPlan(
        id="plus",
        name="Plus",
        price=599.0,
        description="Advanced career optimization tools",
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
            "resume_analysis": 45,
            "resume_rewrite": 45,
            "cover_letter": 45,
            "job_matching": 50,
            "image_generation": 20,
            "ai_chat": 100,
            "voice_assistant": 50
        }
    ),
    
    PlanType.PRO: SubscriptionPlan(
        id="pro",
        name="Pro",
        price=1399.0,
        description="Complete career optimization suite",
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
            "resume_rewrite": -1,   # Unlimited
            "cover_letter": -1,     # Unlimited
            "job_matching": -1,     # Unlimited
            "image_generation": -1, # Unlimited
            "ai_chat": -1,          # Unlimited
            "voice_assistant": -1   # Unlimited
        }
    ),
    
    PlanType.BUSINESS: SubscriptionPlan(
        id="business",
        name="Business",
        price=1999.0,
        description="Enterprise-grade career optimization for teams",
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
            "resume_rewrite": -1,   # Unlimited
            "cover_letter": -1,     # Unlimited
            "job_matching": -1,     # Unlimited
            "image_generation": -1, # Unlimited
            "ai_chat": -1,          # Unlimited
            "voice_assistant": -1   # Unlimited
        }
    )
}

def get_plan(plan_id: str) -> Optional[SubscriptionPlan]:
    """Get subscription plan by ID"""
    for plan_type, plan in SUBSCRIPTION_PLANS.items():
        if plan.id == plan_id:
            return plan
    return None

def get_plan_price(plan_id: str, billing_cycle: BillingCycle = BillingCycle.MONTHLY) -> float:
    """Get plan price for billing cycle"""
    plan = get_plan(plan_id)
    if not plan:
        return 0.0
    
    if billing_cycle == BillingCycle.YEARLY:
        # Apply 20% discount for yearly billing
        return plan.price * 12 * 0.8
    else:
        return plan.price

def get_plan_limit(plan_id: str, feature: str) -> int:
    """Get feature limit for plan"""
    plan = get_plan(plan_id)
    if not plan:
        return 0
    
    return plan.limits.get(feature, 0)

def is_feature_unlimited(plan_id: str, feature: str) -> bool:
    """Check if feature is unlimited for plan"""
    limit = get_plan_limit(plan_id, feature)
    return limit == -1

def get_all_plans() -> Dict[str, SubscriptionPlan]:
    """Get all subscription plans"""
    return SUBSCRIPTION_PLANS

def get_plan_features(plan_id: str) -> List[str]:
    """Get features for plan"""
    plan = get_plan(plan_id)
    if not plan:
        return []
    return plan.features

def get_plan_limits(plan_id: str) -> Dict[str, int]:
    """Get all limits for plan"""
    plan = get_plan(plan_id)
    if not plan:
        return {}
    return plan.limits

def validate_plan_access(plan_id: str, feature: str, current_usage: int) -> bool:
    """Validate if user can access feature based on plan and usage"""
    plan = get_plan(plan_id)
    if not plan:
        return False
    
    limit = plan.limits.get(feature, 0)
    
    # Unlimited features
    if limit == -1:
        return True
    
    # Check if usage is within limit
    return current_usage < limit

def get_remaining_usage(plan_id: str, feature: str, current_usage: int) -> int:
    """Get remaining usage for feature"""
    plan = get_plan(plan_id)
    if not plan:
        return 0
    
    limit = plan.limits.get(feature, 0)
    
    # Unlimited features
    if limit == -1:
        return -1
    
    # Calculate remaining usage
    remaining = limit - current_usage
    return max(0, remaining) 