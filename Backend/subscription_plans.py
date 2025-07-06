"""
Subscription Plans for CareerForge AI
Startup-friendly pricing model with freemium tier
"""

from enum import Enum
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

class PlanType(str, Enum):
    FREE = "free"
    STARTER = "starter"
    PRO = "pro"
    GROWTH = "growth"

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
    features: List[Feature]
    limits: Dict[str, int]
    popular: bool = False

# Feature definitions
FEATURES = {
    "job_matches": Feature(
        name="Job Matches",
        description="Number of AI-powered job matches per month"
    ),
    "resume_analysis": Feature(
        name="Resume Analysis",
        description="AI-powered resume and skills analysis"
    ),
    "skill_recommendations": Feature(
        name="Skill Recommendations",
        description="Personalized skill development recommendations"
    ),
    "market_trends": Feature(
        name="Market Trends",
        description="Real-time market trends and salary insights"
    ),
    "ai_enhancement": Feature(
        name="AI Enhancement",
        description="Advanced AI-powered analysis and insights"
    ),
    "export_reports": Feature(
        name="Export Reports",
        description="Download detailed analysis reports"
    ),
    "priority_support": Feature(
        name="Priority Support",
        description="Priority email and chat support"
    ),
    "api_access": Feature(
        name="API Access",
        description="Programmatic access to CareerForge AI"
    ),
    "white_label": Feature(
        name="White Label",
        description="Custom branding and white-label options"
    ),
    "dedicated_support": Feature(
        name="Dedicated Support",
        description="Dedicated account manager and support"
    )
}

# Subscription Plans Configuration
SUBSCRIPTION_PLANS = {
    PlanType.FREE: SubscriptionPlan(
        id="free",
        name="Free",
        price_monthly=0.0,
        price_yearly=0.0,
        description="Perfect for trying out CareerForge AI",
        features=[
            FEATURES["job_matches"],
            FEATURES["resume_analysis"]
        ],
        limits={
            "job_matches_per_month": 5,
            "resume_analyses_per_month": 3,
            "skill_recommendations_per_month": 0,
            "market_trends_per_month": 0,
            "export_reports": 0,
            "api_calls_per_month": 0
        }
    ),
    
    PlanType.STARTER: SubscriptionPlan(
        id="starter",
        name="Starter",
        price_monthly=9.99,
        price_yearly=99.0,
        description="Great for individual job seekers",
        features=[
            FEATURES["job_matches"],
            FEATURES["resume_analysis"],
            FEATURES["skill_recommendations"],
            FEATURES["export_reports"]
        ],
        limits={
            "job_matches_per_month": 25,
            "resume_analyses_per_month": 10,
            "skill_recommendations_per_month": 5,
            "market_trends_per_month": 3,
            "export_reports": 5,
            "api_calls_per_month": 100
        }
    ),
    
    PlanType.PRO: SubscriptionPlan(
        id="pro",
        name="Pro",
        price_monthly=24.99,
        price_yearly=249.0,
        description="Perfect for serious career development",
        popular=True,
        features=[
            FEATURES["job_matches"],
            FEATURES["resume_analysis"],
            FEATURES["skill_recommendations"],
            FEATURES["market_trends"],
            FEATURES["ai_enhancement"],
            FEATURES["export_reports"],
            FEATURES["priority_support"],
            FEATURES["api_access"]
        ],
        limits={
            "job_matches_per_month": 100,
            "resume_analyses_per_month": 50,
            "skill_recommendations_per_month": 25,
            "market_trends_per_month": 15,
            "export_reports": 20,
            "api_calls_per_month": 1000
        }
    ),
    
    PlanType.GROWTH: SubscriptionPlan(
        id="growth",
        name="Growth",
        price_monthly=49.99,
        price_yearly=499.0,
        description="For power users and small teams",
        features=[
            FEATURES["job_matches"],
            FEATURES["resume_analysis"],
            FEATURES["skill_recommendations"],
            FEATURES["market_trends"],
            FEATURES["ai_enhancement"],
            FEATURES["export_reports"],
            FEATURES["priority_support"],
            FEATURES["api_access"],
            FEATURES["white_label"],
            FEATURES["dedicated_support"]
        ],
        limits={
            "job_matches_per_month": -1,  # Unlimited
            "resume_analyses_per_month": -1,  # Unlimited
            "skill_recommendations_per_month": -1,  # Unlimited
            "market_trends_per_month": -1,  # Unlimited
            "export_reports": -1,  # Unlimited
            "api_calls_per_month": 10000
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
    
    def get_all_plans(self) -> List[SubscriptionPlan]:
        """Get all available plans"""
        return list(self.plans.values())
    
    def check_feature_access(self, user_plan: PlanType, feature: str) -> bool:
        """Check if user has access to a specific feature"""
        plan = self.get_plan(user_plan)
        for plan_feature in plan.features:
            if plan_feature.name.lower().replace(" ", "_") == feature.lower():
                return plan_feature.available
        return False
    
    def check_usage_limit(self, user_plan: PlanType, feature: str, current_usage: int) -> Dict[str, any]:
        """Check if user has exceeded usage limits"""
        plan = self.get_plan(user_plan)
        limit = plan.limits.get(f"{feature}_per_month", 0)
        
        if limit == -1:  # Unlimited
            return {
                "allowed": True,
                "limit": -1,
                "current_usage": current_usage,
                "remaining": -1
            }
        
        remaining = max(0, limit - current_usage)
        allowed = current_usage < limit
        
        return {
            "allowed": allowed,
            "limit": limit,
            "current_usage": current_usage,
            "remaining": remaining
        }
    
    def get_plan_comparison(self) -> Dict[str, any]:
        """Get plan comparison for pricing page"""
        comparison = {
            "plans": [],
            "features": list(FEATURES.keys()),
            "currency": "USD",
            "billing_cycle": "monthly"
        }
        
        for plan_type, plan in self.plans.items():
            plan_data = {
                "id": plan.id,
                "name": plan.name,
                "price_monthly": plan.price_monthly,
                "price_yearly": plan.price_yearly,
                "description": plan.description,
                "popular": plan.popular,
                "features": {},
                "limits": plan.limits
            }
            
            # Add feature availability
            for feature in plan.features:
                plan_data["features"][feature.name] = feature.available
            
            comparison["plans"].append(plan_data)
        
        return comparison

# Global instance
subscription_manager = SubscriptionManager()

# Convenience functions for API endpoints
def get_plans() -> List[SubscriptionPlan]:
    """Get all subscription plans"""
    return subscription_manager.get_all_plans()

def get_plan_by_id(plan_id: str) -> Optional[SubscriptionPlan]:
    """Get plan by ID"""
    for plan in get_plans():
        if plan.id == plan_id:
            return plan
    return None

def check_user_access(user_plan: str, feature: str) -> bool:
    """Check if user has access to a feature"""
    try:
        plan_type = PlanType(user_plan)
        return subscription_manager.check_feature_access(plan_type, feature)
    except ValueError:
        return False

def check_user_usage(user_plan: str, feature: str, current_usage: int) -> Dict[str, any]:
    """Check user usage limits"""
    try:
        plan_type = PlanType(user_plan)
        return subscription_manager.check_usage_limit(plan_type, feature, current_usage)
    except ValueError:
        return {
            "allowed": False,
            "limit": 0,
            "current_usage": current_usage,
            "remaining": 0
        } 