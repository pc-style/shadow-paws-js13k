# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a JS13K game jam entry called "Shadow Paws" - a black cat superstition-themed arcade game where players avoid bad luck items while collecting good fortune items. The game is designed to work within the 13KB size constraint of the JS13K competition.

## Development Commands

### Essential Development Scripts
```bash
# Start development server
npm start                    # Python HTTP server on port 8000
npm run serve               # Same as above

# Size monitoring and analysis
npm run size                # Show file sizes
npm run stats               # Comprehensive size analysis with gzipped output

# Build and optimization
npm run build               # Minify JS and CSS
npm run minify-js           # Minify JavaScript only  
npm run minify-css          # Minify CSS only
npm run zip                 # Create competition ZIP file
npm run clean               # Remove build artifacts

# Development workflow
npm run watch               # Watch files and show stats on changes
```

### Size Validation for JS13K
```bash
# Check final submission size (must be ≤ 13,312 bytes)
npm run zip && ls -la game.zip

# Monitor development size in real-time
npm run watch
```

## Game Architecture

### Core Game Structure
- **Single-file architecture**: All game logic in `game.js` for size optimization
- **Canvas-based rendering**: 400x600 game area with responsive scaling
- **Entity system**: Cat player, falling items, particle effects, background stars
- **State management**: Game states (start screen, playing, game over) with UI overlays

### Key Game Systems

#### Player Movement
- **Keyboard**: Arrow keys or WASD for desktop
- **Touch/Mouse**: Click/drag for mobile with smooth following
- **Movement**: Interpolated movement with velocity smoothing
- **Boundaries**: Constrained to canvas bounds with size consideration

#### Item System
```javascript
// Item types with properties
const itemTypes = {
  // Good items (collectible)
  fish: { emoji: '🐟', points: 10, good: true },
  star: { emoji: '⭐', points: 20, good: true }, 
  moon: { emoji: '🌙', points: 30, good: true },
  clover: { emoji: '🍀', points: 50, good: true, special: true }, // Invincibility
  
  // Bad items (superstitions - avoid)
  mirror: { emoji: '🪞', points: -1, good: false },
  ladder: { emoji: '🪜', points: -1, good: false },
  salt: { emoji: '🧂', points: -1, good: false }
};
```

#### Game Progression
- **Levels**: Progress every 12 items collected
- **Difficulty scaling**: Increased spawn rate and item speed per level
- **Lives system**: Start with 9 lives (cat theme), bonus life every 3 levels
- **Combo system**: Consecutive good items build multiplier with timer

#### Visual Effects
- **Cat rendering**: Custom drawing with tail trail, animated eyes, invincibility aura
- **Particle system**: Collision feedback, level-up effects, screen shake
- **Background**: Animated starfield with level-based speed
- **UI feedback**: Dynamic combo scaling and color changes

### Size Optimization Techniques Used

#### Code Golf Patterns
- Single-character variable names in critical loops
- Compact object destructuring and spreading
- Bitwise operations where applicable
- Ternary operators for conditionals
- Array methods over traditional loops where shorter

#### Asset Strategy
- **No external assets**: All graphics generated with Canvas API or emoji
- **Procedural generation**: Stars, particles, and effects created programmatically
- **CSS styling**: UI elements styled with CSS instead of canvas rendering
- **Emoji sprites**: Using Unicode emoji instead of image files

#### Performance Optimizations
- **Object pooling**: Particle and effect reuse
- **Efficient collision**: Simple distance-based detection
- **RAF game loop**: Single requestAnimationFrame loop
- **Minimal DOM manipulation**: Cached element references

## Development Guidelines

### Adding New Features
1. **Size budget**: Always check impact with `npm run stats`
2. **Code style**: Follow existing single-file, compact patterns
3. **Performance**: Use Canvas API efficiently, minimize garbage collection
4. **Mobile support**: Test touch controls and responsive scaling

### Testing Workflow
```bash
# Test locally
npm start
# Open http://localhost:8000

# Test mobile responsiveness
# Use browser dev tools device simulation

# Validate final build
npm run build
npm run zip
# Verify game.zip ≤ 13,312 bytes
```

### Code Patterns to Follow

#### Efficient Canvas Drawing
```javascript
// Batch drawing operations
ctx.fillStyle = color;
ctx.globalAlpha = alpha;
// ... multiple draw calls
ctx.globalAlpha = 1; // Reset

// Use save/restore for complex transforms
ctx.save();
ctx.translate(x, y);
ctx.rotate(rotation);
// ... drawing
ctx.restore();
```

#### Memory Management
```javascript
// Efficient array cleanup
for (let i = array.length - 1; i >= 0; i--) {
  if (shouldRemove) array.splice(i, 1);
}

// Object reuse patterns
const getFromPool = () => pool.pop() || createNew();
const returnToPool = (obj) => { resetObj(obj); pool.push(obj); };
```

### Competition Constraints
- **File size**: ≤13,312 bytes when zipped
- **Offline functionality**: No external resources
- **Cross-browser**: Chrome, Firefox, Safari, Edge support
- **Mobile friendly**: Touch controls required
- **Entry point**: Must be `index.html`

### Size Analysis Tools
The project uses several size monitoring approaches:
- `npm run size`: Quick file size check
- `npm run stats`: Detailed analysis with gzipped sizes
- `npm run watch`: Real-time size monitoring during development

### Game Balance Parameters
- **Lives**: Start with 9, bonus every 3 levels (cat theme)
- **Combo timer**: 2 seconds (120 frames at 60fps)
- **Level progression**: Every 12 items collected
- **Spawn rates**: Adjusted per level (25-6 frames between spawns)
- **Speed scaling**: 10% increase per level for items and player

The game is designed to be progressively challenging while maintaining the superstition theme and staying within JS13K size constraints.