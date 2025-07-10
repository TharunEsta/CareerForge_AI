"""
Usage Tracker for CareerForge AI
Tracks user feature usage and enforces subscription limits
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from pydantic import BaseModel

from subscription_plans import get_plan_by_id, check_user_usage

# Setup logging
logger = logging.getLogger(__name__)

class UsageRecord(BaseModel):
    user_id: str
    feature: str
    usage_count: int
    reset_date: datetime
    created_at: datetime = datetime.utcnow()

class UsageTracker:
    """Tracks and manages user feature usage"""
    
    def __init__(self):
        # In-memory storage for development
        # In production, this should be a database
        self.usage_records: Dict[str, UsageRecord] = {}
    
    def get_usage_key(self, user_id: str, feature: str) -> str:
        """Generate a unique key for usage tracking"""
        return f"{user_id}:{feature}"
    
    def get_user_usage(self, user_id: str, feature: str) -> int:
        """Get current usage count for a user and feature"""
        key = self.get_usage_key(user_id, feature)
        record = self.usage_records.get(key)
        
        if not record:
            return 0
        
        # Check if we need to reset the usage (monthly reset)
        if datetime.utcnow() > record.reset_date:
            return 0
        
        return record.usage_count
    
    def increment_usage(self, user_id: str, feature: str, user_plan: str = "free") -> Dict[str, Any]:
        """Increment usage for a feature and check limits"""
        try:
            # Check current usage against plan limits
            current_usage = self.get_user_usage(user_id, feature)
            usage_check = check_user_usage(user_plan, feature, current_usage)
            
            if not usage_check["allowed"]:
                return {
                    "success": False,
                    "message": f"Usage limit exceeded for {feature}",
                    "current_usage": current_usage,
                    "limit": usage_check["limit"],
                    "remaining": 0
                }
            
            # Increment usage
            key = self.get_usage_key(user_id, feature)
            now = datetime.utcnow()
            
            # Calculate next reset date (first day of next month)
            if now.month == 12:
                reset_date = now.replace(year=now.year + 1, month=1, day=1)
            else:
                reset_date = now.replace(month=now.month + 1, day=1)
            
            if key in self.usage_records:
                self.usage_records[key].usage_count += 1
            else:
                self.usage_records[key] = UsageRecord(
                    user_id=user_id,
                    feature=feature,
                    usage_count=1,
                    reset_date=reset_date
                )
            
            new_usage = self.usage_records[key].usage_count
            
            return {
                "success": True,
                "message": f"Usage incremented for {feature}",
                "current_usage": new_usage,
                "limit": usage_check["limit"],
                "remaining": usage_check["remaining"] - 1 if usage_check["remaining"] != -1 else -1
            }
            
        except Exception as e:
            logger.error(f"Error incrementing usage for user {user_id}, feature {feature}: {e}")
            return {
                "success": False,
                "message": "Error tracking usage",
                "current_usage": 0,
                "limit": 0,
                "remaining": 0
            }
    
    def check_usage_limit(self, user_id: str, feature: str, user_plan: str = "free") -> Dict[str, Any]:
        """Check if user can use a feature based on their plan and current usage"""
        try:
            current_usage = self.get_user_usage(user_id, feature)
            usage_check = check_user_usage(user_plan, feature, current_usage)
            
            return {
                "allowed": usage_check["allowed"],
                "current_usage": current_usage,
                "limit": usage_check["limit"],
                "remaining": usage_check["remaining"],
                "plan": user_plan
            }
            
        except Exception as e:
            logger.error(f"Error checking usage limit for user {user_id}, feature {feature}: {e}")
            return {
                "allowed": False,
                "current_usage": 0,
                "limit": 0,
                "remaining": 0,
                "plan": user_plan
            }
    
    def get_user_usage_summary(self, user_id: str, user_plan: str = "free") -> Dict[str, Any]:
        """Get a summary of all feature usage for a user"""
        try:
            plan = get_plan_by_id(user_plan)
            if not plan:
                return {"error": "Plan not found"}
            
            summary = {
                "user_id": user_id,
                "plan": user_plan,
                "features": {}
            }
            
            for feature in plan.features:
                feature_name = feature.name.lower().replace(" ", "_")
                usage_info = self.check_usage_limit(user_id, feature_name, user_plan)
                
                summary["features"][feature_name] = {
                    "name": feature.name,
                    "available": feature.available,
                    "current_usage": usage_info["current_usage"],
                    "limit": usage_info["limit"],
                    "remaining": usage_info["remaining"],
                    "allowed": usage_info["allowed"]
                }
            
            return summary
            
        except Exception as e:
            logger.error(f"Error getting usage summary for user {user_id}: {e}")
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
                keys_to_reset = [key for key in self.usage_records.keys() if key.startswith(f"{user_id}:")]
                for key in keys_to_reset:
                    self.usage_records[key].usage_count = 0
                    self.usage_records[key].reset_date = datetime.utcnow()
            
            logger.info(f"Reset usage for user {user_id}, feature: {feature or 'all'}")
            
        except Exception as e:
            logger.error(f"Error resetting usage for user {user_id}: {e}")

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