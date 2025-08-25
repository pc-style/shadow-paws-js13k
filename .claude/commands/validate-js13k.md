# /validate-js13k

Comprehensive validation against JS13K competition rules and requirements.

## Task

I\'ll validate $ARGUMENTS against all JS13K competition requirements, checking size limits, offline functionality, content restrictions, and submission format compliance.

## Process

I\'ll follow these steps:

1. **Size validation**: Verify ZIP package is ≤ 13,312 bytes (13KB)
2. **Content validation**: Check for prohibited external resources
3. **Functionality testing**: Verify offline operation
4. **Format compliance**: Validate index.html structure and ZIP format
5. **Performance testing**: Basic compatibility and performance checks

## Validation Categories

### Size Requirements
- ZIP file size measurement and reporting
- Individual file size breakdown
- Compression ratio analysis
- Buffer space calculation for last-minute changes

### Content Restrictions
- External resource dependency scan
- Google Fonts and CDN usage check
- Analytics and tracking script detection
- Server-dependent functionality identification

### Technical Requirements
- index.html presence and validity
- Offline functionality verification
- Cross-browser compatibility basics
- Mobile responsiveness check

### Package Format
- ZIP file integrity and extractability
- File path and naming conventions
- Directory structure compliance
- Character encoding validation

## Automated Checks

### Prohibited Content Detection
```bash
# External resource scanning
grep -r "cdn\." src/
grep -r "googleapis" src/
grep -r "http://" src/ | grep -v localhost
grep -r "https://" src/ | grep -v localhost

# Analytics detection
grep -r "google-analytics" src/
grep -r "gtag" src/
grep -r "analytics" src/
```

### Size Monitoring
```bash
# ZIP size check
zip -r game.zip dist/
ls -la game.zip | awk '{print $5 " bytes (" $5/1024 " KB)"}'

# Size limit validation
if [ $(stat -c%s "game.zip") -le 13312 ]; then
  echo "✅ Size OK"
else
  echo "❌ Exceeds 13KB limit"
fi
```

## Compliance Report

### ✅ Passed Checks
- Package size within limit
- No external dependencies
- Offline functionality confirmed
- Valid HTML structure
- Cross-browser compatibility

### ⚠️ Warnings
- Size approaching limit (>90% used)
- Performance concerns on mobile
- Minor compatibility issues

### ❌ Failed Checks  
- Size limit exceeded
- External resources detected
- Offline functionality broken
- Invalid package format

## Submission Readiness

### Pre-submission Checklist
- [ ] ZIP file ≤ 13,312 bytes
- [ ] Contains index.html
- [ ] Works offline
- [ ] No external dependencies
- [ ] Cross-browser tested
- [ ] Mobile compatible
- [ ] Performance acceptable

I\'ll provide a comprehensive compliance report with specific action items for any issues found.
