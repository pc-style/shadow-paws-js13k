# /analyze-bundle

Deep analysis of the built game bundle to identify size optimization opportunities.

## Task

I\'ll analyze the compiled bundle for $ARGUMENTS using advanced bundle analysis tools to identify unused code, optimize dependencies, and suggest architectural improvements for size reduction.

## Process

I\'ll follow these steps:

1. **Bundle composition analysis**: Break down the bundle by modules and dependencies
2. **Tree-shaking verification**: Identify unused exports and imports
3. **Code splitting opportunities**: Find candidates for lazy loading
4. **Dependency audit**: Analyze third-party library usage and alternatives
5. **Optimization roadmap**: Create prioritized list of improvements

## Analysis Tools

### Webpack Bundle Analyzer
- Visual bundle size representation
- Module-by-module size breakdown
- Gzipped vs uncompressed size comparison
- Dependency relationship mapping

### Source Map Analysis
- Function-level size attribution
- Dead code identification
- Hot path analysis for optimization priority
- Import/export usage patterns

### Dependency Analysis
- Third-party library impact
- Duplicate dependency detection
- Alternative library suggestions
- Custom implementation viability

### Optimization Strategies

### Code Structure
- Function inlining opportunities
- Variable name shortening impact
- Loop unrolling candidates
- Conditional compilation for features

### Dependencies
- Micro-library substitutions (e.g., Lodash -> individual functions)
- Polyfill elimination for modern browsers
- Custom implementations vs library usage
- Tree-shaking optimization techniques

### Build Configuration
- Minifier setting optimization
- Module resolution improvements
- Output format optimization
- Compression algorithm selection

## Reporting Format

### Size Breakdown
```
Total Bundle Size: X KB (Y% of limit)
├── Game Logic: A KB (B%)
├── Rendering Engine: C KB (D%)  
├── Audio System: E KB (F%)
├── Third-party Libraries: G KB (H%)
└── Assets (inlined): I KB (J%)
```

### Optimization Opportunities
1. **High Impact, Low Effort**: Immediate wins with specific byte savings
2. **Medium Impact, Medium Effort**: Strategic improvements
3. **High Impact, High Effort**: Architectural changes

Each recommendation includes:
- Estimated byte savings
- Implementation complexity
- Potential risks/downsides
- Code examples where applicable
