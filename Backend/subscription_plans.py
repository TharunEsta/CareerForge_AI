"""
Subscription Plans for CareerForge AI
Startup-friendly pricing model with freemium tier
"""

from enum import Enum

from pydantic import BaseModel


class PlanType(str, Enum):
    FREE = "free"
    PLUS = "plus"
    PRO = "pro"

class Feature(BaseModel):
    name: str
    description: str
    available: bool = True

class SubscriptionPlan(BaseModel):
    id: str
    name: str
    price_monthly: float
    price_yearly: float
    description: str
    features: list[Feature]
    limits: dict[str, int]
    popular: bool = False

# Feature definitions
FEATURES = {
    "ai_chats": Feature(
        name="AI Chats",
        description="AI-powered chat conversations with GPT"
    ),
    "ats_analysis": Feature(
        name="ATS Analysis",
        description="Advanced ATS (Applicant Tracking System) analysis"
    ),
    "resume_parsing": Feature(
        name="Resume Parsing",
        description="Intelligent resume parsing and data extraction"
    ),
    "cover_letter_generation": Feature(
        name="Cover Letter Generation",
        description="AI-powered cover letter creation"
    ),
    "job_matching": Feature(
        name="Job Matching",
        description="AI-powered job matching and recommendations"
    ),
    "linkedin_optimization": Feature(
        name="LinkedIn Optimization",
        description="LinkedIn profile optimization and enhancement"
    ),
    "voice_assistant": Feature(
        name="Voice Assistant",
        description="Voice-powered AI assistant with 🎙️"
    ),
    "unlimited_usage": Feature(
        name="Unlimited Usage",
        description="No monthly usage limits"
    ),
    "priority_support": Feature(
        name="Priority Support",
        description="Priority customer support"
    ),
    "pwa_access": Feature(
        name="PWA Access",
        description="Access to Progressive Web App (Install App)"
    )
}

# Subscription Plans Configuration
SUBSCRIPTION_PLANS = {
    PlanType.FREE: SubscriptionPlan(
        id="free",
        name="Free",
        price_monthly=0.0,
        price_yearly=0.0,
        description="Perfect for getting started",
        features=[
            FEATURES["ai_chats"],
            FEATURES["ats_analysis"],
            FEATURES["cover_letter_generation"]
        ],
        limits={
            "ai_chats_per_month": 5,
            "ats_analyses_per_month": 3,
            "cover_letters_per_month": 2,
            "resume_parses_per_month": 0,
            "job_matches_per_month": 0,
            "linkedin_optimizations_per_month": 0,
            "voice_assistant_calls_per_month": 0,
            "pwa_access": 0
        }
    ),
    
    PlanType.PLUS: SubscriptionPlan(
        id="plus",
        name="Plus",
        price_monthly=19.0,
        price_yearly=190.0,
        description="Great for active job seekers",
        popular=True,
        features=[
            FEATURES["ai_chats"],
            FEATURES["ats_analysis"],
            FEATURES["cover_letter_generation"],
            FEATURES["resume_parsing"],
            FEATURES["job_matching"],
            FEATURES["linkedin_optimization"]
        ],
        limits={
            "ai_chats_per_month": 100,
            "ats_analyses_per_month": 50,
            "cover_letters_per_month": 25,
            "resume_parses_per_month": 20,
            "job_matches_per_month": 30,
            "linkedin_optimizations_per_month": 10,
            "voice_assistant_calls_per_month": 0,
            "pwa_access": 0
        }
    ),
    
    PlanType.PRO: SubscriptionPlan(
        id="pro",
        name="Pro",
        price_monthly=49.0,
        price_yearly=490.0,
        description="For power users and professionals",
        features=[
            FEATURES["ai_chats"],
            FEATURES["ats_analysis"],
            FEATURES["cover_letter_generation"],
            FEATURES["resume_parsing"],
            FEATURES["job_matching"],
            FEATURES["linkedin_optimization"],
            FEATURES["voice_assistant"],
            FEATURES["unlimited_usage"],
            FEATURES["priority_support"],
            FEATURES["pwa_access"]
        ],
        limits={
            "ai_chats_per_month": -1,  # Unlimited
            "ats_analyses_per_month": -1,  # Unlimited
            "cover_letters_per_month": -1,  # Unlimited
            "resume_parses_per_month": -1,  # Unlimited
            "job_matches_per_month": -1,  # Unlimited
            "linkedin_optimizations_per_month": -1,  # Unlimited
            "voice_assistant_calls_per_month": -1,  # Unlimited
            "pwa_access": 1
        }
    )
}

