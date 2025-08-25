# /build-game

Build and optimize the JS13K game with full size validation and compression analysis.

## Task

I\'ll execute a complete build process for $ARGUMENTS following JS13K competition requirements, ensuring the final package stays under 13KB while maximizing game functionality and performance.

## Process

I\'ll follow these steps:

1. **Pre-build validation**: Check source files and dependencies
2. **Asset optimization**: Compress images, optimize audio, minify CSS
3. **Code compilation**: Transpile, minify, and optimize JavaScript
4. **Bundle analysis**: Analyze final package composition and size
5. **ZIP creation**: Create competition-ready submission package
6. **Validation**: Verify package meets JS13K requirements

## Build Pipeline

### Development Build
- Fast compilation for testing
- Source maps for debugging
- Development server with hot reload
- Uncompressed assets for quick iteration

### Production Build  
- Maximum compression and optimization
- Asset inlining and concatenation
- Dead code elimination
- Variable name mangling
- ZIP package generation with size validation

## Size Optimization Strategies

### Code Optimization
- UglifyJS/Terser minification with aggressive settings
- Variable shortening and function inlining
- Unused import elimination
- Constant folding and dead code removal

### Asset Optimization
- PNG compression with tools like TinyPNG
- SVG optimization and inlining
- Font subsetting for used characters only
- Audio compression and procedural generation

## Validation Checks

### Pre-submission Validation
- Package size verification (≤ 13,312 bytes)
- Offline functionality testing
- Cross-browser compatibility
- Performance benchmarking
- Competition rules compliance

I\'ll adapt to your project\'s specific build tools (Gulp, Webpack, Rollup, etc.) and provide detailed size breakdowns with optimization suggestions.
