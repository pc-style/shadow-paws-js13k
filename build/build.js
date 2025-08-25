#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: htmlMinify } = require('html-minifier-terser');

// Aggressive JS13K optimizations
const JS13K_OPTIMIZATIONS = {
  // Common strings that should be variables
  commonStrings: {
    'document.getElementById': 'gE',
    'addEventListener': 'aE',
    'removeEventListener': 'rE',
    'requestAnimationFrame': 'rA',
    'Math.random': 'mR',
    'Math.floor': 'mF',
    'Math.sin': 'mS',
    'Math.cos': 'mC',
    'Math.sqrt': 'mQ',
    'Math.abs': 'mA',
    'Math.max': 'mX',
    'Math.min': 'mN',
    'canvas.width': 'cW',
    'canvas.height': 'cH'
  },
  
  // Variable name mappings for ultra-short names
  variableMap: {
    'gameStarted': 'a',
    'currentGameMode': 'b', 
    'currentMenu': 'c',
    'scoreEl': 'd',
    'livesEl': 'e',
    'highScoreEl': 'f',
    'comboEl': 'g',
    'levelEl': 'h',
    'eventStatusEl': 'i',
    'mainMenu': 'j',
    'playMenu': 'k',
    'tutorialScreen': 'l',
    'achievementsScreen': 'm',
    'statsScreen': 'n',
    'settingsScreen': 'o',
    'gameOverScreen': 'p',
    'invincible': 'q',
    'invincibleTimer': 'r',
    'comboTimer': 's',
    'maxCombo': 't',
    'speedMultiplier': 'u',
    'frameCount': 'v',
    'countdownInterval': 'w',
    'activePowerUps': 'x',
    'powerUpCooldowns': 'y',
    'fridayThe13thMode': 'z',
    'fridayThe13thTimer': 'A',
    'fullMoonEvent': 'B',
    'fullMoonTimer': 'C',
    'audioCtx': 'D',
    'audioEnabled': 'E',
    'achievements': 'F',
    'totalItemsCollected': 'G',
    'totalGamesPlayed': 'H',
    'longestStreak': 'I',
    'currentStreak': 'J'
  },
  
  // Function name mappings
  functionMap: {
    'handleCollision': 'hC',
    'updateCat': 'uC',
    'updateItems': 'uI',
    'updateParticles': 'uP',
    'updatePowerUps': 'uPU',
    'updateSpecialEvents': 'uSE',
    'updateMagicSparkles': 'uMS',
    'updateLightning': 'uL',
    'updatePawPrints': 'uPP',
    'drawCat': 'dC',
    'drawItems': 'dI',
    'drawParticles': 'dP',
    'drawStars': 'dS',
    'drawMagicSparkles': 'dMS',
    'drawLightning': 'dL',
    'drawPawPrints': 'dPP',
    'spawnItem': 'sI',
    'createParticle': 'cP',
    'createMagicSparkle': 'cMS',
    'createLightningFlash': 'cLF',
    'createLevelUpEffect': 'cLUE',
    'activatePowerUp': 'aPU',
    'hasPowerUp': 'hPU',
    'unlockAchievement': 'uA',
    'checkAchievements': 'chA',
    'showMenu': 'sM',
    'startGame': 'sG',
    'endGame': 'eG',
    'resetGame': 'rG',
    'gameLoop': 'gL'
  },
  
  // CSS class/ID mappings to single characters
  cssMap: {
    'mainMenu': 'a',
    'playMenu': 'b',
    'tutorialScreen': 'c',
    'achievementsScreen': 'd',
    'statsScreen': 'e',
    'settingsScreen': 'f',
    'gameOver': 'g',
    'menu-screen': 'h',
    'menu-btn': 'i',
    'menu-buttons': 'j',
    'mode-btn': 'k',
    'tutorial-step': 'l',
    'achievement-card': 'm',
    'stats-content': 'n',
    'setting-group': 'o',
    'toggle-slider': 'p'
  }
};

