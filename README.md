# 🐈‍⬛ Shadow Paws - JS13K 2025 Game

A black cat superstition-themed arcade game built for the JS13K 2025 competition. Navigate as a black cat, collect good fortune items, and avoid superstitious bad luck objects in this charming arcade experience.

## 🎮 Game Features

- **Black Cat Theme**: Play as an adorable black cat with smooth animations
- **Superstition Mechanics**: Collect fish, stars, and moons while avoiding mirrors, ladders, and spilled salt
- **Progressive Difficulty**: 25+ levels with increasing challenge
- **Power-ups & Special Items**: Pounce ability, night vision, extra lives, and invincibility clovers
- **Multiple Game Modes**: Endless, Story, Challenge, and Tutorial modes
- **Achievements System**: 10+ unlockable achievements to track progress
- **Mobile Support**: Full touch controls and responsive design
- **Special Events**: Friday the 13th and Full Moon bonus modes

## 🚀 Quick Start

```bash
# Start development server
npm start

# Build optimized version for JS13K
npm run build

# Create final submission ZIP
npm run submission
```

## 📁 Project Structure

```
├── src/                    # Source files
│   ├── game.js            # Main game logic (49KB)
│   ├── style.css          # Stylesheet (8KB)
│   └── index.html         # HTML structure (6KB)
├── build/                 # Build system
│   ├── build-clean.js     # Main build script
│   ├── analyze-clean.js   # Size analysis tool
│   └── *.config.json      # Minification configs
├── dist/                  # Minified output
└── submission.html        # Final single-file game
```

## 🎯 JS13K Optimization Results

**Original → Minified → Final**
- **JavaScript**: 49KB → 18KB → (62.5% reduction)
- **CSS**: 8KB → 6KB → (24.2% reduction) 
- **HTML**: 6KB → 5KB → (14.8% reduction)
- **Total**: 63KB → 30KB → (52.8% overall reduction)
- **ZIP Size**: **10,549 bytes** (79.2% of 13KB limit)
- **Remaining**: **2,763 bytes** (20.8% free space)

## 🛠️ Build System Features

### Aggressive Optimization Techniques
- **Variable mangling**: Long variable names → single letters
- **Function shortening**: `handleCollision` → `hC`
- **String extraction**: Common strings become variables
- **Boolean optimization**: `true`/`false` → `!0`/`!1`
- **Dead code elimination**: Remove unused functions
- **Console removal**: All debug statements stripped
- **Property mangling**: Object properties shortened
- **CSS optimization**: Rules merged, values shortened
- **HTML minification**: Whitespace collapsed, attributes optimized

### Development Commands
```bash
npm start              # Development server
npm run build         # Create optimized build
npm run analyze       # Size analysis
npm run submission    # Final build + ZIP
npm run dev           # Auto-rebuilding development
npm run size          # Quick size check
npm test              # Validate size limits
```

## 🎮 Game Controls

### Desktop
- **Movement**: Arrow keys or WASD
- **Mouse**: Click and drag for smooth following
- **Power-ups**: 1/Q (Pounce), 2/E (Night Vision), 3/R (Extra Life)
- **Dash**: Spacebar/Shift (when Pounce active)

### Mobile
- **Touch**: Drag to move the cat
- **Responsive**: Optimized for mobile screens

## 🎯 Gameplay

### Good Items (Collect These!)
- 🐟 **Fish** - 10 points
- ⭐ **Stars** - 20 points  
- 🌙 **Moon** - 30 points
- 🍀 **Clover** - 50 points + invincibility
- 🐾 **Pounce** - Dash ability power-up
- 👁️ **Night Vision** - See items early
- 💜 **Extra Life** - Bonus life power-up

### Bad Items (Avoid These!)
- 🪞 **Mirrors** - Lose a life (broken mirror = bad luck)
- 🪜 **Ladders** - Lose a life (walking under ladders)
- 🧂 **Salt** - Lose a life (spilled salt superstition)

### Special Features
- **Combo System**: Chain good items for multiplier bonuses
- **Lives**: Start with 9 lives (cat theme), gain bonus lives every 3 levels
- **Special Events**: Friday the 13th (more bad items) and Full Moon (double points)
- **Progressive Difficulty**: Faster spawning and movement as levels increase

## 🏆 Game Modes

1. **Endless Mode**: Classic arcade survival
2. **Story Mode**: Themed levels with unique challenges
3. **Challenge Mode**: Daily challenges with special rules
4. **Tutorial Mode**: Interactive learning experience

## 🏅 Achievements

Track your progress with 10 achievements:
- First Steps, Combo Cat, Combo Master, Combo Legend
- Persistent Cat, Nine Lives, Item Hoarder
- Veteran Player, Lucky Cat, Perfectionist

## 🎨 Technical Highlights

### Size Optimization for JS13K
- **Ultra-aggressive minification** using custom build system
- **Single-file submission** with inlined CSS and JavaScript
- **Procedural graphics** using Canvas API (no external images)
- **Emoji sprites** for game objects (no image files needed)
- **Efficient particle systems** with object pooling
- **Smart caching** of DOM elements and calculations

### Performance Features
- **60 FPS game loop** with requestAnimationFrame
- **Smooth interpolated movement** for responsive controls  
- **Particle effects** for visual feedback
- **Memory management** with efficient cleanup
- **Mobile optimization** with touch-friendly controls

### Code Architecture
- **Single-file game logic** for minimal footprint
- **State management** for menus and game modes
- **Event-driven systems** for clean code organization
- **Collision detection** optimized for performance
- **Audio system** with Web Audio API procedural sounds

## 🔧 Development

Built with modern JavaScript, HTML5 Canvas, and CSS3. Uses an aggressive build system specifically designed for JS13K constraints.

### Build System
- **Terser** for ultra-aggressive JavaScript minification
- **CleanCSS** for CSS optimization
- **HTML Minifier** for HTML compression
- **Custom analyzers** for size monitoring
- **ZIP packaging** with size validation

## 📦 Submission

The final game is packaged as a single `submission.html` file containing all game code, styles, and logic. Simply open the file in a web browser to play!

**File**: `submission.html` (29KB uncompressed, 10.5KB zipped)  
**Compatibility**: Modern browsers with Canvas and JavaScript support  
**Requirements**: None - fully self-contained offline game

---

🐈‍⬛ **Shadow Paws** - Where superstition meets arcade action in under 13KB!