"""
Usage Tracker for CareerForge AI
Tracks feature usage for subscription management
"""

import logging
from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel

from subscription_plans import get_plan_by_id, check_user_usage

# Setup logging
logger = logging.getLogger(__name__)

class UsageRecord(BaseModel):
    """Represents a usage record for a user and feature"""
    user_id: str
    feature: str
    usage_count: int = 0
    reset_date: datetime
    plan: str = "free"

class UsageTracker:
    """Tracks usage of features for subscription management"""
    
    def __init__(self):
        # In production, this should be a database
        self.usage_records: Dict[str, UsageRecord] = {}
    
    @staticmethod
    def get_usage_key(user_id: str, feature: str) -> str:
        """Generate a unique key for usage tracking"""
        return f"{user_id}:{feature}"
    
    def increment_usage(self, user_id: str, feature: str, user_plan: str = "free") -> Dict[str, Any]:
        """Increment usage count for a user and feature"""
        try:
            key = self.get_usage_key(user_id, feature)
            
            if key not in self.usage_records:
                self.usage_records[key] = UsageRecord(
                    user_id=user_id,
                    feature=feature,
                    usage_count=0,
                    reset_date=datetime.utcnow(),
                    plan=user_plan
                )
            
            # Check if we need to reset (monthly reset)
            current_record = self.usage_records[key]
            if self._should_reset(current_record.reset_date):
                current_record.usage_count = 0
                current_record.reset_date = datetime.utcnow()
                current_record.plan = user_plan
            
            # Increment usage
            current_record.usage_count += 1
            
            logger.info("Incremented usage for user %s, feature %s, count: %d", 
                       user_id, feature, current_record.usage_count)
            
            return {
                "success": True,
                "current_usage": current_record.usage_count,
                "reset_date": current_record.reset_date.isoformat()
            }
            
        except Exception as e:
            logger.error("Error incrementing usage for user %s, feature %s: %s", 
                        user_id, feature, e)
            return {
                "success": False,
                "message": "Error tracking usage",
                "error": str(e)
            }
    
    def check_usage_limit(self, user_id: str, feature: str, user_plan: str = "free") -> Dict[str, Any]:
        """Check if user can use a feature based on their plan"""
        try:
            key = self.get_usage_key(user_id, feature)
            
            if key not in self.usage_records:
                # First time usage
                return {
                    "allowed": True,
                    "current_usage": 0,
                    "limit": self._get_feature_limit(feature, user_plan),
                    "plan": user_plan
                }
            
            current_record = self.usage_records[key]
            
            # Check if we need to reset
            if self._should_reset(current_record.reset_date):
                current_record.usage_count = 0
                current_record.reset_date = datetime.utcnow()
                current_record.plan = user_plan
            
            limit = self._get_feature_limit(feature, user_plan)
            allowed = current_record.usage_count < limit
            
            return {
                "allowed": allowed,
                "current_usage": current_record.usage_count,
                "limit": limit,
                "plan": user_plan,
                "reset_date": current_record.reset_date.isoformat()
            }
            
        except Exception as e:
            logger.error("Error checking usage limit for user %s, feature %s: %s", 
                        user_id, feature, e)
            return {
                "allowed": False,
                "current_usage": 0,
                "limit": 0,
                "error": str(e)
            }
    
    def get_user_usage_summary(self, user_id: str, user_plan: str = "free") -> Dict[str, Any]:
        """Get usage summary for all features for a user"""
        try:
            summary = {
                "user_id": user_id,
                "plan": user_plan,
                "features": {}
            }
            
            # Get all features for this user
            user_keys = [key for key in self.usage_records if key.startswith(f"{user_id}:")]
            
            for key in user_keys:
                record = self.usage_records[key]
                feature_name = record.feature
                
                # Check if we need to reset
                if self._should_reset(record.reset_date):
                    record.usage_count = 0
                    record.reset_date = datetime.utcnow()
                    record.plan = user_plan
                
                limit = self._get_feature_limit(feature_name, user_plan)
                
                summary["features"][feature_name] = {
                    "name": feature_name,
                    "available": record.usage_count < limit,
                    "current_usage": record.usage_count,
                    "limit": limit,
                    "reset_date": record.reset_date.isoformat()
                }
            
            return summary
            
        except Exception as e:
            logger.error("Error getting usage summary for user %s: %s", user_id, e)
            return {"error": "Failed to get usage summary"}
    
    def reset_user_usage(self, user_id: str, feature: Optional[str] = None):
        """Reset usage for a user (for testing or manual reset)"""
        try:
            if feature:
                # Reset specific feature
                key = self.get_usage_key(user_id, feature)
                if key in self.usage_records:
                    self.usage_records[key].usage_count = 0
                    self.usage_records[key].reset_date = datetime.utcnow()
            else:
                # Reset all features for user
                keys_to_reset = [key for key in self.usage_records if key.startswith(f"{user_id}:")]
                for key in keys_to_reset:
                    self.usage_records[key].usage_count = 0
                    self.usage_records[key].reset_date = datetime.utcnow()
            
            logger.info("Reset usage for user %s, feature: %s", user_id, feature or 'all')
            
        except Exception as e:
            logger.error("Error resetting usage for user %s: %s", user_id, e)
    
    def _should_reset(self, reset_date: datetime) -> bool:
        """Check if usage should be reset (monthly reset)"""
        now = datetime.utcnow()
        return (now.year != reset_date.year or now.month != reset_date.month)
    
    def _get_feature_limit(self, feature: str, plan: str) -> int:
        """Get usage limit for a feature based on plan"""
        # Define limits based on plan and feature
        limits = {
            "free": {
                "ai_chat": 5,
                "resume_analysis": 2,
                "job_matching": 3,
                "cover_letter": 1,
                "linkedin_optimization": 1,
                "voice_assistant": 0  # Not available in free plan
            },
            "plus": {
                "ai_chat": 50,
                "resume_analysis": 10,
                "job_matching": 15,
                "cover_letter": 5,
                "linkedin_optimization": 5,
                "voice_assistant": 10
            },
            "pro": {
                "ai_chat": -1,  # Unlimited
                "resume_analysis": -1,  # Unlimited
                "job_matching": -1,  # Unlimited
                "cover_letter": -1,  # Unlimited
                "linkedin_optimization": -1,  # Unlimited
                "voice_assistant": -1  # Unlimited
            }
        }
        
        return limits.get(plan, {}).get(feature, 0)

# Global usage tracker instance
usage_tracker = UsageTracker()

# Helper functions for API endpoints
def track_feature_usage(user_id: str, feature: str, user_plan: str = "free") -> Dict[str, Any]:
    """Track usage of a feature for a user"""
    return usage_tracker.increment_usage(user_id, feature, user_plan)

def check_feature_usage(user_id: str, feature: str, user_plan: str = "free") -> Dict[str, Any]:
    """Check if user can use a feature"""
    return usage_tracker.check_usage_limit(user_id, feature, user_plan)

def get_user_usage_summary(user_id: str, user_plan: str = "free") -> Dict[str, Any]:
    """Get usage summary for a user"""
    return usage_tracker.get_user_usage_summary(user_id, user_plan) 