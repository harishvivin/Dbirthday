/**
 * Devu's Birthday Celebration - Red Wine Theme
 * Full Interactive Engine: Canvas Particles, Confetti, Web Audio Synth,
 * 3D Gift Box, Candle Blow, Scratch Card, Polaroid Uploader & Wish Wall.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DEFAULT DATA & STATE
  // ==========================================================================
  const DEFAULT_CONFIG = {
    recipientName: 'Devu ✨',
    fullName: '(Devatha)',
    heroSubtitle: '"Like the rarest vintage of fine red wine, our friendship only grows deeper, richer, and more priceless with every year."',
    senderName: 'Your Bestie Always ❤️',
    letterBody: `From being my ultimate confidante to my partner-in-crime, you are hands down the best friend anyone could ever ask for.

Your smile lights up every room, your strength inspires me every single day, and your chaotic, joyful energy makes life a million times better. Thank you for always listening, for laughing at the silly jokes, and for simply being your incredible self.

Here’s to another year of late-night gossips, uncontrollable laughter, dreams coming true, and clinking glasses of red wine together!`,
    fortuneText: '"You possess a rare heart of gold and a fiery spirit. This year is preparing wonders beyond your wildest imagination. Keep conquering the world, Devu!"',
    photo1: null
  };

  let currentConfig = { ...DEFAULT_CONFIG };

  // Load from URL parameters or localStorage if available
  function initConfigFromStorageOrURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('name')) currentConfig.recipientName = urlParams.get('name');
    if (urlParams.has('from')) currentConfig.senderName = urlParams.get('from');
    if (urlParams.has('quote')) currentConfig.heroSubtitle = urlParams.get('quote');
    if (urlParams.has('msg')) currentConfig.letterBody = urlParams.get('msg');
    if (urlParams.has('fortune')) currentConfig.fortuneText = urlParams.get('fortune');

    const savedPhoto = localStorage.getItem('devu_custom_photo');
    if (savedPhoto) {
      currentConfig.photo1 = savedPhoto;
    }

    applyConfigToDOM();
  }

  function applyConfigToDOM() {
    const elRecipient = document.getElementById('displayRecipientName');
    const elSubtitle = document.getElementById('displayHeroSubtitle');
    const elSender = document.getElementById('displaySenderName');
    const elFortune = document.getElementById('displayFortuneText');
    const elLetterBody = document.getElementById('displayLetterBody');
    const elPhoto1 = document.getElementById('polaroidImg1');

    if (elRecipient) elRecipient.textContent = currentConfig.recipientName;
    if (elSubtitle) elSubtitle.textContent = currentConfig.heroSubtitle;
    if (elSender) elSender.textContent = currentConfig.senderName;
    if (elFortune) elFortune.textContent = currentConfig.fortuneText;

    if (elLetterBody) {
      const paragraphs = currentConfig.letterBody.split('\n\n').filter(p => p.trim().length > 0);
      let html = '';
      paragraphs.forEach(p => {
        html += `<p>${p.replace(/\n/g, '<br>')}</p>`;
      });
      html += `<p class="letter-signature">Forever your best friend,<br><strong id="displaySenderName">${currentConfig.senderName}</strong></p>`;
      elLetterBody.innerHTML = html;
    }

    if (currentConfig.photo1 && elPhoto1) {
      elPhoto1.src = currentConfig.photo1;
    }
  }

  initConfigFromStorageOrURL();

  // ==========================================================================
  // 2. AMBIENT GOLD & WINE SPARKLE PARTICLES
  // ==========================================================================
  const sparkleCanvas = document.getElementById('sparkleCanvas');
  const sparkleCtx = sparkleCanvas.getContext('2d');
  let sparkles = [];
  const SPARKLE_COUNT = 45;

  function resizeSparkleCanvas() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeSparkleCanvas);
  resizeSparkleCanvas();

  class SparkleParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * sparkleCanvas.width;
      this.y = initial ? Math.random() * sparkleCanvas.height : sparkleCanvas.height + 10;
      this.radius = Math.random() * 2.2 + 0.6;
      this.speedY = Math.random() * 0.7 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.fadeSpeed = Math.random() * 0.01 + 0.005;
      this.isGold = Math.random() > 0.35;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity += this.fadeSpeed;
      if (this.opacity > 0.85 || this.opacity < 0.15) {
        this.fadeSpeed = -this.fadeSpeed;
      }
      if (this.y < -10) {
        this.reset();
      }
    }

    draw() {
      sparkleCtx.save();
      sparkleCtx.beginPath();
      sparkleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      if (this.isGold) {
        sparkleCtx.fillStyle = `rgba(245, 222, 140, ${Math.max(0, this.opacity)})`;
        sparkleCtx.shadowColor = 'rgba(212, 175, 55, 0.8)';
      } else {
        sparkleCtx.fillStyle = `rgba(214, 52, 85, ${Math.max(0, this.opacity * 0.8)})`;
        sparkleCtx.shadowColor = 'rgba(184, 34, 61, 0.6)';
      }
      sparkleCtx.shadowBlur = 8;
      sparkleCtx.fill();
      sparkleCtx.restore();
    }
  }

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    sparkles.push(new SparkleParticle());
  }

  function animateSparkles() {
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    for (let s of sparkles) {
      s.update();
      s.draw();
    }
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();

  // ==========================================================================
  // 3. ZERO-DEPENDENCY CONFETTI CANNON ENGINE
  // ==========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  const CONFETTI_COLORS = [
    '#d4af37', // Gold
    '#fbeec1', // Light Champagne
    '#9e1c33', // Deep Crimson
    '#781324', // Bordeaux Wine
    '#ffffff', // Crisp White
    '#f3a6b2'  // Rose Pink
  ];

  class ConfettiPiece {
    constructor(x, y) {
      this.x = x || confettiCanvas.width / 2;
      this.y = y || confettiCanvas.height * 0.35;
      this.size = Math.random() * 10 + 6;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.vx = (Math.random() - 0.5) * 16;
      this.vy = (Math.random() - 0.9) * 18 - 4;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.gravity = 0.42;
      this.opacity = 1;
      this.decay = Math.random() * 0.009 + 0.006;
      this.shape = Math.random() > 0.25 ? 'rect' : 'circle';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
    }

    draw() {
      if (this.opacity <= 0) return;
      confettiCtx.save();
      confettiCtx.translate(this.x, this.y);
      confettiCtx.rotate((this.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = this.color;
      confettiCtx.globalAlpha = Math.max(0, this.opacity);

      if (this.shape === 'rect') {
        confettiCtx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    }
  }

  function launchConfetti(count = 120, originX, originY) {
    const x = originX !== undefined ? originX : confettiCanvas.width / 2;
    const y = originY !== undefined ? originY : confettiCanvas.height * 0.35;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiPiece(x, y));
    }
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > confettiCanvas.height + 50) {
        confettiParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // Top bar confetti button
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', (e) => {
      const rect = confettiBtn.getBoundingClientRect();
      launchConfetti(90, rect.left + rect.width / 2, rect.bottom);
      playChimeNote(659.25, 0.4); // E5
    });
  }

  // ==========================================================================
  // 4. WEB AUDIO SYNTHESIZER: "HAPPY BIRTHDAY" MUSIC-BOX TUNE
  // ==========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimeout = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Soft celesta / chime tone generator
  function playSynthNote(freq, startTime, duration = 0.5, volume = 0.22) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle'; // Sweet music-box like timbre
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  function playChimeNote(freq = 523.25, duration = 0.6) {
    const ctx = getAudioContext();
    if (!ctx) return;
    playSynthNote(freq, ctx.currentTime, duration, 0.25);
  }

  // Happy Birthday Melody in C Major
  // Note: frequency in Hz
  const NOTES = {
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
    G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46
  };

  const MELODY = [
    { note: NOTES.C4, dur: 0.35, pause: 0.4 },
    { note: NOTES.C4, dur: 0.25, pause: 0.3 },
    { note: NOTES.D4, dur: 0.55, pause: 0.65 },
    { note: NOTES.C4, dur: 0.55, pause: 0.65 },
    { note: NOTES.F4, dur: 0.55, pause: 0.65 },
    { note: NOTES.E4, dur: 0.95, pause: 1.15 },

    { note: NOTES.C4, dur: 0.35, pause: 0.4 },
    { note: NOTES.C4, dur: 0.25, pause: 0.3 },
    { note: NOTES.D4, dur: 0.55, pause: 0.65 },
    { note: NOTES.C4, dur: 0.55, pause: 0.65 },
    { note: NOTES.G4, dur: 0.55, pause: 0.65 },
    { note: NOTES.F4, dur: 0.95, pause: 1.15 },

    { note: NOTES.C4, dur: 0.35, pause: 0.4 },
    { note: NOTES.C4, dur: 0.25, pause: 0.3 },
    { note: NOTES.C5, dur: 0.55, pause: 0.65 },
    { note: NOTES.A4, dur: 0.55, pause: 0.65 },
    { note: NOTES.F4, dur: 0.55, pause: 0.65 },
    { note: NOTES.E4, dur: 0.55, pause: 0.65 },
    { note: NOTES.D4, dur: 0.95, pause: 1.15 },

    { note: NOTES.A4, dur: 0.35, pause: 0.4 },
    { note: NOTES.A4, dur: 0.25, pause: 0.3 },
    { note: NOTES.F4, dur: 0.55, pause: 0.65 },
    { note: NOTES.G4, dur: 0.55, pause: 0.65 },
    { note: NOTES.F4, dur: 1.2,  pause: 1.5 }
  ];

  function playMelodyLoop() {
    if (!isPlayingMusic) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    let timeOffset = 0;
    MELODY.forEach((item) => {
      setTimeout(() => {
        if (isPlayingMusic) {
          playSynthNote(item.note, ctx.currentTime, item.dur, 0.2);
        }
      }, timeOffset * 1000);
      timeOffset += item.pause;
    });

    musicTimeout = setTimeout(() => {
      if (isPlayingMusic) {
        playMelodyLoop();
      }
    }, (timeOffset + 1.2) * 1000);
  }

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicStatus = document.getElementById('musicStatus');

  if (musicToggleBtn && musicStatus) {
    musicToggleBtn.addEventListener('click', () => {
      getAudioContext();
      isPlayingMusic = !isPlayingMusic;

      if (isPlayingMusic) {
        musicStatus.textContent = 'ON';
        musicToggleBtn.classList.add('primary-pill');
        playMelodyLoop();
      } else {
        musicStatus.textContent = 'OFF';
        musicToggleBtn.classList.remove('primary-pill');
        if (musicTimeout) clearTimeout(musicTimeout);
      }
    });
  }

  // ==========================================================================
  // 5. CAKE & CANDLE BLOW INTERACTION
  // ==========================================================================
  const candles = document.querySelectorAll('.candle');
  const blowCandleBtn = document.getElementById('blowCandleBtn');
  const relightCandleBtn = document.getElementById('relightCandleBtn');
  const wishMessagePrompt = document.getElementById('wishMessagePrompt');

  function areAllCandlesBlown() {
    return Array.from(candles).every(c => c.getAttribute('data-lit') === 'false');
  }

  function blowOutCandle(candle) {
    if (candle.getAttribute('data-lit') === 'true') {
      candle.setAttribute('data-lit', 'false');
      playChimeNote(784, 0.3); // G5 chime

      if (areAllCandlesBlown()) {
        celebrateWishGranted();
      }
    }
  }

  function celebrateWishGranted() {
    if (wishMessagePrompt) {
      wishMessagePrompt.classList.remove('hidden');
    }
    if (blowCandleBtn) blowCandleBtn.style.display = 'none';
    if (relightCandleBtn) relightCandleBtn.style.display = 'inline-flex';

    // Massive celebratory confetti
    const cakeContainer = document.getElementById('cakeContainer');
    const rect = cakeContainer.getBoundingClientRect();
    launchConfetti(140, rect.left + rect.width / 2, rect.top + 30);

    // Chime chords
    setTimeout(() => playChimeNote(523.25, 0.8), 100);
    setTimeout(() => playChimeNote(659.25, 0.8), 250);
    setTimeout(() => playChimeNote(783.99, 1.2), 400);
  }

  // Click single candles
  candles.forEach(candle => {
    candle.addEventListener('click', () => {
      blowOutCandle(candle);
    });
  });

  // "Blow Out Candles" button
  if (blowCandleBtn) {
    blowCandleBtn.addEventListener('click', () => {
      candles.forEach((c, idx) => {
        setTimeout(() => {
          c.setAttribute('data-lit', 'false');
        }, idx * 140);
      });
      setTimeout(() => {
        celebrateWishGranted();
      }, candles.length * 140 + 100);
    });
  }

  // "Relight Candles" button
  if (relightCandleBtn) {
    relightCandleBtn.addEventListener('click', () => {
      candles.forEach(c => c.setAttribute('data-lit', 'true'));
      if (wishMessagePrompt) wishMessagePrompt.classList.add('hidden');
      relightCandleBtn.style.display = 'none';
      if (blowCandleBtn) blowCandleBtn.style.display = 'inline-flex';
      playChimeNote(440, 0.4);
    });
  }

  // ==========================================================================
  // 6. LUXURY 3D GIFT BOX UNWRAP
  // ==========================================================================
  const giftBox = document.getElementById('giftBox');
  const letterCard = document.getElementById('letterCard');
  const closeLetterBtn = document.getElementById('closeLetterBtn');

  if (giftBox) {
    giftBox.addEventListener('click', () => {
      if (!giftBox.classList.contains('opened')) {
        giftBox.classList.add('opened');
        const rect = giftBox.getBoundingClientRect();
        launchConfetti(80, rect.left + rect.width / 2, rect.top);

        // Untie & sparkle sound
        playChimeNote(587.33, 0.4);
        setTimeout(() => playChimeNote(880, 0.6), 200);

        setTimeout(() => {
          if (letterCard) {
            letterCard.classList.remove('hidden');
            letterCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    });
  }

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
      if (letterCard) letterCard.classList.add('hidden');
      if (giftBox) giftBox.classList.remove('opened');
    });
  }

  // ==========================================================================
  // 7. INTERACTIVE SCRATCH CARD: DEVU'S SECRET FORTUNE
  // ==========================================================================
  const scratchCanvas = document.getElementById('scratchCanvas');
  const resetScratchBtn = document.getElementById('resetScratchBtn');
  let scratchCtx = null;
  let isScratching = false;
  let isRevealed = false;

  if (scratchCanvas) {
    scratchCtx = scratchCanvas.getContext('2d');
    // Ensure initial layout has settled before sizing
    setTimeout(initScratchCard, 50);
  }

  function initScratchCard() {
    if (!scratchCanvas || !scratchCtx) return;
    isRevealed = false;
    
    // Dynamic size matching container width
    const rect = scratchCanvas.parentElement.getBoundingClientRect();
    const w = Math.floor(rect.width) || 340;
    const h = Math.floor(rect.height) || 220;

    scratchCanvas.width = w;
    scratchCanvas.height = h;

    // Fill with metallic wine gold coating
    const grad = scratchCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(0.3, '#fbeec1');
    grad.addColorStop(0.7, '#aa7c11');
    grad.addColorStop(1, '#e5c158');

    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, w, h);

    // Decorative text overlay on gold foil
    scratchCtx.fillStyle = '#2b050b';
    scratchCtx.font = 'bold ' + Math.max(14, Math.floor(w * 0.052)) + 'px "Cinzel", Georgia, serif';
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';
    scratchCtx.fillText('✨ Scratch For Devu ✨', w / 2, h / 2 - 12);

    scratchCtx.font = Math.max(11, Math.floor(w * 0.038)) + 'px "Plus Jakarta Sans", sans-serif';
    scratchCtx.fillStyle = '#420a13';
    scratchCtx.fillText('(Touch or drag cursor here)', w / 2, h / 2 + 16);
  }

  // Handle mobile screen orientation change / resize
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (scratchCanvas && !isRevealed) {
        initScratchCard();
      }
    }, 250);
  });

  function scratchAt(x, y) {
    if (!scratchCtx || isRevealed) return;

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, Math.max(18, scratchCanvas.width * 0.065), 0, Math.PI * 2);
    scratchCtx.fill();

    checkScratchProgress();
  }

  function checkScratchProgress() {
    if (isRevealed) return;
    try {
      const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
      const pixels = imgData.data;
      let transparentCount = 0;
      const totalPixels = pixels.length / 4;

      for (let i = 3; i < pixels.length; i += 16) {
        if (pixels[i] === 0) {
          transparentCount++;
        }
      }

      const sampleCount = totalPixels / 4;
      if (transparentCount / sampleCount > 0.40) {
        // More than 40% scratched, reveal completely!
        isRevealed = true;
        scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        launchConfetti(70);
        playChimeNote(784, 0.5);
      }
    } catch (e) {
      // Ignore security/origin edge cases
    }
  }

  function getScratchCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const touch = (e.touches && e.touches.length > 0) ? e.touches[0] : ((e.changedTouches && e.changedTouches.length > 0) ? e.changedTouches[0] : e);
    const clientX = touch.clientX;
    const clientY = touch.clientY;
    const scaleX = rect.width ? scratchCanvas.width / rect.width : 1;
    const scaleY = rect.height ? scratchCanvas.height / rect.height : 1;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const { x, y } = getScratchCoords(e);
      scratchAt(x, y);
    });

    window.addEventListener('mouseup', () => { isScratching = false; });

    scratchCanvas.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const { x, y } = getScratchCoords(e);
      scratchAt(x, y);
    });

    // Touch events for mobile
    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const { x, y } = getScratchCoords(e);
      scratchAt(x, y);
    }, { passive: true });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      if (e.cancelable) e.preventDefault();
      const { x, y } = getScratchCoords(e);
      scratchAt(x, y);
    }, { passive: false });

    scratchCanvas.addEventListener('touchend', () => { isScratching = false; });
  }

  if (resetScratchBtn) {
    resetScratchBtn.addEventListener('click', initScratchCard);
  }

  // ==========================================================================
  // 8. POLAROID PHOTO UPLOAD (REPLACE PHOTO FOR DEVU)
  // ==========================================================================
  const quickPhotoUpload = document.getElementById('quickPhotoUpload');
  const polaroidImg1 = document.getElementById('polaroidImg1');

  function handlePhotoFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      currentConfig.photo1 = base64;
      if (polaroidImg1) polaroidImg1.src = base64;
      try {
        localStorage.setItem('devu_custom_photo', base64);
      } catch (err) {
        console.warn('Storage limit reached for local photo');
      }
      launchConfetti(40);
    };
    reader.readAsDataURL(file);
  }

  if (quickPhotoUpload) {
    quickPhotoUpload.addEventListener('change', (e) => {
      handlePhotoFile(e.target.files[0]);
    });
  }

  // ==========================================================================
  // 9. SPECIAL SONG PLAYER (THE SONG THAT REMINDS ME OF YOU)
  // ==========================================================================
  const specialSongAudio = document.getElementById('specialSongAudio');
  const songPlayPauseBtn = document.getElementById('songPlayPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const vinylDisc = document.getElementById('vinylDisc');
  const soundEqualizer = document.getElementById('soundEqualizer');
  const progressBarBg = document.getElementById('progressBarBg');
  const progressBarFill = document.getElementById('progressBarFill');
  const songCurrentTime = document.getElementById('songCurrentTime');
  const songDuration = document.getElementById('songDuration');
  const songFileInput = document.getElementById('songFileInput');
  const songStatusHint = document.getElementById('songStatusHint');
  const displaySongTitle = document.getElementById('displaySongTitle');

  let isPlayingSong = false;
  let synthPreviewInterval = null;

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function setPlayerPlayingState(playing) {
    isPlayingSong = playing;
    if (playing) {
      if (playIcon) playIcon.textContent = '⏸';
      if (vinylDisc) vinylDisc.classList.add('playing');
      if (soundEqualizer) soundEqualizer.classList.add('playing');
      if (songStatusHint) songStatusHint.innerHTML = '🎵 Playing dedicated melody for Devu...';
    } else {
      if (playIcon) playIcon.textContent = '▶';
      if (vinylDisc) vinylDisc.classList.remove('playing');
      if (soundEqualizer) soundEqualizer.classList.remove('playing');
      if (songStatusHint) songStatusHint.innerHTML = 'Tap <strong>Play ▶</strong> to listen to our song! 🍷';
      if (synthPreviewInterval) {
        clearInterval(synthPreviewInterval);
        synthPreviewInterval = null;
      }
    }
  }

  function playSynthSongPreview() {
    getAudioContext();
    const chords = [
      [261.63, 329.63, 392.00], // C Major
      [220.00, 261.63, 329.63], // A Minor
      [174.61, 220.00, 261.63], // F Major
      [196.00, 246.94, 293.66]  // G Major
    ];
    let chordIndex = 0;
    setPlayerPlayingState(true);
    launchConfetti(45);

    function playChord() {
      if (!isPlayingSong) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      const currentChord = chords[chordIndex % chords.length];
      currentChord.forEach((freq, idx) => {
        setTimeout(() => {
          if (isPlayingSong) playSynthNote(freq, ctx.currentTime, 1.8, 0.18);
        }, idx * 120);
      });
      chordIndex++;
    }

    playChord();
    synthPreviewInterval = setInterval(playChord, 1800);

    if (songStatusHint) {
      songStatusHint.innerHTML = '✨ Preview melody playing! <strong>Choose your audio file</strong> to replace it anytime.';
    }
  }

  if (songPlayPauseBtn && specialSongAudio) {
    songPlayPauseBtn.addEventListener('click', () => {
      // If ambient birthday music is playing, pause it so they don't clash
      if (isPlayingMusic && musicToggleBtn) {
        musicToggleBtn.click();
      }

      if (!isPlayingSong) {
        // Try playing the audio element
        const playPromise = specialSongAudio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlayerPlayingState(true);
              launchConfetti(50);
            })
            .catch(() => {
              // Audio file not present yet, run pleasant synth preview
              playSynthSongPreview();
            });
        } else {
          setPlayerPlayingState(true);
        }
      } else {
        specialSongAudio.pause();
        setPlayerPlayingState(false);
      }
    });

    specialSongAudio.addEventListener('timeupdate', () => {
      if (specialSongAudio.duration) {
        const percent = (specialSongAudio.currentTime / specialSongAudio.duration) * 100;
        if (progressBarFill) progressBarFill.style.width = `${percent}%`;
        if (songCurrentTime) songCurrentTime.textContent = formatTime(specialSongAudio.currentTime);
        if (songDuration) songDuration.textContent = formatTime(specialSongAudio.duration);
      }
    });

    specialSongAudio.addEventListener('loadedmetadata', () => {
      if (songDuration) songDuration.textContent = formatTime(specialSongAudio.duration);
    });

    specialSongAudio.addEventListener('ended', () => {
      setPlayerPlayingState(false);
      if (progressBarFill) progressBarFill.style.width = '0%';
      if (songCurrentTime) songCurrentTime.textContent = '0:00';
    });
  }

  if (progressBarBg && specialSongAudio) {
    progressBarBg.addEventListener('click', (e) => {
      if (specialSongAudio.duration) {
        const rect = progressBarBg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        specialSongAudio.currentTime = (clickX / width) * specialSongAudio.duration;
      }
    });
  }

  if (songFileInput && specialSongAudio) {
    songFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (synthPreviewInterval) {
          clearInterval(synthPreviewInterval);
          synthPreviewInterval = null;
        }
        const fileUrl = URL.createObjectURL(file);
        specialSongAudio.src = fileUrl;
        specialSongAudio.load();
        if (displaySongTitle) {
          const cleanName = file.name.replace(/\.[^/.]+$/, "");
          displaySongTitle.textContent = cleanName;
        }
        specialSongAudio.play().then(() => {
          setPlayerPlayingState(true);
          launchConfetti(80);
        }).catch(err => {
          console.warn('Audio auto-play prevented:', err);
        });
      }
    });
  }

  // ==========================================================================
  // 10. CUSTOMIZATION MODAL & SHAREABLE LINK GENERATOR
  // ==========================================================================
  const customizeBtn = document.getElementById('customizeBtn');
  const customModal = document.getElementById('customModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const saveCustomizeBtn = document.getElementById('saveCustomizeBtn');
  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');

  const modalRecipientInput = document.getElementById('modalRecipientInput');
  const modalSubtitleInput = document.getElementById('modalSubtitleInput');
  const modalSenderInput = document.getElementById('modalSenderInput');
  const modalLetterInput = document.getElementById('modalLetterInput');
  const modalFortuneInput = document.getElementById('modalFortuneInput');
  const modalPhotoInput = document.getElementById('modalPhotoInput');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const copyShareUrlBtn = document.getElementById('copyShareUrlBtn');
  const copySuccessMsg = document.getElementById('copySuccessMsg');

  function openCustomModal() {
    if (!customModal) return;
    modalRecipientInput.value = currentConfig.recipientName;
    modalSubtitleInput.value = currentConfig.heroSubtitle;
    modalSenderInput.value = currentConfig.senderName;
    modalLetterInput.value = currentConfig.letterBody;
    modalFortuneInput.value = currentConfig.fortuneText;

    updateShareURL();
    customModal.classList.remove('hidden');
  }

  function closeCustomModal() {
    if (customModal) customModal.classList.add('hidden');
    if (copySuccessMsg) copySuccessMsg.classList.add('hidden');
  }

  function updateShareURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('name', modalRecipientInput.value.trim() || currentConfig.recipientName);
    url.searchParams.set('from', modalSenderInput.value.trim() || currentConfig.senderName);
    url.searchParams.set('quote', modalSubtitleInput.value.trim() || currentConfig.heroSubtitle);
    if (shareUrlInput) shareUrlInput.value = url.toString();
  }

  if (customizeBtn) customizeBtn.addEventListener('click', openCustomModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeCustomModal);

  // Close modal when clicking outside card
  if (customModal) {
    customModal.addEventListener('click', (e) => {
      if (e.target === customModal) closeCustomModal();
    });
  }

  // Update share link when typing in inputs
  [modalRecipientInput, modalSubtitleInput, modalSenderInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updateShareURL);
  });

  if (modalPhotoInput) {
    modalPhotoInput.addEventListener('change', (e) => {
      handlePhotoFile(e.target.files[0]);
    });
  }

  if (saveCustomizeBtn) {
    saveCustomizeBtn.addEventListener('click', () => {
      currentConfig.recipientName = modalRecipientInput.value.trim() || currentConfig.recipientName;
      currentConfig.heroSubtitle = modalSubtitleInput.value.trim() || currentConfig.heroSubtitle;
      currentConfig.senderName = modalSenderInput.value.trim() || currentConfig.senderName;
      currentConfig.letterBody = modalLetterInput.value.trim() || currentConfig.letterBody;
      currentConfig.fortuneText = modalFortuneInput.value.trim() || currentConfig.fortuneText;

      applyConfigToDOM();
      closeCustomModal();
      launchConfetti(60);
    });
  }

  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      currentConfig = { ...DEFAULT_CONFIG };
      localStorage.removeItem('devu_custom_photo');
      applyConfigToDOM();
      openCustomModal();
    });
  }

  if (copyShareUrlBtn) {
    copyShareUrlBtn.addEventListener('click', async () => {
      if (shareUrlInput) {
        try {
          await navigator.clipboard.writeText(shareUrlInput.value);
          if (copySuccessMsg) {
            copySuccessMsg.classList.remove('hidden');
            setTimeout(() => copySuccessMsg.classList.add('hidden'), 3000);
          }
        } catch {
          shareUrlInput.select();
          document.execCommand('copy');
          if (copySuccessMsg) {
            copySuccessMsg.classList.remove('hidden');
            setTimeout(() => copySuccessMsg.classList.add('hidden'), 3000);
          }
        }
      }
    });
  }

});

