#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// JS13K size limit in bytes
const JS13K_LIMIT = 13312;

/**
 * Analyze file sizes and provide detailed compression statistics
 */
class JS13KAnalyzer {
  constructor() {
    this.results = {
      original: {},
      minified: {},
      compression: {},
      recommendations: []
    };
  }

  // Get file size with error handling
  getFileSize(filePath) {
    try {
      return fs.statSync(filePath).size;
    } catch (e) {
      return 0;
    }
  }

  // Get gzipped size
  getGzippedSize(filePath) {
    try {
      const tempGz = filePath + '.gz';
      execSync(`gzip -c "${filePath}" > "${tempGz}"`, { stdio: 'pipe' });
      const size = this.getFileSize(tempGz);
      fs.unlinkSync(tempGz);
      return size;
    } catch (e) {
      return 0;
    }
  }

  // Analyze code patterns for optimization opportunities
  analyzeCode(code, type) {
    const analysis = {
      totalLength: code.length,
      lines: code.split('\n').length,
      patterns: {}
    };

    if (type === 'js') {
      // JavaScript-specific analysis
      analysis.patterns = {
        longVariables: this.findLongVariables(code),
        repeatedStrings: this.findRepeatedStrings(code),
        unnecessarySpacing: this.countUnnecessarySpacing(code),
        consoleStatements: (code.match(/console\.\w+/g) || []).length,
        functionDeclarations: (code.match(/function\s+\w+/g) || []).length,
        arrowFunctions: (code.match(/=>\s*{?/g) || []).length
      };
    } else if (type === 'css') {
      // CSS-specific analysis
      analysis.patterns = {
        longSelectors: this.findLongCSSSelectors(code),
        duplicateProperties: this.findDuplicateCSS(code),
        longClassNames: this.findLongClassNames(code),
        unnecessaryWhitespace: this.countCSSWhitespace(code)
      };
    }

    return analysis;
  }

  findLongVariables(code) {
    const variables = code.match(/\b[a-zA-Z_$][a-zA-Z0-9_$]{4,}\b/g) || [];
    const counts = {};
    variables.forEach(v => counts[v] = (counts[v] || 0) + 1);
    
    // Return top 10 most frequent long variables
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count, savings: (name.length - 1) * count }));
  }

  findRepeatedStrings(code) {
    const strings = code.match(/"[^"]{3,}"|'[^']{3,}'/g) || [];
    const counts = {};
    strings.forEach(s => counts[s] = (counts[s] || 0) + 1);
    
    return Object.entries(counts)
      .filter(([str, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([str, count]) => ({ string: str, count, savings: (str.length - 2) * (count - 1) }));
  }

  countUnnecessarySpacing(code) {
    const multipleSpaces = (code.match(/  +/g) || []).length;
    const spacesAroundOperators = (code.match(/\s+[+\-*/%=<>!&|]+\s+/g) || []).length;
    return { multipleSpaces, spacesAroundOperators };
  }

  findLongCSSSelectors(code) {
    const selectors = code.match(/[^{}]+{/g) || [];
    return selectors
      .map(s => s.replace('{', '').trim())
      .filter(s => s.length > 20)
      .slice(0, 10)
      .map(s => ({ selector: s, length: s.length }));
  }

  findDuplicateCSS(code) {
    const properties = code.match(/[^{}]+:[^;}]+/g) || [];
    const counts = {};
    properties.forEach(p => counts[p.trim()] = (counts[p.trim()] || 0) + 1);
    
    return Object.entries(counts)
      .filter(([prop, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  findLongClassNames(code) {
    const classNames = code.match(/\.[a-zA-Z][a-zA-Z0-9_-]{4,}/g) || [];
    return [...new Set(classNames)]
      .filter(c => c.length > 10)
      .slice(0, 10);
  }

  countCSSWhitespace(code) {
    const unnecessarySpaces = (code.match(/\s*{\s*/g) || []).length;
    const unnecessaryNewlines = (code.match(/\n\s*\n/g) || []).length;
    return { unnecessarySpaces, unnecessaryNewlines };
  }

  // Generate optimization recommendations
  generateRecommendations(analysis) {
    const recommendations = [];

    // JavaScript recommendations
    if (analysis.js) {
      const js = analysis.js.patterns;
      
      if (js.longVariables && js.longVariables.length > 0) {
        const totalSavings = js.longVariables.reduce((sum, v) => sum + v.savings, 0);
        recommendations.push({
          type: 'js',
          priority: 'high',
          description: `Shorten ${js.longVariables.length} frequently used variables`,
          savings: `~${totalSavings} bytes`,
          variables: js.longVariables.slice(0, 5).map(v => v.name)
        });
      }

      if (js.repeatedStrings && js.repeatedStrings.length > 0) {
        const totalSavings = js.repeatedStrings.reduce((sum, s) => sum + s.savings, 0);
        recommendations.push({
          type: 'js',
          priority: 'medium',
          description: `Convert repeated strings to variables`,
          savings: `~${totalSavings} bytes`,
          examples: js.repeatedStrings.slice(0, 3).map(s => s.string)
        });
      }

      if (js.consoleStatements > 0) {
        recommendations.push({
          type: 'js',
          priority: 'high',
          description: `Remove ${js.consoleStatements} console statements`,
          savings: `~${js.consoleStatements * 15} bytes`
        });
      }
    }

    // CSS recommendations
    if (analysis.css) {
      const css = analysis.css.patterns;
      
      if (css.longClassNames && css.longClassNames.length > 0) {
        recommendations.push({
          type: 'css',
          priority: 'medium',
          description: `Shorten ${css.longClassNames.length} long class names`,
          savings: `~${css.longClassNames.length * 10} bytes`,
          classes: css.longClassNames.slice(0, 5)
        });
      }

      if (css.duplicateProperties && css.duplicateProperties.length > 0) {
        recommendations.push({
          type: 'css',
          priority: 'medium',
          description: `Merge ${css.duplicateProperties.length} duplicate CSS properties`,
          savings: `~${css.duplicateProperties.length * 20} bytes`
        });
      }
    }

    return recommendations;
  }

  // Main analysis function
  async analyze(showDetailed = false) {
    console.log('🔍 JS13K Size Analysis\n');
    
    // Analyze original files
    const originalFiles = ['game.js', 'style.css', 'index.html'];
    const minifiedFiles = ['dist.js', 'dist.css', 'dist.html'];
    const finalFile = 'submission.html';

    console.log('📊 Original Files:');
    let originalTotal = 0;
    let codeAnalysis = {};

    for (const file of originalFiles) {
      if (fs.existsSync(file)) {
        const size = this.getFileSize(file);
        const gzSize = this.getGzippedSize(file);
        originalTotal += size;
        
        console.log(`   ${file.padEnd(12)} ${size.toString().padStart(6)} bytes (${gzSize} gzipped)`);
        
        // Analyze code patterns if detailed analysis requested
        if (showDetailed) {
          const content = fs.readFileSync(file, 'utf8');
          const ext = path.extname(file).slice(1);
          if (ext === 'js' || ext === 'css') {
            codeAnalysis[ext] = this.analyzeCode(content, ext);
          }
        }
      }
    }
    console.log(`   ${'Total:'.padEnd(12)} ${originalTotal.toString().padStart(6)} bytes\n`);

    // Analyze minified files
    console.log('⚡ Minified Files:');
    let minifiedTotal = 0;
    let minificationSavings = 0;

    for (let i = 0; i < minifiedFiles.length; i++) {
      const file = minifiedFiles[i];
      if (fs.existsSync(file)) {
        const size = this.getFileSize(file);
        const originalSize = this.getFileSize(originalFiles[i]);
        const reduction = originalSize > 0 ? ((originalSize - size) / originalSize * 100) : 0;
        const gzSize = this.getGzippedSize(file);
        
        minifiedTotal += size;
        minificationSavings += (originalSize - size);
        
        console.log(`   ${file.padEnd(12)} ${size.toString().padStart(6)} bytes (${gzSize} gz) [${reduction.toFixed(1)}% reduction]`);
      }
    }
    console.log(`   ${'Total:'.padEnd(12)} ${minifiedTotal.toString().padStart(6)} bytes [${(minificationSavings/originalTotal*100).toFixed(1)}% overall reduction]\n`);

    // Analyze final submission
    if (fs.existsSync(finalFile)) {
      const finalSize = this.getFileSize(finalFile);
      const finalGzSize = this.getGzippedSize(finalFile);
      
      console.log('🎯 Final Submission:');
      console.log(`   ${finalFile.padEnd(15)} ${finalSize.toString().padStart(6)} bytes (${finalGzSize} gzipped)`);
      
      // Check ZIP size if exists
      const zipFile = 'submission.zip';
      if (fs.existsSync(zipFile)) {
        const zipSize = this.getFileSize(zipFile);
        const remaining = JS13K_LIMIT - zipSize;
        const percentUsed = (zipSize / JS13K_LIMIT * 100).toFixed(1);
        
        console.log(`   ${zipFile.padEnd(15)} ${zipSize.toString().padStart(6)} bytes`);
        console.log(`   ${'Remaining:'.padEnd(15)} ${remaining.toString().padStart(6)} bytes (${(100 - percentUsed)}% free)`);
        console.log(`   ${'Limit usage:'.padEnd(15)} ${percentUsed}%`);
        
        if (zipSize > JS13K_LIMIT) {
          console.log('   ⚠️  EXCEEDS JS13K LIMIT!');
        } else if (zipSize > JS13K_LIMIT * 0.95) {
          console.log('   ⚠️  Very close to limit');
        } else {
          console.log('   ✅ Under limit');
        }
      }
      console.log();
    }

    // Show detailed analysis if requested
    if (showDetailed) {
      console.log('🔍 Detailed Code Analysis:\n');
      
      if (codeAnalysis.js) {
        console.log('JavaScript Patterns:');
        const js = codeAnalysis.js.patterns;
        
        if (js.longVariables.length > 0) {
          console.log('  Long Variables (Top 5):');
          js.longVariables.slice(0, 5).forEach(v => {
            console.log(`    ${v.name} (used ${v.count}x, save ~${v.savings} bytes)`);
          });
        }
        
        if (js.repeatedStrings.length > 0) {
          console.log('  Repeated Strings:');
          js.repeatedStrings.forEach(s => {
            console.log(`    ${s.string} (${s.count}x, save ~${s.savings} bytes)`);
          });
        }
        console.log();
      }

      if (codeAnalysis.css) {
        console.log('CSS Patterns:');
        const css = codeAnalysis.css.patterns;
        
        if (css.longClassNames.length > 0) {
          console.log('  Long Class Names:');
          css.longClassNames.forEach(c => {
            console.log(`    ${c} (${c.length} chars)`);
          });
        }
        console.log();
      }

      // Generate and show recommendations
      const recommendations = this.generateRecommendations(codeAnalysis);
      if (recommendations.length > 0) {
        console.log('💡 Optimization Recommendations:\n');
        recommendations.forEach((rec, i) => {
          console.log(`  ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.description}`);
          console.log(`     Potential savings: ${rec.savings}`);
          if (rec.variables) {
            console.log(`     Variables: ${rec.variables.join(', ')}`);
          }
          if (rec.examples) {
            console.log(`     Examples: ${rec.examples.join(', ')}`);
          }
          if (rec.classes) {
            console.log(`     Classes: ${rec.classes.join(', ')}`);
          }
          console.log();
        });
      }
    }

    return this.results;
  }

  // Quick size check for development
  quickCheck() {
    const files = ['game.js', 'style.css', 'index.html'];
    let total = 0;
    
    console.log('📏 Quick Size Check:');
    files.forEach(file => {
      if (fs.existsSync(file)) {
        const size = this.getFileSize(file);
        total += size;
        console.log(`   ${file}: ${size} bytes`);
      }
    });
    
    console.log(`   Total: ${total} bytes`);
    
    // Estimate compressed size (rough approximation)
    const estimatedZip = Math.floor(total * 0.3); // ZIP typically compresses to ~30% for text
    console.log(`   Est. ZIP: ~${estimatedZip} bytes`);
    console.log(`   JS13K limit: ${JS13K_LIMIT} bytes`);
    
    if (estimatedZip > JS13K_LIMIT) {
      console.log('   ⚠️  Likely to exceed limit');
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
    const detailed = args.includes('--detailed');
    analyzer.analyze(detailed);
  }
}

module.exports = JS13KAnalyzer;