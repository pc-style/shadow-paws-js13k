#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JS13K_LIMIT = 13312;

class JS13KAnalyzer {
  constructor() {
    this.dirs = {
      src: 'src',
      dist: 'dist',
      build: 'build'
    };
    
    this.files = {
      js: 'game.js',
      css: 'style.css',
      html: 'index.html'
    };
  }

  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (e) {
      return 0;
    }
  }

  getGzippedSize(filePath) {
    try {
      const tempGz = filePath + '.tmp.gz';
      execSync(`gzip -c "${filePath}" > "${tempGz}"`, { stdio: 'pipe' });
      const size = this.getFileSize(tempGz);
      fs.unlinkSync(tempGz);
      return size;
    } catch (e) {
      return 0;
    }
  }

  analyze() {
    console.log('🔍 JS13K Size Analysis\n');
    
    // Analyze source files
    console.log('📂 Source files (src/):');
    const srcFiles = [this.files.js, this.files.css, this.files.html];
    let srcTotal = 0;
    
    srcFiles.forEach(file => {
      const filePath = path.join(this.dirs.src, file);
      if (fs.existsSync(filePath)) {
        const size = this.getFileSize(filePath);
        const gzSize = this.getGzippedSize(filePath);
        srcTotal += size;
        console.log(`   ${file.padEnd(12)} ${size.toString().padStart(6)} bytes (${gzSize} gz)`);
      }
    });
    console.log(`   ${'Total:'.padEnd(12)} ${srcTotal.toString().padStart(6)} bytes\n`);

    // Analyze minified files
    console.log('⚡ Minified files (dist/):');
    const distFiles = [this.files.js, this.files.css, this.files.html];
    let distTotal = 0;
    
    distFiles.forEach((file, i) => {
      const filePath = path.join(this.dirs.dist, file);
      const srcPath = path.join(this.dirs.src, srcFiles[i]);
      
      if (fs.existsSync(filePath)) {
        const size = this.getFileSize(filePath);
        const srcSize = this.getFileSize(srcPath);
        const reduction = srcSize > 0 ? ((srcSize - size) / srcSize * 100) : 0;
        const gzSize = this.getGzippedSize(filePath);
        
        distTotal += size;
        console.log(`   ${file.padEnd(12)} ${size.toString().padStart(6)} bytes (${gzSize} gz) [${reduction.toFixed(1)}% reduction]`);
      }
    });
    console.log(`   ${'Total:'.padEnd(12)} ${distTotal.toString().padStart(6)} bytes [${((srcTotal - distTotal)/srcTotal*100).toFixed(1)}% overall]\n`);

    // Analyze submission
    const submissionFile = 'submission.html';
    const zipFile = 'submission.zip';
    
    if (fs.existsSync(submissionFile)) {
      console.log('🎯 Final submission:');
      const submissionSize = this.getFileSize(submissionFile);
      const submissionGz = this.getGzippedSize(submissionFile);
      
      console.log(`   ${submissionFile.padEnd(15)} ${submissionSize.toString().padStart(6)} bytes (${submissionGz} gz)`);
      
      if (fs.existsSync(zipFile)) {
        const zipSize = this.getFileSize(zipFile);
        const remaining = JS13K_LIMIT - zipSize;
        const percentUsed = (zipSize / JS13K_LIMIT * 100);
        
        console.log(`   ${zipFile.padEnd(15)} ${zipSize.toString().padStart(6)} bytes`);
        console.log(`   ${'Remaining:'.padEnd(15)} ${remaining.toString().padStart(6)} bytes`);
        console.log(`   ${'Limit usage:'.padEnd(15)} ${percentUsed.toFixed(1)}%`);
        
        if (zipSize > JS13K_LIMIT) {
          console.log('\n   ❌ EXCEEDS JS13K LIMIT!');
        } else if (zipSize > JS13K_LIMIT * 0.95) {
          console.log('\n   ⚠️  Very close to limit');
        } else {
          console.log('\n   ✅ Under limit');
        }
      }
    } else {
      console.log('⚠️  No submission files found. Run build first.');
    }
    
    return {
      source: srcTotal,
      minified: distTotal,
      submission: fs.existsSync(submissionFile) ? this.getFileSize(submissionFile) : 0,
      zip: fs.existsSync(zipFile) ? this.getFileSize(zipFile) : 0
    };
  }

  quickCheck() {
    console.log('📏 Quick size check:');
    
    const srcFiles = ['src/game.js', 'src/style.css', 'src/index.html'];
    let total = 0;
    
    srcFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const size = this.getFileSize(file);
        total += size;
        console.log(`   ${path.basename(file)}: ${size} bytes`);
      }
    });
    
    console.log(`   Total: ${total} bytes`);
    
    // Rough compression estimate
    const estimatedZip = Math.floor(total * 0.25); // Very rough ZIP estimate
    console.log(`   Est. ZIP: ~${estimatedZip} bytes`);
    console.log(`   JS13K limit: ${JS13K_LIMIT} bytes`);
    
    if (estimatedZip > JS13K_LIMIT) {
      console.log('   ⚠️  May exceed limit - optimize needed');
    } else {
      console.log(`   ✅ Should fit (${JS13K_LIMIT - estimatedZip} bytes margin)`);
    }
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new JS13KAnalyzer();
  const args = process.argv.slice(2);
  
  if (args.includes('--quick')) {
    analyzer.quickCheck();
  } else {
    analyzer.analyze();
  }
}

module.exports = JS13KAnalyzer;