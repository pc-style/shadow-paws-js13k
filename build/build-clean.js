#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const CleanCSS = require('clean-css');
const { minify: htmlMinify } = require('html-minifier-terser');

// Project directories
const DIRS = {
  src: 'src',
  build: 'build', 
  dist: 'dist',
  root: '.'
};

// Files
const FILES = {
  js: 'game.js',
  css: 'style.css', 
  html: 'index.html'
};

// Aggressive JS13K optimizations
const JS13K_OPTIMIZATIONS = {
  // Common strings that should be variables
  commonStrings: {
    'document.getElementById': 'gE',
    'addEventListener': 'aE',
    'requestAnimationFrame': 'rA',
    'Math.random': 'mR',
    'Math.floor': 'mF',
    'Math.sin': 'mS',
    'Math.cos': 'mC',
    'Math.PI': 'mPI'
  }
};

// Pre-processing optimizations before minification
function preOptimizeJS(code) {
  let optimized = code;
  
  // Replace common strings with shorter variables
  let shortcuts = 'const ';
  const shortcutEntries = Object.entries(JS13K_OPTIMIZATIONS.commonStrings);
  shortcutEntries.forEach(([long, short], i) => {
    shortcuts += `${short}=${long}${i < shortcutEntries.length - 1 ? ',' : ';'}`;
    // Replace all occurrences with the shortcut
    optimized = optimized.replace(new RegExp(long.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), short);
  });
  
  // Add shortcuts at the top
  optimized = shortcuts + optimized;
  
  // Additional micro-optimizations  
  optimized = optimized
    // Replace true/false with 1/0 where safe
    .replace(/\btrue\b/g, '!0')
    .replace(/\bfalse\b/g, '!1')
    // Replace ===0 with ==0 (smaller)
    .replace(/===\s*0\b/g, '==0')
    .replace(/!==\s*0\b/g, '!=0');
  
  return optimized;
}

async function buildJS13K() {
  console.log('🚀 JS13K Aggressive Build System\n');
  
  try {
    // Ensure directories exist
    if (!fs.existsSync(DIRS.dist)) {
      fs.mkdirSync(DIRS.dist, { recursive: true });
    }
    
    // Read source files
    const jsSource = fs.readFileSync(path.join(DIRS.src, FILES.js), 'utf8');
    const cssSource = fs.readFileSync(path.join(DIRS.src, FILES.css), 'utf8');
    const htmlSource = fs.readFileSync(path.join(DIRS.src, FILES.html), 'utf8');
    
    console.log('📊 Source files:');
    console.log(`   ${FILES.js.padEnd(12)} ${jsSource.length.toString().padStart(6)} bytes`);
    console.log(`   ${FILES.css.padEnd(12)} ${cssSource.length.toString().padStart(6)} bytes`);
    console.log(`   ${FILES.html.padEnd(12)} ${htmlSource.length.toString().padStart(6)} bytes`);
    const originalTotal = jsSource.length + cssSource.length + htmlSource.length;
    console.log(`   ${'Total:'.padEnd(12)} ${originalTotal.toString().padStart(6)} bytes\n`);
    
    // Step 1: Pre-optimize JavaScript
    console.log('🔧 Pre-optimizing JavaScript...');
    const preOptimizedJS = preOptimizeJS(jsSource);
    
    // Step 2: Aggressive JavaScript minification
    console.log('⚡ Minifying JavaScript...');
    const terserConfig = JSON.parse(fs.readFileSync(path.join(DIRS.build, 'terser.config.json'), 'utf8'));
    const jsResult = await minify(preOptimizedJS, terserConfig);
    
    if (jsResult.error) {
      console.error('❌ JavaScript minification failed:', jsResult.error);
      return;
    }
    
    const minifiedJS = jsResult.code;
    
    // Step 3: Optimize CSS
    console.log('🎨 Minifying CSS...');
    const cssResult = new CleanCSS({
      level: 2,
      format: false,
      compatibility: '*'
    }).minify(cssSource);
    
    const minifiedCSS = cssResult.styles;
    
    // Step 4: Minify HTML
    console.log('📄 Minifying HTML...');
    const minifiedHTML = await htmlMinify(htmlSource, {
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
      html5: true
    });
    
    // Step 5: Write optimized files
    console.log('💾 Writing minified files...');
    fs.writeFileSync(path.join(DIRS.dist, FILES.js), minifiedJS);
    fs.writeFileSync(path.join(DIRS.dist, FILES.css), minifiedCSS);
    fs.writeFileSync(path.join(DIRS.dist, FILES.html), minifiedHTML);
    
    // Step 6: Create single-file submission
    console.log('📦 Creating submission file...');
    const submissionHTML = minifiedHTML
      .replace(/<link[^>]*href="?style\.css"?[^>]*>/g, `<style>${minifiedCSS}</style>`)
      .replace(/<script[^>]*src="?game\.js"?[^>]*><\/script>/g, `<script>${minifiedJS}</script>`);
    
    fs.writeFileSync('submission.html', submissionHTML);
    
    // Step 7: Generate size report
    console.log('\n📊 Minification results:');
    console.log(`   JS:   ${jsSource.length} → ${minifiedJS.length} bytes (${((1 - minifiedJS.length/jsSource.length) * 100).toFixed(1)}% reduction)`);
    console.log(`   CSS:  ${cssSource.length} → ${minifiedCSS.length} bytes (${((1 - minifiedCSS.length/cssSource.length) * 100).toFixed(1)}% reduction)`);
    console.log(`   HTML: ${htmlSource.length} → ${minifiedHTML.length} bytes (${((1 - minifiedHTML.length/htmlSource.length) * 100).toFixed(1)}% reduction)`);
    
    const minifiedTotal = minifiedJS.length + minifiedCSS.length + minifiedHTML.length;
    const submissionSize = submissionHTML.length;
    
    console.log(`\n   Minified total: ${minifiedTotal} bytes`);
    console.log(`   Submission:     ${submissionSize} bytes`);
    console.log(`   Overall:        ${((1 - submissionSize/originalTotal) * 100).toFixed(1)}% reduction\n`);
    
    // Step 8: Create ZIP and check size
    console.log('🗜️  Creating ZIP...');
    const { execSync } = require('child_process');
    
    try { fs.unlinkSync('submission.zip'); } catch(e) {}
    execSync('zip -9 submission.zip submission.html');
    
    const zipStats = fs.statSync('submission.zip');
    const zipSize = zipStats.size;
    const remaining = 13312 - zipSize;
    const percentUsed = (zipSize / 13312 * 100).toFixed(1);
    
    console.log('🎯 Final results:');
    console.log(`   ZIP size:    ${zipSize} bytes`);
    console.log(`   JS13K limit: 13,312 bytes`);
    console.log(`   Remaining:   ${remaining} bytes (${(100 - percentUsed).toFixed(1)}% free)`);
    console.log(`   Usage:       ${percentUsed}%`);
    
    if (zipSize > 13312) {
      console.log('\n   ❌ EXCEEDS JS13K LIMIT!');
    } else if (zipSize > 13312 * 0.95) {
      console.log('\n   ⚠️  Very close to limit');
    } else {
      console.log('\n   ✅ Under JS13K limit');
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

// Run if called directly
if (require.main === module) {
  buildJS13K();
}

module.exports = { buildJS13K };