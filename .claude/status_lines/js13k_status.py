#!/usr/bin/env python3
"""JS13K specialized status line showing game development context"""

import json
import sys
import os
import zipfile
from pathlib import Path
from datetime import datetime

def get_build_size():
    """Get current build size if available"""
    build_dirs = ['dist', 'build', 'public']
    
    for build_dir in build_dirs:
        if os.path.exists(build_dir):
            zip_path = 'temp_size_check.zip'
            try:
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for root, dirs, files in os.walk(build_dir):
                        for file in files:
                            filepath = os.path.join(root, file)
                            arcname = os.path.relpath(filepath, build_dir)
                            zipf.write(filepath, arcname)
                
                size = os.path.getsize(zip_path)
                os.remove(zip_path)
                
                size_kb = size / 1024
                limit_kb = 13
                percent = (size_kb / limit_kb) * 100
                
                return f"{size_kb:.1f}KB/{limit_kb}KB ({percent:.0f}%)"
                
            except Exception:
                return "Size: Unknown"
    
    return "No build"

def get_git_info():
    """Get current git branch and status"""
    try:
        import subprocess
        branch = subprocess.check_output(['git', 'branch', '--show-current'], 
                                       stderr=subprocess.DEVNULL).decode().strip()
        return f"🎮 {branch}"
    except:
        return "🎮 main"

def main():
    # Get project info
    project_name = os.path.basename(os.getcwd())
    build_size = get_build_size()
    git_info = get_git_info()
    
    # Color codes
    CYAN = '\033[36m'
    YELLOW = '\033[33m'
    GREEN = '\033[32m'
    RED = '\033[31m'
    RESET = '\033[0m'
    
    # Build status line
    status_parts = [
        f"{CYAN}JS13K:{RESET}",
        f"{GREEN}{project_name}{RESET}",
        git_info,
        f"{YELLOW}{build_size}{RESET}"
    ]
    
    # Add size warning color
    if "%" in build_size and build_size != "No build":
        try:
            percent = int(build_size.split('(')[1].split('%')[0])
            if percent > 100:
                status_parts[-1] = f"{RED}{build_size}{RESET}"
            elif percent > 90:
                status_parts[-1] = f"{YELLOW}{build_size}{RESET}"
        except:
            pass
    
    print(" | ".join(status_parts))

if __name__ == "__main__":
    main()
