#!/usr/bin/env python3
import os
import sys
import json
import zipfile
from pathlib import Path

def check_build_size():
    """Check build output size and warn if approaching JS13K limits"""
    
    # Common build directories
    build_dirs = ['dist', 'build', 'public']
    size_limit = 13312  # 13KB in bytes
    
    for build_dir in build_dirs:
        if os.path.exists(build_dir):
            # Calculate directory size
            total_size = 0
            for root, dirs, files in os.walk(build_dir):
                for file in files:
                    filepath = os.path.join(root, file)
                    total_size += os.path.getsize(filepath)
            
            # Test ZIP compression
            zip_path = 'temp_game.zip'
            try:
                with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for root, dirs, files in os.walk(build_dir):
                        for file in files:
                            filepath = os.path.join(root, file)
                            arcname = os.path.relpath(filepath, build_dir)
                            zipf.write(filepath, arcname)
                
                zip_size = os.path.getsize(zip_path)
                os.remove(zip_path)
                
                # Calculate percentages
                size_percent = (zip_size / size_limit) * 100
                
                # Print size report
                print(f"\n📦 Build Size Report:", file=sys.stderr)
                print(f"   Uncompressed: {total_size:,} bytes", file=sys.stderr)
                print(f"   ZIP compressed: {zip_size:,} bytes ({size_percent:.1f}% of 13KB limit)", file=sys.stderr)
                
                # Warnings
                if zip_size > size_limit:
                    print(f"❌ Size exceeds 13KB limit by {zip_size - size_limit:,} bytes!", file=sys.stderr)
                    sys.exit(2)  # Block if over limit
                elif zip_size > size_limit * 0.9:
                    print(f"⚠️  Warning: Approaching size limit ({size_limit - zip_size:,} bytes remaining)", file=sys.stderr)
                else:
                    print(f"✅ Size OK ({size_limit - zip_size:,} bytes remaining)", file=sys.stderr)
                
                break
            except Exception as e:
                print(f"❌ Error checking size: {e}", file=sys.stderr)
                sys.exit(2)
                
    else:
        print("ℹ️  No build directory found", file=sys.stderr)

if __name__ == "__main__":
    check_build_size()
