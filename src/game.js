// --- DOM Elements ---
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const highScoreEl = document.getElementById('highScore');
const comboEl = document.getElementById('combo');
const levelEl = document.getElementById('level');
const eventStatusEl = document.getElementById('eventStatus');

// Menu screens
const mainMenu = document.getElementById('mainMenu');
const playMenu = document.getElementById('playMenu');
const tutorialScreen = document.getElementById('tutorialScreen');
const achievementsScreen = document.getElementById('achievementsScreen');
const statsScreen = document.getElementById('statsScreen');
const settingsScreen = document.getElementById('settingsScreen');
const gameOverScreen = document.getElementById('gameOver');

// Legacy elements (will be updated)
const startScreen = mainMenu; // Backward compatibility
const startButton = document.getElementById('endlessButton');
const resetButton = document.getElementById('playAgainButton');
const finalScoreEl = document.getElementById('finalScore');
const finalLevelEl = document.getElementById('finalLevel');
const finalComboEl = document.getElementById('finalCombo');
const finalHighScoreEl = document.getElementById('finalHighScore');

// --- Canvas and Game State ---
canvas.width = 400;
canvas.height = 600;

let gameStarted = false;
let currentGameMode = 'endless'; // endless, story, challenge
let currentMenu = 'main'; // main, play, tutorial, achievements, stats, settings, gameOver
let score = 0;
let lives = 9;
// JS13K namespaced storage
const STORAGE_PREFIX = 'shadowPaws2025_';
const getStorage = (key) => localStorage.getItem(STORAGE_PREFIX + key);
const setStorage = (key, val) => localStorage.setItem(STORAGE_PREFIX + key, val);

let highScore = getStorage('high') || 0;
let invincible = false;
let invincibleTimer = 0;
let combo = 0;
let comboTimer = 0;
let maxCombo = 0;
let level = 1;
let itemsCollected = 0;
let speedMultiplier = 1;
let frameCount = 0;
let countdownInterval;

// Power-ups
let activePowerUps = [];
let powerUpCooldowns = { pounce: 0, nightVision: 0, nineLives: 0 };

// Special events
let fridayThe13thMode = false;
let fridayThe13thTimer = 0;
let fullMoonEvent = false;
let fullMoonTimer = 0;

// Audio context
let audioCtx;
let audioEnabled = true;

// Competitive features
let achievements = getStorage('achievements') ? JSON.parse(getStorage('achievements')) : {};
let totalItemsCollected = parseInt(getStorage('totalItems')) || 0;
let totalGamesPlayed = parseInt(getStorage('totalGames')) || 0;
let longestStreak = parseInt(getStorage('longestStreak')) || 0;
let currentStreak = 0;

// --- Game Objects ---
const cat = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  size: 30,
  speed: 8,
  vx: 0,
  vy: 0,
  targetX: canvas.width / 2,
  targetY: canvas.height - 100,
  tail: [],

  eyeBlink: 0,
  emotion: 'neutral', // happy, scared, focused
  purring: false
};

let items = [];
let particles = [];
let stars = [];
let pawPrints = [];
let lightningFlashes = [];
let magicSparkles = [];

const itemTypes = {
  fish: { emoji: '🐟', points: 10, good: true, size: 25 },
  star: { emoji: '⭐', points: 20, good: true, size: 25 },
  moon: { emoji: '🌙', points: 30, good: true, size: 25 },
  mirror: { emoji: '🪞', points: -1, good: false, size: 30 },
  ladder: { emoji: '🪜', points: -1, good: false, size: 35 },
  salt: { emoji: '🧂', points: -1, good: false, size: 25 },
  clover: { emoji: '🍀', points: 50, good: true, special: true, size: 25 },
  paw: { emoji: '🐾', points: 15, good: true, powerUp: 'pounce', size: 25 },
  eye: { emoji: '👁️', points: 15, good: true, powerUp: 'nightVision', size: 25 },
  heart: { emoji: '💜', points: 15, good: true, powerUp: 'nineLives', size: 25 }
};

const powerUps = {
  pounce: { duration: 180, cooldown: 600 },
  nightVision: { duration: 300, cooldown: 900 },
  nineLives: { duration: 1, cooldown: 1200 }
};

const achievementList = {
  firstSteps: { name: 'First Steps', desc: 'Collect your first item', icon: '👶' },
  combo5: { name: 'Combo Cat', desc: 'Achieve a 5x combo', icon: '🔥' },
  combo25: { name: 'Combo Master', desc: 'Achieve a 25x combo', icon: '⚡' },
  combo50: { name: 'Combo Legend', desc: 'Achieve a 50x combo', icon: '🏆' },
  level10: { name: 'Persistent Cat', desc: 'Reach level 10', icon: '🎯' },
  survivor: { name: 'Nine Lives', desc: 'Survive with only 1 life', icon: '💖' },
  collector: { name: 'Item Hoarder', desc: 'Collect 1000 total items', icon: '📦' },
  veteran: { name: 'Veteran Player', desc: 'Play 100 games', icon: '🎮' },
  streaker: { name: 'Lucky Cat', desc: 'Get a 10 good item streak', icon: '🍀' },
  perfectionist: { name: 'Perfectionist', desc: 'Complete level without taking damage', icon: '✨' }
};

// --- Enhanced Input Handling ---
const keys = {};
let touching = false;
let keyboardMode = false;
let mousePos = { x: canvas.width / 2, y: canvas.height - 100 };

// Advanced keyboard controls
document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  keys[key] = true;
  keyboardMode = true;
  
  // Menu navigation shortcuts
  if (!gameStarted) {
    if (key === 'escape' && currentMenu !== 'main') {
      showMenu('main');
      e.preventDefault();
      return;
    }
  } else {
    // In-game controls
    // Prevent default for game keys
    if (['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','shift'].includes(key)) {
      e.preventDefault();
    }
    
    // Power-up activation hotkeys
    if (key === '1' || key === 'q') activatePowerUp('pounce');
    if (key === '2' || key === 'e') activatePowerUp('nightVision');
    if (key === '3' || key === 'r') activatePowerUp('nineLives');
    

  }
});

document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