// Pre-processing optimizations before minification
function preOptimizeJS(code) {
  let optimized = code;
  
  // Replace common strings with shorter variables (injected at top)
  let shortcuts = 'const ';
  const shortcutEntries = Object.entries(JS13K_OPTIMIZATIONS.commonStrings);
  shortcutEntries.forEach(([long, short], i) => {
    shortcuts += `${short}=${long}${i < shortcutEntries.length - 1 ? ',' : ';'}`;
    // Replace all occurrences with the shortcut
    optimized = optimized.replace(new RegExp(long.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), short);
  });
  
  // Add shortcuts at the top
  optimized = shortcuts + optimized;
  
  // Replace function names throughout the code
  Object.entries(JS13K_OPTIMIZATIONS.functionMap).forEach(([long, short]) => {
    // Replace function declarations
    optimized = optimized.replace(new RegExp(`function\\s+${long}\\s*\\(`, 'g'), `function ${short}(`);
    // Replace function calls
    optimized = optimized.replace(new RegExp(`\\b${long}\\s*\\(`, 'g'), `${short}(`);
  });
  
  // Replace variable names
  Object.entries(JS13K_OPTIMIZATIONS.variableMap).forEach(([long, short]) => {
    // More careful replacement to avoid breaking string literals
    optimized = optimized.replace(new RegExp(`\\b${long}\\b(?!['"\\]])`, 'g'), short);
  });
  
  // Additional micro-optimizations
  optimized = optimized
    // Replace true/false with 1/0 where safe
    .replace(/\btrue\b/g, '!0')
    .replace(/\bfalse\b/g, '!1')
    // Shorten common array methods
    .replace(/\.forEach\(/g, '.map(') // map is shorter and works for iteration
    .replace(/\.length/g, '.l') // Will need to add length property shortcut
    // Replace ===0 with !
    .replace(/===\s*0\b/g, '==0')
    .replace(/!==\s*0\b/g, '!=0')
    // Shorten Math constants
    .replace(/Math\.PI/g, 'M_PI')
    // Add Math.PI shortcut
    optimized = 'const M_PI=Math.PI;' + optimized;
  
  return optimized;
}

async function buildJS13K() {
  console.log('🚀 Starting JS13K aggressive minification...\n');
  
  try {
    // Read source files
    const jsSource = fs.readFileSync('game.js', 'utf8');
    const cssSource = fs.readFileSync('style.css', 'utf8');
    const htmlSource = fs.readFileSync('index.html', 'utf8');
    
    console.log('📊 Original file sizes:');
    console.log(`   JS: ${jsSource.length} bytes`);
    console.log(`   CSS: ${cssSource.length} bytes`);
    console.log(`   HTML: ${htmlSource.length} bytes`);
    console.log(`   Total: ${jsSource.length + cssSource.length + htmlSource.length} bytes\n`);
    
    // Step 1: Pre-optimize JavaScript
    console.log('🔧 Pre-optimizing JavaScript...');
    const preOptimizedJS = preOptimizeJS(jsSource);
    
    // Step 2: Aggressive JavaScript minification
    console.log('⚡ Minifying JavaScript with ultra-aggressive settings...');
    const terserConfig = JSON.parse(fs.readFileSync('terser.config.json', 'utf8'));
    const jsResult = await minify(preOptimizedJS, terserConfig);
    
    if (jsResult.error) {
      console.error('❌ JavaScript minification failed:', jsResult.error);
      return;
    }
    
    let minifiedJS = jsResult.code;
    
    // Additional post-processing optimizations
    minifiedJS = minifiedJS
      // Remove unnecessary semicolons at end of blocks
      .replace(/;}$/gm, '}')
      // Compress whitespace around operators
      .replace(/\s*([+\-*/=<>!&|])\s*/g, '$1')
      // Remove spaces around commas
      .replace(/,\s+/g, ',')
      // Remove spaces in function parameters
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      // More aggressive array access shortening
      .replace(/\[0\]/g, '[0]') // Keep as is, already minimal
      // Final cleanup
      .trim();
    
    // Step 3: Optimize CSS with class/ID renaming
    console.log('🎨 Optimizing CSS...');
    let optimizedCSS = cssSource;
    
    // TODO: Class/ID renaming disabled for now - causes issues with complex HTML
    // Replace class and ID names with shorter versions
    // Object.entries(JS13K_OPTIMIZATIONS.cssMap).forEach(([long, short]) => {
    //   // Replace in CSS selectors
    //   optimizedCSS = optimizedCSS
    //     .replace(new RegExp(`#${long}\\b`, 'g'), `#${short}`)
    //     .replace(new RegExp(`\\.${long}\\b`, 'g'), `.${short}`);
    // });
    
    // Minify CSS
    const cssResult = new CleanCSS({
      level: 2,
      format: false,
      compatibility: '*',
      inline: ['all'],
      transform: (rule) => rule
    }).minify(optimizedCSS);
    
    const minifiedCSS = cssResult.styles;
    
    // Step 4: Update HTML with new class/ID names and minify
    console.log('📄 Optimizing HTML...');
    let optimizedHTML = htmlSource;
    
    // Replace class and ID names in HTML
    Object.entries(JS13K_OPTIMIZATIONS.cssMap).forEach(([long, short]) => {
      optimizedHTML = optimizedHTML
        .replace(new RegExp(`id="${long}"`, 'g'), `id="${short}"`)
        .replace(new RegExp(`class="([^"]*\\s+)?${long}(\\s+[^"]*)?"`), (match, before = '', after = '') => {
          const trimmedBefore = (before || '').trim();
          const trimmedAfter = (after || '').trim();
          const newClass = [trimmedBefore, short, trimmedAfter].filter(Boolean).join(' ');
          return `class="${newClass}"`;
        })
        .replace(new RegExp(`class="${long}"`, 'g'), `class="${short}"`);
    });
    
    // Minify HTML
    const minifiedHTML = await htmlMinify(optimizedHTML, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      html5: true
    });
    
    // Step 5: Write optimized files
    console.log('💾 Writing optimized files...');
    fs.writeFileSync('dist.js', minifiedJS);
    fs.writeFileSync('dist.css', minifiedCSS);
    fs.writeFileSync('dist.html', minifiedHTML);
    
    // Create inline version for maximum compression
    const inlineHTML = minifiedHTML
      .replace(/<link[^>]*href="?style\.css"?[^>]*>/g, `<style>${minifiedCSS}</style>`)
      .replace(/<script[^>]*src="?game\.js"?[^>]*><\/script>/g, `<script>${minifiedJS}</script>`);
    
    fs.writeFileSync('submission.html', inlineHTML);
    
    // Step 6: Generate size report
    console.log('\n📊 Minification Results:');
    console.log(`   JS: ${jsSource.length} → ${minifiedJS.length} bytes (${((1 - minifiedJS.length/jsSource.length) * 100).toFixed(1)}% reduction)`);
    console.log(`   CSS: ${cssSource.length} → ${minifiedCSS.length} bytes (${((1 - minifiedCSS.length/cssSource.length) * 100).toFixed(1)}% reduction)`);
    console.log(`   HTML: ${htmlSource.length} → ${minifiedHTML.length} bytes (${((1 - minifiedHTML.length/htmlSource.length) * 100).toFixed(1)}% reduction)`);
    
    const originalTotal = jsSource.length + cssSource.length + htmlSource.length;
    const minifiedTotal = minifiedJS.length + minifiedCSS.length + minifiedHTML.length;
    const inlineTotal = inlineHTML.length;
    
    console.log(`\n   Separate files total: ${minifiedTotal} bytes`);
    console.log(`   Inline version: ${inlineTotal} bytes`);
    console.log(`   Overall reduction: ${((1 - inlineTotal/originalTotal) * 100).toFixed(1)}%\n`);
    
    // Step 7: Create ZIP and check size
    console.log('📦 Creating submission ZIP...');
    const { execSync } = require('child_process');
    
    // Clean up old zip
    try { fs.unlinkSync('submission.zip'); } catch(e) {}
    
    execSync('zip -9 submission.zip submission.html');
    const zipStats = fs.statSync('submission.zip');
    const zipSize = zipStats.size;
    
    console.log(`🎯 Final ZIP size: ${zipSize} bytes`);
    console.log(`   JS13K limit: 13,312 bytes`);
    console.log(`   Remaining: ${13312 - zipSize} bytes (${((13312 - zipSize) / 13312 * 100).toFixed(1)}%)`);
    
    if (zipSize > 13312) {
      console.log('⚠️  WARNING: Exceeds JS13K size limit!');
    } else {
      console.log('✅ Under JS13K size limit!');
    }
    
    // Additional analysis
    console.log('\n🔍 Advanced Analysis:');
    execSync('gzip -c submission.html > submission.html.gz');
    const gzipStats = fs.statSync('submission.html.gz');
    console.log(`   Gzipped HTML: ${gzipStats.size} bytes`);
    
    // Estimate further optimizations possible
    console.log('\n💡 Potential further optimizations:');
    const longVarMatches = minifiedJS.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]{3,}\b/g);
    if (longVarMatches) {
      const uniqueLongVars = [...new Set(longVarMatches)].slice(0, 10);
      console.log(`   Found ${uniqueLongVars.length} variables that could be shortened further:`);
      uniqueLongVars.forEach(v => console.log(`     ${v}`));
    }
    
    // Clean up temp files
    try { fs.unlinkSync('submission.html.gz'); } catch(e) {}
    
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  buildJS13K();
}

module.exports = { buildJS13K, JS13K_OPTIMIZATIONS };