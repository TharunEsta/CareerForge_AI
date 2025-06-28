#!/usr/bin/env python3
"""
Script to fix the import issue in Backend/main.py
Run this on your server to update the import statement
"""

import os

def fix_import_in_main():
    """Fix the import statement in Backend/main.py"""
    
    # Path to the main.py file
    main_file = "Backend/main.py"
    
    if not os.path.exists(main_file):
        print(f"Error: {main_file} not found!")
        return False
    
    # Read the current content
    with open(main_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the import is already fixed
    if "from Backend.utils import" in content:
        print("✅ Import is already fixed!")
        return True
    
    # Replace the old import with the new one
    old_import = "from utils import parse_resume, parse_resume_with_job_matching, extract_skills_from_job_description, match_skills, generate_learning_plan, allowed_file, rewrite_resume, optimize_for_linkedin"
    new_import = "from Backend.utils import parse_resume, parse_resume_with_job_matching, allowed_file"
    
    if old_import in content:
        content = content.replace(old_import, new_import)
        
        # Write the updated content back
        with open(main_file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Successfully updated import statement!")
        print(f"Changed: {old_import}")
        print(f"To: {new_import}")
        return True
    else:
        print("❌ Could not find the old import statement to replace")
        print("Please manually update the import in Backend/main.py")
        return False

if __name__ == "__main__":
    print("🔧 Fixing import statement in Backend/main.py...")
    success = fix_import_in_main()
    
    if success:
        print("\n🎉 Import fix completed!")
        print("You can now run: uvicorn main:app --host 0.0.0.0 --port 8000")
    else:
        print("\n❌ Import fix failed. Please check the file manually.") 