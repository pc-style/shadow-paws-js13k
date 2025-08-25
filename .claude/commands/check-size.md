# /check-size

Analyze current project size and provide detailed breakdown with optimization suggestions.

## Task

I\'ll analyze the size of $ARGUMENTS and provide comprehensive size metrics, identifying the largest contributors and suggesting specific optimization strategies to fit within JS13K\'s 13KB limit.

## Process

I\'ll follow these steps:

1. **Current size analysis**: Measure total and individual file sizes
2. **Compression testing**: Test gzip and ZIP compression ratios
3. **Asset breakdown**: Categorize size by file type and purpose
4. **Optimization identification**: Find the biggest wins for size reduction
5. **Actionable recommendations**: Provide specific next steps with byte savings estimates

## Analysis Categories

### Source Code Analysis
- JavaScript file sizes (minified and gzipped)
- CSS stylesheet sizes and optimization potential  
- HTML structure and inline content
- Import/dependency usage analysis

### Asset Analysis
- Image file sizes and compression opportunities
- Audio file analysis (if any)
- Font usage and subset potential
- External resource dependencies

### Build Output Analysis
- Bundle composition and tree-shaking effectiveness
- Webpack/Rollup bundle analysis integration
- Source map size analysis
- Chunk size distribution

## Optimization Recommendations

### Quick Wins (Low effort, high impact)
- Unused code elimination
- Asset compression
- Variable name shortening
- CSS optimization

### Strategic Changes (Higher effort, major impact)
- Library substitution
- Procedural generation vs static assets
- Code architecture changes
- Advanced compression techniques

## Reporting Format

I\'ll provide:
- Current size: X KB (Y% of 13KB limit)
- Size breakdown by category with percentages
- Top 10 largest files/functions
- Optimization priority matrix
- Specific action items with estimated byte savings

The analysis will include both absolute sizes and compressed sizes to give accurate submission size estimates.
