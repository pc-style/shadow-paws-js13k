#!/usr/bin/env python3
"""
Image validation script for js13k game assets.
Checks if cover.png and hero.png meet the required specifications.

Requirements:
- cover.png: PNG, exactly 320 × 320 px, ≤ 50KB
- hero.png: PNG, exactly 800 × 500 px, ≤ 200KB

Usage:
    python generate_images.py

Dependencies:
    pip install Pillow
"""

import os
from PIL import Image

def validate_image(filename, required_width, required_height, max_size_kb, description):
    """Validate a single image file against requirements."""
    if not os.path.exists(filename):
        return f"❌ {description}: File '{filename}' not found"

    try:
        # Open image and get dimensions
        with Image.open(filename) as img:
            width, height = img.size
            file_size = os.path.getsize(filename) / 1024  # Convert to KB

        # Check if it's PNG
        if not filename.lower().endswith('.png'):
            return f"❌ {description}: Must be PNG format"

        # Check dimensions
        if width != required_width or height != required_height:
            return ".1f"        # Check file size
        if file_size > max_size_kb:
            return ".1f"
        return ".1f"

    except Exception as e:
        return f"❌ {description}: Error reading file - {str(e)}"

def main():
    """Main validation function."""
    print("🔍 Validating js13k game image assets...\n")
    print("Requirements:")
    print("  cover.png: PNG, exactly 320 × 320 px, ≤ 50KB")
    print("  hero.png:  PNG, exactly 800 × 500 px, ≤ 200KB\n")

    # Validate cover.png
    cover_result = validate_image(
        "cover.png",
        required_width=320,
        required_height=320,
        max_size_kb=50,
        description="Cover image"
    )
    print(cover_result)

    # Validate hero.png
    hero_result = validate_image(
        "hero.png",
        required_width=800,
        required_height=500,
        max_size_kb=200,
        description="Hero image"
    )
    print(hero_result)

    # Summary
    print("\n" + "="*50)
    if "❌" in cover_result or "❌" in hero_result:
        print("❌ Some images do not meet requirements")
        return False
    else:
        print("✅ All images meet requirements!")
        return True

if __name__ == "__main__":
    main()