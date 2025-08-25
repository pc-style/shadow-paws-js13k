# 🚀 JS13K Aggressive Build System

This build system is specifically designed for JS13K competition constraints, providing ultra-aggressive minification to maximize compression within the 13,312 byte limit.

## 🎯 Features

- **Ultra-aggressive JavaScript minification** with variable/function name mangling
- **CSS optimization** with class name shortening and rule combining  
- **HTML minification** with automated class/ID mapping
- **Size analysis** and optimization recommendations
- **Automated ZIP packaging** with size validation
- **Real-time file watching** during development

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Build optimized version for submission
npm run submission

# Start development with auto-rebuild
npm run dev
```

## 🛠️ Build Commands

### Main Build Commands
- `npm run build` - Create optimized build
- `npm run submission` - Full build + ZIP + analysis (for JS13K submission)
- `npm run deploy` - Alias for submission

### Development Commands  
- `npm start` - Start local server on port 8000
- `npm run dev` - Start server + watch for changes
- `npm run build:watch` - Auto-rebuild on file changes

### Analysis Commands
- `npm run analyze` - Basic size analysis
- `npm run analyze:detailed` - Detailed code analysis with optimization suggestions
- `npm run analyze:quick` - Quick size estimate
- `npm run size` - Show current file sizes
- `npm run check-limit` - Check if ZIP exceeds JS13K limit

### Individual Minification
- `npm run minify-js` - Minify JavaScript only
- `npm run minify-css` - Minify CSS only  
- `npm run minify-html` - Minify HTML only

### Utilities
- `npm run clean` - Remove build artifacts
- `npm run clean:all` - Remove all generated files
- `npm run zip` - Create submission ZIP
- `npm run test:size` - Quick size test

## 🎮 Optimization Techniques Applied

### JavaScript Optimizations
- **Variable name mangling**: Long variables → single letters (`gameStarted` → `a`)
- **Function name shortening**: `handleCollision` → `hC` 
- **Common string extraction**: Frequent strings become variables
- **Boolean optimization**: `true`/`false` → `!0`/`!1`
- **Property mangling**: Object properties shortened where safe
- **Dead code elimination**: Remove unused functions/variables
- **Console statement removal**: All console.* calls stripped
- **Unsafe optimizations enabled**: Aggressive compression

### CSS Optimizations  
- **Class name shortening**: `.menu-screen` → `.h`
- **Rule merging**: Combine similar CSS rules
- **Property optimization**: Shorten values and remove defaults
- **Whitespace elimination**: Remove all unnecessary spacing
- **Color optimization**: Convert colors to shortest form
- **Duplicate removal**: Eliminate redundant styles

### HTML Optimizations
- **Attribute quote removal**: Where HTML5 allows
- **Whitespace collapse**: Remove all unnecessary spacing
- **Boolean attribute compression**: `checked="checked"` → `checked`
- **Redundant attribute removal**: Remove default values
- **Class/ID syncing**: Update with CSS optimizations
- **Script/style inlining**: Embed for single-file submission

## 📊 File Structure

```
├── game.js              # Source JavaScript
├── style.css            # Source CSS  
├── index.html           # Source HTML
├── build.js             # Main build script
├── analyze.js           # Size analysis tool
├── terser.config.json   # JS minification config
├── cssnano.config.js    # CSS optimization config
├── html-minifier.config.json # HTML minification config
├── dist.js              # Minified JavaScript
├── dist.css             # Minified CSS
├── dist.html            # Minified HTML
├── submission.html      # Final inlined version
└── submission.zip       # JS13K submission file
```

## 🔍 Size Analysis Output

The analyzer provides detailed insights:

```
📊 Original Files:
   game.js       45,234 bytes (12,456 gzipped)
   style.css      8,123 bytes (2,341 gzipped)  
   index.html     3,456 bytes (1,234 gzipped)
   Total:        56,813 bytes

⚡ Minified Files:
   dist.js       15,234 bytes (4,567 gz) [66.3% reduction]
   dist.css       2,123 bytes (891 gz) [73.9% reduction]
   dist.html      1,456 bytes (634 gz) [57.9% reduction]
   Total:        18,813 bytes [66.9% overall reduction]

🎯 Final Submission:
   submission.html     18,456 bytes (6,234 gzipped)
   submission.zip      6,789 bytes
   Remaining:         6,523 bytes (49.0% free)
   ✅ Under limit
```

## 💡 Optimization Recommendations

The analyzer suggests further optimizations:

- **High Priority**: Shorten 15 frequently used variables (~245 bytes)
- **Medium Priority**: Convert repeated strings to variables (~89 bytes)
- **High Priority**: Remove 8 console statements (~120 bytes)

## ⚙️ Configuration

### Terser Configuration (`terser.config.json`)
Ultra-aggressive JavaScript compression with:
- Property name mangling enabled
- Unsafe optimizations enabled
- Console statement removal
- Boolean to integer conversion
- Toplevel mangling

### CSS Configuration (`cssnano.config.js`) 
Advanced CSS optimization with:
- Aggressive rule merging
- Color and value minification
- Duplicate removal
- Selector optimization

### HTML Configuration (`html-minifier.config.json`)
Comprehensive HTML minification with:
- Whitespace collapse
- Attribute optimization
- Embedded CSS/JS minification
- Boolean attribute compression

## 🚀 Development Workflow

1. **Develop** using source files (`game.js`, `style.css`, `index.html`)
2. **Test locally** with `npm start`
3. **Monitor size** with `npm run analyze:quick` 
4. **Build & analyze** with `npm run build:aggressive`
5. **Create submission** with `npm run submission`
6. **Verify size** - ensure ZIP is under 13,312 bytes

## 📈 Size Optimization Tips

1. **Use short variable names** in performance-critical code
2. **Avoid long string literals** - store in variables if repeated
3. **Minimize CSS classes** - use short, descriptive names
4. **Remove debug code** before building
5. **Use CSS shorthand** properties where possible
6. **Combine related functions** to reduce overhead
7. **Use bitwise operations** instead of Math functions where appropriate

## ⚡ Pro Tips for JS13K

- The build system automatically handles most optimizations
- Focus on game logic and features during development
- Run `npm run analyze:detailed` to find optimization opportunities
- Use `npm run dev` for rapid development iteration
- Always test `submission.html` before submitting to JS13K

## 🎯 JS13K Submission Checklist

- [ ] Run `npm run submission`
- [ ] Verify `submission.zip` is under 13,312 bytes
- [ ] Test `submission.html` in multiple browsers
- [ ] Ensure game works offline (no external resources)
- [ ] Check mobile compatibility
- [ ] Verify theme compliance
- [ ] Submit `submission.zip` to JS13K

The build system automatically handles the complex optimization process, allowing you to focus on creating an amazing game within the JS13K constraints!