const handlePointerDown = (e) => {
    e.preventDefault();
    touching = true;
    updateTarget(e);
};

const handlePointerMove = (e) => {
    e.preventDefault();
    if (!touching) return;
    updateTarget(e);
};

const handlePointerUp = (e) => {
    e.preventDefault();
    touching = false;
};

const updateTarget = (e) => {
    keyboardMode = false;
    const touch = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    const newX = (touch.clientX - rect.left) * (canvas.width / rect.width);
    const newY = (touch.clientY - rect.top) * (canvas.height / rect.height);
    
    mousePos.x = newX;
    mousePos.y = newY;
    
    if (!keyboardMode) {
        cat.targetX = newX;
        cat.targetY = newY;
    }
};

// Mouse hover tracking for desktop
const handleMouseMove = (e) => {
    if (!touching) updateTarget(e);
};

canvas.addEventListener('touchstart', handlePointerDown);
canvas.addEventListener('touchmove', handlePointerMove);
canvas.addEventListener('touchend', handlePointerUp);
canvas.addEventListener('mousedown', handlePointerDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handlePointerUp);
canvas.addEventListener('mouseleave', handlePointerUp);

// --- Audio System ---
function initAudio() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {
    audioEnabled = false;
  }
}

function playTone(freq, duration, volume = 0.1) {
  if (!audioEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playPurr() {
  if (!audioEnabled) return;
  for (let i = 0; i < 3; i++) {
    setTimeout(() => playTone(50 + Math.random() * 20, 0.3, 0.05), i * 100);
  }
}

// --- Power-up System ---
function updatePowerUps() {
  for (let i = activePowerUps.length - 1; i >= 0; i--) {
    const powerUp = activePowerUps[i];
    powerUp.timer--;
    if (powerUp.timer <= 0) {
      activePowerUps.splice(i, 1);
    }
  }
  
  // Update cooldowns
  Object.keys(powerUpCooldowns).forEach(key => {
    if (powerUpCooldowns[key] > 0) powerUpCooldowns[key]--;
  });
}

function activatePowerUp(type) {
  if (powerUpCooldowns[type] > 0) return;
  
  const config = powerUps[type];
  activePowerUps.push({ type, timer: config.duration });
  powerUpCooldowns[type] = config.cooldown;
  
  if (type === 'nineLives' && lives < 9) {
    lives++;
    createParticle(cat.x, cat.y, '#ff69b4', 15);
  }
  
  playTone(type === 'pounce' ? 200 : type === 'nightVision' ? 400 : 600, 0.2);
}

function hasPowerUp(type) {
  return activePowerUps.some(p => p.type === type);
}

// --- Achievement System ---
function unlockAchievement(key) {
  if (achievements[key]) return;
  
  achievements[key] = true;
  setStorage('achievements', JSON.stringify(achievements));
  
  const ach = achievementList[key];
  showAchievementNotification(ach.icon, ach.name, ach.desc);
  
  // Achievement sound
  playTone(800, 0.3, 0.15);
  setTimeout(() => playTone(1000, 0.3, 0.1), 150);
}

function showAchievementNotification(icon, name, desc) {
  // Create floating achievement notification
  for (let i = 0; i < 20; i++) {
    createMagicSparkle(canvas.width - 100, 50);
  }
  createLightningFlash();
}

function checkAchievements() {
  // Check various achievement conditions
  if (totalItemsCollected >= 1 && !achievements.firstSteps) unlockAchievement('firstSteps');
  if (combo >= 5 && !achievements.combo5) unlockAchievement('combo5');
  if (combo >= 25 && !achievements.combo25) unlockAchievement('combo25');
  if (combo >= 50 && !achievements.combo50) unlockAchievement('combo50');
  if (level >= 10 && !achievements.level10) unlockAchievement('level10');
  if (lives === 1 && level > 3 && !achievements.survivor) unlockAchievement('survivor');
  if (totalItemsCollected >= 1000 && !achievements.collector) unlockAchievement('collector');
  if (totalGamesPlayed >= 100 && !achievements.veteran) unlockAchievement('veteran');
  if (currentStreak >= 10 && !achievements.streaker) unlockAchievement('streaker');
}

// --- Special Events ---
function updateSpecialEvents() {
  // Friday the 13th Mode
  if (fridayThe13thMode && --fridayThe13thTimer <= 0) {
    fridayThe13thMode = false;
  }
  
  // Full Moon Event
  if (fullMoonEvent && --fullMoonTimer <= 0) {
    fullMoonEvent = false;
  }
  
  // Random event triggers
  if (Math.random() < 0.0005) { // ~30 second average
    if (!fridayThe13thMode && Math.random() < 0.3) {
      fridayThe13thMode = true;
      fridayThe13thTimer = 600; // 10 seconds
      createLevelUpEffect();
      playTone(100, 1, 0.15);
    } else if (!fullMoonEvent && Math.random() < 0.2) {
      fullMoonEvent = true;
      fullMoonTimer = 900; // 15 seconds
      createLevelUpEffect();
      playTone(300, 1, 0.1);
    }
  }
}

// --- Adorable Cat Drawing --- I SUCK AT THIS -- GEMINI TY FOR SAVING ME
function drawCat() {
  let bodyColor = invincible ? '#9333ea' : '#2a2a2a'; // Purple when invincible, else dark grey
  if (hasPowerUp('pounce')) bodyColor = '#ff6b6b';
  if (hasPowerUp('nightVision')) bodyColor = '#5fd3d3';
  if (hasPowerUp('nineLives')) bodyColor = '#6bc5e8';

  // --- Drawing ---
  // We use save() and restore() to isolate transformations and styles,
  // preventing them from affecting other elements drawn on the canvas.
  ctx.save();

  // Center the coordinate system on the cat's position.
  // This makes drawing much simpler as all coordinates are relative to the cat's center.
  ctx.translate(cat.x, cat.y);

  // --- 1. Tail ---
  // The tail sways gently using a sine wave for a lively animation.
  const tailSway = Math.sin(Date.now() * 0.008) * 5;
  ctx.strokeStyle = bodyColor;
  ctx.lineWidth = cat.size * 0.15; // A nice, thick tail
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cat.size * 0.4, cat.size * 0.1); // Start tail from the back of the body
  // A quadratic curve creates a simple, elegant 'S' shape.
  ctx.quadraticCurveTo(
    cat.size * 0.8, cat.size * 0.4 + tailSway,
    cat.size * 0.6, cat.size * 0.9
  );
  ctx.stroke();

  // --- 2. Body ---
  // A chubby ellipse for a cute, rounded body shape.
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, cat.size * 0.6, cat.size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // --- 3. Head ---
  // A large, circular head for that classic "cute" look.
  ctx.beginPath();
  ctx.arc(0, -cat.size * 0.4, cat.size * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // --- 4. Ears ---
  // The ears are drawn as filled, curved shapes integrated into the head.
  // Left Ear
  ctx.beginPath();
  ctx.moveTo(-cat.size * 0.15, -cat.size * 0.8);
  ctx.quadraticCurveTo(-cat.size * 0.3, -cat.size * 1.1, -cat.size * 0.45, -cat.size * 0.7);
  ctx.closePath();
  ctx.fill();

  // Right Ear
  ctx.beginPath();
  ctx.moveTo(cat.size * 0.15, -cat.size * 0.8);
  ctx.quadraticCurveTo(cat.size * 0.3, -cat.size * 1.1, cat.size * 0.45, -cat.size * 0.7);
  ctx.closePath();
  ctx.fill();


  // --- 5. Face Details ---
  const faceY = -cat.size * 0.45; // Vertical position for all face elements

  // Eye Blinking Logic (from original code, slightly adjusted)
  cat.eyeBlink = Math.max(0, cat.eyeBlink - 1);
  if (Math.random() < 0.002) cat.eyeBlink = 6; // A slightly longer blink feels more natural

  if (cat.eyeBlink === 0) {
    // Open Eyes
    ctx.fillStyle = '#fff';
    const eyeX = cat.size * 0.18;
    const eyeRadius = cat.size * 0.09;
    ctx.beginPath();
    ctx.arc(-eyeX, faceY, eyeRadius, 0, Math.PI * 2); // Left eye
    ctx.arc(eyeX, faceY, eyeRadius, 0, Math.PI * 2); // Right eye
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    const pupilRadius = cat.size * 0.05;
    ctx.beginPath();
    ctx.arc(-eyeX, faceY, pupilRadius, 0, Math.PI * 2); // Left pupil
    ctx.arc(eyeX, faceY, pupilRadius, 0, Math.PI * 2); // Right pupil
    ctx.fill();

  } else {
    // Blinking Eyes (a simple curved line)
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = cat.size * 0.05;
    ctx.lineCap = 'round';
    const eyeX = cat.size * 0.18;
    const eyeWidth = cat.size * 0.1;

    ctx.beginPath();
    ctx.moveTo(-eyeX - eyeWidth / 2, faceY);
    ctx.lineTo(-eyeX + eyeWidth / 2, faceY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(eyeX - eyeWidth / 2, faceY);
    ctx.lineTo(eyeX + eyeWidth / 2, faceY);
    ctx.stroke();
  }

  // Nose
  ctx.fillStyle = '#ff91a4'; // Cute pink nose
  ctx.beginPath();
  const noseY = faceY + cat.size * 0.1;
  ctx.moveTo(0, noseY - cat.size * 0.02);
  ctx.lineTo(-cat.size * 0.04, noseY + cat.size * 0.03);
  ctx.lineTo(cat.size * 0.04, noseY + cat.size * 0.03);
  ctx.closePath();
  ctx.fill();

  // Restore the canvas state to what it was before we started drawing the cat.
  // This removes the translation we applied at the beginning.
  ctx.restore();


  // --- 6. Invincibility Aura (drawn last, in original coordinate space) ---
  if (invincible) {
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 3;
    // Use a sine wave to make the aura pulse gently.
    ctx.globalAlpha = Math.sin(Date.now() * 0.008) * 0.4 + 0.3;
    ctx.beginPath();
    // The arc is positioned to encircle the entire cat sprite.
    ctx.arc(cat.x, cat.y - cat.size * 0.2, cat.size * 1.1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1; // Reset alpha for other drawings
  }
}


function drawItems() {
  ctx.font = '25px serif';
  items.forEach(item => {
    ctx.save();
    ctx.translate(item.x, item.y);
    ctx.rotate(item.rotation);
    
    // Special event effects
    if (fullMoonEvent) {
      const glow = Math.sin(Date.now() * 0.02) * 0.3 + 1;
      ctx.scale(glow, glow);
    }
    
    if (item.special || item.powerUp) {
      const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 1;
      ctx.scale(pulse, pulse);
    }
    
    // Night Vision effect - show items earlier
    const alpha = hasPowerUp('nightVision') && item.y < 100 ? 0.5 : 1;
    ctx.globalAlpha = alpha;
    
    ctx.shadowBlur = 10;
    let shadowColor = item.good ? (item.special || item.powerUp ? '#9333ea' : '#0f0') : '#f00';
    if (fridayThe13thMode) shadowColor = item.good ? '#ff0' : '#ff6600';
    if (fullMoonEvent) shadowColor = '#ffffff';
    
    ctx.shadowColor = shadowColor;
    ctx.fillText(item.emoji, -item.size / 2, item.size / 2);
    ctx.restore();
  });
  ctx.shadowBlur = 0;
}

function drawParticles() {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 50;
    const size = p.size || 4;
    
    // Enhanced particle rendering with glow effect
    if (p.life > 20) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
    }
    
    ctx.beginPath();
    ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;
}

function updateMagicSparkles() {
  for (let i = magicSparkles.length - 1; i >= 0; i--) {
    const s = magicSparkles[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vx *= 0.99;
    s.vy *= 0.99;
    s.life--;
    if (s.life <= 0) magicSparkles.splice(i, 1);
  }
}

function drawMagicSparkles() {
  magicSparkles.forEach(s => {
    const alpha = s.life / s.maxLife;
    ctx.globalAlpha = alpha;
    
    // Sparkle effect with multiple points
    ctx.fillStyle = s.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = s.color;
    
    for (let j = 0; j < 4; j++) {
      const angle = (j / 4) * Math.PI * 2 + Date.now() * 0.01;
      const sparkleX = s.x + Math.cos(angle) * s.size;
      const sparkleY = s.y + Math.sin(angle) * s.size;
      
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
  });
  ctx.globalAlpha = 1;
}

function updateLightning() {
  for (let i = lightningFlashes.length - 1; i >= 0; i--) {
    lightningFlashes[i].life--;
    if (lightningFlashes[i].life <= 0) {
      lightningFlashes.splice(i, 1);
    }
  }
}

function drawLightning() {
  if (lightningFlashes.length > 0) {
    const flash = lightningFlashes[0];
    ctx.fillStyle = `rgba(255, 255, 255, ${flash.intensity})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function updatePawPrints() {
  for (let i = pawPrints.length - 1; i >= 0; i--) {
    const paw = pawPrints[i];
    paw.life--;
    paw.alpha = paw.life / 60;
    if (paw.life <= 0) pawPrints.splice(i, 1);
  }
}

function drawPawPrints() {
  pawPrints.forEach(paw => {
    ctx.globalAlpha = paw.alpha * 0.4;
    ctx.fillStyle = hasPowerUp('pounce') ? '#ff6b6b' : '#333';
    ctx.font = `${paw.size || 12}px serif`;
    ctx.fillText('🐾', paw.x - (paw.size || 12) / 2, paw.y + 4);
  });
  ctx.globalAlpha = 1;
}

function drawStars() {
  // Enhanced starfield with color variations
  stars.forEach(star => {
    star.y += star.speed * speedMultiplier;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
    
    // Color based on special events
    let color = '#fff';
    if (fridayThe13thMode) color = '#ffaa00';
    if (fullMoonEvent) color = '#aaeeff';
    
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.random() * 0.5 + 0.5;
    
    // Add twinkle effect
    const twinkle = Math.sin(Date.now() * 0.005 + star.x) * 0.5 + 1;
    const size = star.size * twinkle;
    ctx.fillRect(star.x - size/2, star.y - size/2, size, size);
  });
  ctx.globalAlpha = 1;
}

// --- Update Functions ---
function updateCat() {
  let moveSpeed = cat.speed * (1 + level * 0.1);

  
  // Pounce power-up increases speed
  if (hasPowerUp('pounce')) {
    moveSpeed *= 1.8;
    cat.emotion = 'focused';
  }
  
  // Enhanced keyboard controls
  if (keyboardMode) {
    if (keys['arrowleft'] || keys['a']) {
      cat.targetX -= moveSpeed;
      cat.vx = Math.min(cat.vx - 1, -moveSpeed * 0.3);
    }
    if (keys['arrowright'] || keys['d']) {
      cat.targetX += moveSpeed;
      cat.vx = Math.max(cat.vx + 1, moveSpeed * 0.3);
    }
    if (keys['arrowup'] || keys['w']) {
      cat.targetY -= moveSpeed;
      cat.vy = Math.min(cat.vy - 1, -moveSpeed * 0.3);
    }
    if (keys['arrowdown'] || keys['s']) {
      cat.targetY += moveSpeed;
      cat.vy = Math.max(cat.vy + 1, moveSpeed * 0.3);
    }
  }

  const oldX = cat.x, oldY = cat.y;
  
  // Smooth interpolation for mouse/touch, direct movement for keyboard
  if (keyboardMode) {
    cat.x += cat.vx * 0.8;
    cat.y += cat.vy * 0.8;
    cat.vx *= 0.85; // Friction
    cat.vy *= 0.85;
  } else {
    cat.vx = (cat.targetX - cat.x) * 0.25;
    cat.vy = (cat.targetY - cat.y) * 0.25;
    cat.x += cat.vx;
    cat.y += cat.vy;
  }
  
  // Enhanced paw prints
  const dist = Math.sqrt((cat.x - oldX) ** 2 + (cat.y - oldY) ** 2);
  if (dist > 2 && Math.random() < 0.3) {
    pawPrints.push({
      x: oldX,
      y: oldY,
      life: 60,
      alpha: 0.8,
      size: 12
    });
  }

  cat.x = Math.max(cat.size, Math.min(canvas.width - cat.size, cat.x));
  cat.y = Math.max(cat.size, Math.min(canvas.height - cat.size, cat.y));
  cat.targetX = Math.max(cat.size, Math.min(canvas.width - cat.size, cat.targetX));
  cat.targetY = Math.max(cat.size, Math.min(canvas.height - cat.size, cat.targetY));

  if (invincible && --invincibleTimer <= 0) invincible = false;
  if (comboTimer > 0 && --comboTimer === 0) {
    combo = 0;
    updateUI();
  }
}

function updateItems() {
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    item.y += item.speed * speedMultiplier;
    item.rotation += 0.08;
    item.wobble += item.wobbleSpeed;
    item.x += Math.sin(item.wobble) * 0.5;

    const dx = cat.x - item.x;
    const dy = cat.y - item.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < cat.size / 2 + item.size / 2) {
      handleCollision(item);
      items.splice(i, 1);
      updateUI();
    } else if (item.y > canvas.height + 30) {
      items.splice(i, 1);
    }
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity || 0.3;
    p.vx *= 0.98; // Air resistance
    if (--p.life <= 0) particles.splice(i, 1);
  }
}

// --- Game Logic ---
function handleCollision(item) {
    if (item.good) {
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        comboTimer = 120; // 2 seconds

        let multiplier = 1 + Math.floor(combo / 5);
        if (fullMoonEvent) multiplier *= 2; // Double points during full moon
        if (fridayThe13thMode) multiplier *= 1.5; // 1.5x during Friday the 13th
        
        score += item.points * multiplier;
        createParticle(item.x, item.y, combo > 5 ? '#ff0' : '#0f0', Math.min(combo, 5));

        // Enhanced visual feedback
        if (combo > 15) {
            playTone(880, 0.15, 0.08); // Clean high chime
            for (let i = 0; i < 8; i++) createMagicSparkle(item.x, item.y);
        } else if (combo > 5) {
            for (let i = 0; i < 3; i++) createMagicSparkle(item.x, item.y);
        }

        // Power-up activation
        if (item.powerUp) {
            activatePowerUp(item.powerUp);
            for (let i = 0; i < 10; i++) createMagicSparkle(item.x, item.y);
            createLightningFlash();
        }
        
        // Special effects and emotions
        if (combo > 10) {
            playPurr();
            cat.emotion = 'happy';
            cat.purring = true;
        } else if (combo > 5) {
            cat.emotion = 'happy';
        } else {
            cat.emotion = 'neutral';
        }

        itemsCollected++;
        totalItemsCollected++;
        currentStreak++;
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
            setStorage('longestStreak', longestStreak);
        }
        
        if (itemsCollected > 0 && itemsCollected % 12 === 0) {
            level++;
            speedMultiplier = 1 + (level - 1) * 0.1;
            createLevelUpEffect();
            
            // Check story mode progression
            checkStoryProgress();
            
            // Validate challenge rules
            validateChallengeRules();
            if (level % 3 === 0 && lives < 9) {
                lives++;
                createParticle(cat.x, cat.y, '#ff69b4', 20);
            }
        }
        
        // Store progress
        setStorage('totalItems', totalItemsCollected);
        checkAchievements();

        if (item.special) {
            invincible = true;
            invincibleTimer = 300; // 5 seconds
            combo += 5;
        }
    } else {
        // Pounce power-up lets you pass through bad items
        if (hasPowerUp('pounce')) {
            createParticle(item.x, item.y, '#ff6b6b', 8);
            score += 5;
            return;
        }
        
        if (!invincible) {
            lives--;
            combo = 0;
            comboTimer = 0;
            currentStreak = 0; // Reset streak on bad item
            
            // Scared emotion
            cat.emotion = 'scared';
            cat.purring = false;
            setTimeout(() => cat.emotion = 'neutral', 2000);

            const shakeIntensity = Math.min(5 + level, 15);
            canvas.style.transform = `translateX(${shakeIntensity}px)`;
            setTimeout(() => canvas.style.transform = `translateX(-${shakeIntensity}px)`, 50);
            setTimeout(() => canvas.style.transform = 'translateX(0)', 100);

            createParticle(item.x, item.y, '#f00', 20);
            playTone(150, 0.5, 0.2); // Error sound

            if (lives <= 0) endGame();
        } else {
            createParticle(item.x, item.y, '#9333ea', 8);
            score += 5;
        }
    }
}

function spawnItem() {
  let goodChance = Math.max(0.3, 0.7 - level * 0.02);
  
  // Friday the 13th mode: mostly bad items
  if (fridayThe13thMode) goodChance = 0.2;
  
  const isGood = Math.random() < goodChance;
  let type;

  if (isGood) {
    const goodItems = ['fish', 'star', 'moon'];
    const powerUpItems = ['paw', 'eye', 'heart'];
    
    // Special item chances
    if (Math.random() < (0.04 + (combo > 10 ? 0.02 : 0))) {
      type = 'clover'; // Lucky clover
    } else if (Math.random() < 0.08 && level > 2) {
      type = powerUpItems[Math.floor(Math.random() * powerUpItems.length)]; // Power-ups
    } else {
      type = goodItems[Math.floor(Math.random() * goodItems.length)];
    }
  } else {
    const badItems = ['mirror', 'ladder', 'salt'];
    type = badItems[Math.floor(Math.random() * badItems.length)];
  }

  const baseSpeed = 2.5 + level * 0.25;
  items.push({
    type: type,
    x: Math.random() * (canvas.width - 40) + 20,
    y: -30,
    speed: baseSpeed + Math.random() * 1.5,
    rotation: 0,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.1 + 0.05,
    ...itemTypes[type]
  });
}

function createParticle(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 30 + Math.random() * 20, 
      color,
      size: 2 + Math.random() * 3,
      gravity: Math.random() * 0.1
    });
  }
}

// Enhanced particle effects
function createMagicSparkle(x, y) {
  magicSparkles.push({
    x, y,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 4,
    life: 80 + Math.random() * 40,
    maxLife: 120,
    color: ['#ff69b4', '#9333ea', '#00ffff', '#ffd700'][Math.floor(Math.random() * 4)],
    size: 1 + Math.random() * 2
  });
}

function createLightningFlash() {
  lightningFlashes.push({
    life: 8,
    intensity: Math.random() * 0.3 + 0.2
  });
}

function createLevelUpEffect() {
    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        particles.push({
            x: cat.x, y: cat.y,
            vx: Math.cos(angle) * (Math.random() * 5 + 2),
            vy: Math.sin(angle) * (Math.random() * 5 + 2),
            life: 60, color: '#9333ea'
        });
    }
}

// --- UI and State Management ---
function updateUI() {
  scoreEl.textContent = score;
  livesEl.textContent = lives;
  highScoreEl.textContent = highScore;
  comboEl.textContent = combo;
  levelEl.textContent = level;

  // Update event status
  let statusText = '';
  if (fridayThe13thMode) statusText += '🚫 Friday 13th Mode! ';
  if (fullMoonEvent) statusText += '🌕 Full Moon! ';
  if (activePowerUps.length > 0) {
    const powers = activePowerUps.map(p => 
      p.type === 'pounce' ? '🐾' : 
      p.type === 'nightVision' ? '👁️' : '💜'
    ).join(' ');
    statusText += powers;
  }
  eventStatusEl.textContent = statusText;

  if (combo > 5) {
    comboEl.style.color = '#ff0';
    comboEl.style.transform = `scale(${1 + Math.min(combo / 50, 0.5)})`;
  } else if (combo > 0) {
    comboEl.style.color = '#0f0';
    comboEl.style.transform = 'scale(1)';
  } else {
    comboEl.style.color = '#fff';
    comboEl.style.transform = 'scale(1)';
  }
}

function startGame() {
  if (gameStarted) return;
  clearInterval(countdownInterval);
  
  // Hide all menus and start game
  showMenu('');
  
  // Track game start time for survival statistics
  setStorage('gameStartTime', Date.now());
  
  gameStarted = true;
  gameLoop();
}

function endGame() {
  console.log('Game Over! Lives:', lives, 'Score:', score);
  gameStarted = false;
  totalGamesPlayed++;
  setStorage('totalGames', totalGamesPlayed);
  
  if (score > highScore) {
    highScore = score;
    setStorage('high', highScore);
  }
  
  // Store best combo
  const currentBestCombo = parseInt(getStorage('bestCombo')) || 0;
  if (maxCombo > currentBestCombo) {
    setStorage('bestCombo', maxCombo);
  }
  
  // Update total survival time
  const survivalTime = Math.floor((Date.now() - (getStorage('gameStartTime') || Date.now())) / 1000);
  const totalTime = parseInt(getStorage('totalTime')) || 0;
  setStorage('totalTime', totalTime + survivalTime);
  
  // Prepare game end statistics for achievement checking
  const gameEndStats = {
    score,
    level,
    maxCombo,
    lives,
    itemsCollected,
    mode: currentGameMode
  };
  
  // Final achievement check with new system
  checkNewAchievements(gameEndStats);
  
  finalScoreEl.textContent = score;
  finalLevelEl.textContent = level;
  finalComboEl.textContent = maxCombo;
  finalHighScoreEl.textContent = highScore;
  
  // Show game over screen using new menu system
  console.log('Calling showMenu with gameOver');
  showMenu('gameOver');
}

function resetGame() {
  score = 0;
  lives = 9;
  items = [];
  particles = [];
  invincible = false;
  invincibleTimer = 0;
  combo = 0;
  comboTimer = 0;
  maxCombo = 0;
  level = 1;
  itemsCollected = 0;
  speedMultiplier = 1;
  frameCount = 0;
  
  // Reset new features
  activePowerUps = [];
  powerUpCooldowns = { pounce: 0, nightVision: 0, nineLives: 0 };
  fridayThe13thMode = false;
  fridayThe13thTimer = 0;
  fullMoonEvent = false;
  fullMoonTimer = 0;
  pawPrints = [];
  lightningFlashes = [];
  magicSparkles = [];
  currentStreak = 0;
  
  cat.x = canvas.width / 2;
  cat.y = canvas.height - 100;
  cat.targetX = cat.x;
  cat.targetY = cat.y;
  cat.tail = [];

  updateUI();
  gameOverScreen.style.display = 'none';

  if (gameStarted) return;
  gameStarted = true;
  gameLoop();
}

// --- Main Game Loop ---
function gameLoop() {
  if (!gameStarted) return;

  // Clear canvas with trail effect (special events can change background)
  let fadeAlpha = 0.25 + Math.min(level * 0.02, 0.15);
  let bgColor = '15, 15, 30';
  
  if (fridayThe13thMode) {
    bgColor = '30, 10, 10'; // Reddish tint
    fadeAlpha = 0.3;
  } else if (fullMoonEvent) {
    bgColor = '20, 20, 35'; // Bluish tint
    fadeAlpha = 0.2;
  }
  
  ctx.fillStyle = `rgba(${bgColor}, ${fadeAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update systems
  updateSpecialEvents();
  updatePowerUps();
  updateMagicSparkles();
  updateLightning();

  // Draw elements (layered for depth)
  drawLightning(); // Screen flash effects first
  drawStars();
  updatePawPrints();
  drawPawPrints();
  drawMagicSparkles(); // Magic sparkles in background
  updateCat();
  drawCat();
  updateItems();
  drawItems();
  updateParticles();
  drawParticles();

  // Spawning logic
  frameCount++;
  const spawnRate = Math.max(25 - level * 2, 6);
  if (frameCount % Math.floor(spawnRate) === 0) {
    spawnItem();
    if (level > 2 && Math.random() < (0.2 + level * 0.05)) setTimeout(spawnItem, 100);
    if (level > 5 && Math.random() < (level * 0.02)) setTimeout(spawnItem, 200);
  }

  // Bonus spawn for high combos
  if (combo > 0 && combo % 10 === 0 && comboTimer > 118) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const bonusItem = {...itemTypes['star'], type: 'star', x: Math.random() * (canvas.width - 40) + 20, y: -30 - (i * 40), speed: 4 + level * 0.3, rotation: 0, wobble: Math.random() * Math.PI * 2, wobbleSpeed: 0.1 };
            items.push(bonusItem);
        }, i * 150);
    }
  }

  requestAnimationFrame(gameLoop);
}

// === COMPREHENSIVE MENU SYSTEM ===

// Menu State Management
function showMenu(menuName) {
    console.log('showMenu called with:', menuName);
    // Hide all menus
    [mainMenu, playMenu, tutorialScreen, achievementsScreen, statsScreen, settingsScreen, gameOverScreen].forEach(menu => {
        if (menu) {
            menu.classList.add('hidden');
            menu.classList.remove('show');
            // Clear any inline display that might have been set previously
            menu.style.display = '';
        }
    });
    
    // Show target menu
    let targetMenu;
    switch(menuName) {
        case 'main': targetMenu = mainMenu; break;
        case 'play': targetMenu = playMenu; break;
        case 'tutorial': targetMenu = tutorialScreen; break;
        case 'achievements': targetMenu = achievementsScreen; break;
        case 'stats': targetMenu = statsScreen; break;
        case 'settings': targetMenu = settingsScreen; break;
        case 'gameOver': targetMenu = gameOverScreen; break;
    }
    
    if (targetMenu) {
        targetMenu.classList.remove('hidden');
        targetMenu.classList.add('show');
        // Ensure game over becomes visible even if previously set to display:none
        if (menuName === 'gameOver') {
            targetMenu.style.display = 'block';
        }
        currentMenu = menuName;
    }
}

// Tutorial System
let currentTutorialStep = 1;

function initTutorial() {
    const steps = document.querySelectorAll('.tutorial-step');
    const prevBtn = document.getElementById('tutPrevButton');
    const nextBtn = document.getElementById('tutNextButton');
    const progressEl = document.getElementById('tutorialProgress');
    
    function updateTutorialStep() {
        steps.forEach((step, i) => {
            step.classList.toggle('active', i === currentTutorialStep - 1);
        });
        progressEl.textContent = `${currentTutorialStep}/${steps.length}`;
        prevBtn.style.opacity = currentTutorialStep === 1 ? '0.5' : '1';
        nextBtn.style.opacity = currentTutorialStep === steps.length ? '0.5' : '1';
    }
    
    prevBtn.onclick = () => {
        if (currentTutorialStep > 1) {
            currentTutorialStep--;
            updateTutorialStep();
        }
    };
    
    nextBtn.onclick = () => {
        if (currentTutorialStep < steps.length) {
            currentTutorialStep++;
            updateTutorialStep();
        }
    };
    
    updateTutorialStep();
}


// Achievements System
function updateAchievements() {
    const grid = document.getElementById('achievementsList');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    Object.keys(achievementList).forEach(key => {
        const achievement = achievementList[key];
        const card = document.createElement('div');
        card.className = `achievement-card ${achievements[key] ? 'unlocked' : ''}`;
        
        card.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
            <div class="achievement-desc">${achievement.desc}</div>
        `;
        
        grid.appendChild(card);
    });
}

// Stats System
function updateStatsDisplay() {
    const statElements = {
        statGamesPlayed: totalGamesPlayed,
        statHighScore: highScore,
        statTotalItems: totalItemsCollected,
        statBestCombo: getStorage('bestCombo') || 0,
        statLongestStreak: longestStreak,
        statSurvivalTime: formatTime(parseInt(getStorage('totalTime')) || 0),
        statAchievements: `${Object.keys(achievements).length}/${Object.keys(achievementList).length}`
    };
    
    Object.entries(statElements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

// Settings System
function initSettings() {
    // Load saved settings
    audioEnabled = getStorage('audio') !== 'false'; // Default to true
    
    // Sound toggle
    const soundToggle = document.getElementById('soundToggle');
    if (soundToggle) {
        soundToggle.checked = audioEnabled;
        soundToggle.onchange = () => {
            audioEnabled = soundToggle.checked;
            setStorage('audio', audioEnabled);
        };
    }
    
}

// Game Mode System
const storyLevels = [
    { theme: 'Midnight Walk', badLuckMultiplier: 1, goodLuckMultiplier: 1, special: 'normal' },
    { theme: 'Friday 13th', badLuckMultiplier: 2, goodLuckMultiplier: 0.5, special: 'friday13th' },
    { theme: 'Full Moon', badLuckMultiplier: 0.5, goodLuckMultiplier: 2, special: 'fullMoon' },
    { theme: 'Black Cat Crossing', badLuckMultiplier: 1.5, goodLuckMultiplier: 1.5, special: 'crossroads' },
    { theme: 'Superstition City', badLuckMultiplier: 2, goodLuckMultiplier: 1, special: 'cityscape' }
];

const dailyChallenges = [
    { name: 'No Lives Lost', rule: 'noLivesLost', description: 'Complete 5 levels without losing a life', reward: 500 },
    { name: 'Combo Master', rule: 'comboTarget', target: 20, description: 'Achieve a 20x combo', reward: 300 },
    { name: 'Speed Run', rule: 'timeLimit', timeLimit: 60, description: 'Survive for 60 seconds', reward: 400 },
    { name: 'Item Collector', rule: 'itemTarget', target: 50, description: 'Collect 50 items', reward: 350 },
    { name: 'Mirror Madness', rule: 'avoidBadLuck', description: 'Avoid all bad luck items for 30 seconds', reward: 450 }
];

const gameModes = {
    endless: {
        name: 'Endless Mode',
        description: 'Classic arcade survival - see how long you can last!',
        init: () => {
            lives = 9;
            level = 1;
            itemsCollected = 0;
            score = 0;
            combo = 0;
            maxCombo = 0;
            speedMultiplier = 1;
            frameCount = 0;
        }
    },
    story: {
        name: 'Story Mode',
        description: 'Progress through themed levels with unique challenges',
        currentStoryLevel: 0,
        init: () => {
            lives = 9;
            level = 1;
            itemsCollected = 0;
            score = 0;
            combo = 0;
            maxCombo = 0;
            speedMultiplier = 1;
            frameCount = 0;
            gameModes.story.currentStoryLevel = 0;
            applyStoryTheme();
        }
    },
    challenge: {
        name: 'Challenge Mode',
        description: 'Daily challenges with special rules and rewards',
        currentChallenge: null,
        init: () => {
            lives = 3; // Harder challenges
            level = 1;
            itemsCollected = 0;
            score = 0;
            combo = 0;
            maxCombo = 0;
            speedMultiplier = 1;
            frameCount = 0;
            initDailyChallenge();
        }
    },
    tutorial: {
        name: 'Interactive Tutorial',
        description: 'Learn the game with guided practice',
        init: () => {
            lives = 9;
            level = 1;
            itemsCollected = 0;
            score = 0;
            combo = 0;
            speedMultiplier = 0.5; // Slower for learning
        }
    }
};

function applyStoryTheme() {
    const storyLevel = storyLevels[gameModes.story.currentStoryLevel % storyLevels.length];
    eventStatusEl.textContent = `📖 Story: ${storyLevel.theme}`;
    
    // Apply theme effects
    switch(storyLevel.special) {
        case 'friday13th':
            fridayThe13thMode = true;
            fridayThe13thTimer = 1800; // 30 seconds
            break;
        case 'fullMoon':
            fullMoonEvent = true;
            fullMoonTimer = 1800;
            break;
    }
}

function initDailyChallenge() {
    // Select today's challenge based on date
    const today = new Date().getDate();
    const challengeIndex = today % dailyChallenges.length;
    const challenge = dailyChallenges[challengeIndex];
    
    gameModes.challenge.currentChallenge = challenge;
    eventStatusEl.textContent = `⚡ Challenge: ${challenge.name}`;
    
    // Apply challenge rules
    switch(challenge.rule) {
        case 'timeLimit':
            setTimeout(() => {
                if (currentGameMode === 'challenge' && gameStarted) {
                    // Challenge success
                    score += challenge.reward;
                    eventStatusEl.textContent = `✅ Challenge Complete! +${challenge.reward} points`;
                }
            }, challenge.timeLimit * 1000);
            break;
    }
}

function startGameMode(mode) {
    currentGameMode = mode;
    const modeConfig = gameModes[mode];
    if (modeConfig) {
        modeConfig.init();
        showMenu('');
        startGame();
    }
}

// Story Mode Progression
function checkStoryProgress() {
    if (currentGameMode === 'story' && level > (gameModes.story.currentStoryLevel + 1) * 3) {
        gameModes.story.currentStoryLevel++;
        applyStoryTheme();
        
        // Story completion bonus
        score += 200;
        eventStatusEl.textContent = `📖 Chapter Complete! Next: ${storyLevels[gameModes.story.currentStoryLevel % storyLevels.length].theme}`;
    }
}

// Challenge Mode Validation
function validateChallengeRules() {
    if (currentGameMode !== 'challenge' || !gameModes.challenge.currentChallenge) return;
    
    const challenge = gameModes.challenge.currentChallenge;
    
    switch(challenge.rule) {
        case 'noLivesLost':
            if (lives < 3) {
                // Challenge failed
                eventStatusEl.textContent = `❌ Challenge Failed: Lives Lost`;
                return false;
            }
            break;
        case 'comboTarget':
            if (maxCombo >= challenge.target) {
                // Challenge success
                score += challenge.reward;
                eventStatusEl.textContent = `✅ Challenge Complete! +${challenge.reward} points`;
                return true;
            }
            break;
        case 'itemTarget':
            if (itemsCollected >= challenge.target) {
                score += challenge.reward;
                eventStatusEl.textContent = `✅ Challenge Complete! +${challenge.reward} points`;
                return true;
            }
            break;
    }
    return false;
}

// Enhanced Achievement Detection
function checkNewAchievements(gameEndStats) {
    const newAchievements = [];
    
    // Check various achievement conditions
    if (!achievements.firstSteps && gameEndStats.itemsCollected >= 1) {
        achievements.firstSteps = true;
        newAchievements.push('firstSteps');
    }
    
    if (!achievements.combo5 && gameEndStats.maxCombo >= 5) {
        achievements.combo5 = true;
        newAchievements.push('combo5');
    }
    
    if (!achievements.combo25 && gameEndStats.maxCombo >= 25) {
        achievements.combo25 = true;
        newAchievements.push('combo25');
    }
    
    if (!achievements.combo50 && gameEndStats.maxCombo >= 50) {
        achievements.combo50 = true;
        newAchievements.push('combo50');
    }
    
    if (!achievements.level10 && gameEndStats.level >= 10) {
        achievements.level10 = true;
        newAchievements.push('level10');
    }
    
    if (!achievements.survivor && gameEndStats.lives === 1 && gameEndStats.level >= 5) {
        achievements.survivor = true;
        newAchievements.push('survivor');
    }
    
    if (!achievements.collector && totalItemsCollected >= 1000) {
        achievements.collector = true;
        newAchievements.push('collector');
    }
    
    if (!achievements.veteran && totalGamesPlayed >= 100) {
        achievements.veteran = true;
        newAchievements.push('veteran');
    }
    
    if (!achievements.streaker && longestStreak >= 10) {
        achievements.streaker = true;
        newAchievements.push('streaker');
    }
    
    // Save achievements
    if (newAchievements.length > 0) {
        setStorage('achievements', JSON.stringify(achievements));
        showNewAchievements(newAchievements);
    }
}

function showNewAchievements(newAchievements) {
    const container = document.getElementById('newAchievements');
    const notificationsEl = document.getElementById('achievementNotifications');
    
    if (container && notificationsEl) {
        notificationsEl.innerHTML = newAchievements.map(key => {
            const achievement = achievementList[key];
            return `<div class="achievement-notification">${achievement.icon} ${achievement.name}</div>`;
        }).join('');
        
        container.classList.remove('hidden');
    }
}

// Menu Event Listeners Setup
function setupMenuEventListeners() {
    // Main menu navigation
    document.getElementById('playButton')?.addEventListener('click', () => showMenu('play'));
    document.getElementById('tutorialButton')?.addEventListener('click', () => showMenu('tutorial'));
    document.getElementById('achievementsButton')?.addEventListener('click', () => {
        showMenu('achievements');
        updateAchievements();
    });
    document.getElementById('statsButton')?.addEventListener('click', () => {
        showMenu('stats');
        updateStatsDisplay();
    });
    document.getElementById('settingsButton')?.addEventListener('click', () => showMenu('settings'));
    
    // Play menu
    document.getElementById('endlessButton')?.addEventListener('click', () => startGameMode('endless'));
    document.getElementById('storyButton')?.addEventListener('click', () => startGameMode('story'));
    document.getElementById('challengeButton')?.addEventListener('click', () => startGameMode('challenge'));
    document.getElementById('backToMainButton')?.addEventListener('click', () => showMenu('main'));
    
    // Tutorial
    document.getElementById('backToMainFromTutorial')?.addEventListener('click', () => showMenu('main'));
    
    // Back buttons
    document.getElementById('backToMainFromAchievements')?.addEventListener('click', () => showMenu('main'));
    document.getElementById('backToMainFromStats')?.addEventListener('click', () => showMenu('main'));
    document.getElementById('backToMainFromSettings')?.addEventListener('click', () => showMenu('main'));
    
    // Game over buttons
    document.getElementById('playAgainButton')?.addEventListener('click', () => startGameMode(currentGameMode));
    document.getElementById('backToMenuButton')?.addEventListener('click', () => showMenu('main'));
    
    // Stats reset
    document.getElementById('resetStatsButton')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all stats? This cannot be undone.')) {
            localStorage.clear();
            location.reload();
        }
    });
}

// --- Initialization ---
function init() {
    updateUI();
    initAudio();
    
    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1
        });
    }

    // Initialize menu system
    setupMenuEventListeners();
    initTutorial();
    initSettings();
    updateAchievements();
    updateStatsDisplay();
    
    // Show main menu on start
    showMenu('main');
    
    // Legacy support - remove countdown
    clearInterval(countdownInterval);
}

document.addEventListener('DOMContentLoaded', init);