class SubscriptionManager:
    """Manages user subscriptions and usage limits"""
    
    def __init__(self):
        self.plans = SUBSCRIPTION_PLANS
    
    def get_plan(self, plan_type: PlanType) -> SubscriptionPlan:
        """Get subscription plan by type"""
        return self.plans[plan_type]
    
    def get_all_plans(self) -> list[SubscriptionPlan]:
        """Get all available plans"""
        return list(self.plans.values())
    
    def check_feature_access(self, user_plan: PlanType, feature: str) -> bool:
        """Check if user has access to a specific feature"""
        plan = self.get_plan(user_plan)
        for plan_feature in plan.features:
            if plan_feature.name.lower().replace(" ", "_") == feature.lower():
                return plan_feature.available
        return False
    
    def check_usage_limit(self, user_plan: PlanType, feature: str, current_usage: int) -> dict[str, any]:
        """Check if user has exceeded usage limits"""
        plan = self.get_plan(user_plan)
        
        # Get the limit for this feature
        limit_key = f"{feature}_per_month"
        limit = plan.limits.get(limit_key, 0)
        
        # Check if unlimited (-1) or within limit
        if limit == -1:
            return {
                "allowed": True,
                "limit": -1,
                "current_usage": current_usage,
                "remaining": -1
            }
        
        allowed = current_usage < limit
        remaining = max(0, limit - current_usage) if limit > 0 else 0
        
        return {
            "allowed": allowed,
            "limit": limit,
            "current_usage": current_usage,
            "remaining": remaining
        }
    
    def get_plan_comparison(self) -> dict[str, any]:
        """Get detailed plan comparison for pricing page"""
        features = [
            "AI Chats",
            "ATS Analysis", 
            "Cover Letter Generation",
            "Resume Parsing",
            "Job Matching",
            "LinkedIn Optimization",
            "Voice Assistant",
            "Unlimited Usage",
            "Priority Support",
            "PWA Access"
        ]
        
        return {
            "plans": [
                {
                    "id": plan.id,
                    "name": plan.name,
                    "price_monthly": plan.price_monthly,
                    "price_yearly": plan.price_yearly,
                    "description": plan.description,
                    "popular": plan.popular,
                    "features": [f.name for f in plan.features]
                }
                for plan in self.plans.values()
            ],
            "features": features,
            "currency": "USD",
            "billing_cycle": "monthly"
        }

# Global subscription manager instance
subscription_manager = SubscriptionManager()

# Helper functions
def get_plans() -> list[SubscriptionPlan]:
    """Get all available subscription plans"""
    return subscription_manager.get_all_plans()

def get_plan_by_id(plan_id: str) -> SubscriptionPlan | None:
    """Get subscription plan by ID"""
    for plan in subscription_manager.get_all_plans():
        if plan.id == plan_id:
            return plan
    return None

def check_user_access(user_plan: str, feature: str) -> bool:
    """Check if user has access to a specific feature"""
    try:
        plan_type = PlanType(user_plan.lower())
        return subscription_manager.check_feature_access(plan_type, feature)
    except ValueError:
        return False

def check_user_usage(user_plan: str, feature: str, current_usage: int) -> dict[str, any]:
    """Check if user has exceeded usage limits"""
    try:
        plan_type = PlanType(user_plan.lower())
        return subscription_manager.check_usage_limit(plan_type, feature, current_usage)
    except ValueError:
        return {
            "allowed": False,
            "limit": 0,
            "current_usage": current_usage,
            "remaining": 0
        } 