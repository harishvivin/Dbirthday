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
    senderName: 'Yours Vivin Always ❤️',
    letterBody: `First of all, un life-la nee always happy-ah irukkanum, un dreams ellam achieve pannanum. Namma friendship start aagi romba naal aagala, but indha short time-la neraya beautiful memories create pannirukkom. Un kooda pesuradhu, random-ah sirikkuradhu, mokka jokes, chinna chinna arguments, andha Salem memories ellame enakku romba special. 😂❤️ Sometimes words-la explain panna mudiyadha alavukku sila friendships namma life-la meaningful-ah maaridum, and namma friendship-um appadi dhaan. Nee eppovume indha same happy, crazy and genuine person-ah iru. Life-la evlo problems vandhaalum, don't forget to smile and never stop believing in yourself. Unakku edhavadhu kashtam irundha, as a friend naan unakku support-ah iruppen. Namma friendship-la ipdiye neraya memories create pannuvom. Once again, Happiest Birthday eruma! 😂❤️🫂 Stay blessed, stay happy and keep smiling always! ♾️`,
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
    const elLetterBody = document.getElementById('displayLetterBody');
    const elPhoto1 = document.getElementById('polaroidImg1');

    if (elRecipient) elRecipient.textContent = currentConfig.recipientName;
    if (elSubtitle) elSubtitle.textContent = currentConfig.heroSubtitle;
    if (elSender) elSender.textContent = currentConfig.senderName;

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
  // 2. HIGH-PERFORMANCE AMBIENT GOLD & WINE SPARKLE PARTICLES
  // ==========================================================================
  const sparkleCanvas = document.getElementById('sparkleCanvas');
  const sparkleCtx = sparkleCanvas.getContext('2d', { alpha: true });
  let sparkles = [];
  const SPARKLE_COUNT = 28; // Optimized for 60fps smooth rendering
  let isSparkleLoopRunning = true;

  function resizeSparkleCanvas() {
    sparkleCanvas.width = window.innerWidth;
    sparkleCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeSparkleCanvas, { passive: true });
  resizeSparkleCanvas();

  class SparkleParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * sparkleCanvas.width;
      this.y = initial ? Math.random() * sparkleCanvas.height : sparkleCanvas.height + 10;
      this.radius = Math.random() * 2 + 0.8;
      this.speedY = Math.random() * 0.6 + 0.25;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.25;
      this.fadeSpeed = Math.random() * 0.008 + 0.004;
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
      const alpha = Math.max(0, this.opacity);
      // Soft glowing aura (fast zero-cost drawing without expensive shadowBlur)
      sparkleCtx.beginPath();
      sparkleCtx.arc(this.x, this.y, this.radius * 2.2, 0, Math.PI * 2);
      sparkleCtx.fillStyle = this.isGold ? `rgba(245, 222, 140, ${alpha * 0.22})` : `rgba(214, 52, 85, ${alpha * 0.18})`;
      sparkleCtx.fill();

      // Sharp bright core
      sparkleCtx.beginPath();
      sparkleCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      sparkleCtx.fillStyle = this.isGold ? `rgba(255, 245, 210, ${alpha})` : `rgba(255, 130, 150, ${alpha})`;
      sparkleCtx.fill();
    }
  }

  for (let i = 0; i < SPARKLE_COUNT; i++) {
    sparkles.push(new SparkleParticle());
  }

  function animateSparkles() {
    if (!isSparkleLoopRunning) return;
    sparkleCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    for (let i = 0; i < sparkles.length; i++) {
      sparkles[i].update();
      sparkles[i].draw();
    }
    requestAnimationFrame(animateSparkles);
  }
  requestAnimationFrame(animateSparkles);

  // Pause sparkles when tab is inactive to free CPU/GPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isSparkleLoopRunning = false;
    } else {
      isSparkleLoopRunning = true;
      requestAnimationFrame(animateSparkles);
    }
  });

  // ==========================================================================
  // 3. ZERO-DEPENDENCY CONFETTI CANNON (EVENT-DRIVEN ON DEMAND)
  // ==========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas.getContext('2d', { alpha: true });
  let confettiParticles = [];
  let isConfettiLoopRunning = false;

  function resizeConfettiCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas, { passive: true });
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
      this.size = Math.random() * 9 + 5;
      this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      this.vx = (Math.random() - 0.5) * 15;
      this.vy = (Math.random() - 0.9) * 16 - 3;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 10;
      this.gravity = 0.42;
      this.opacity = 1;
      this.decay = Math.random() * 0.01 + 0.007;
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

  function launchConfetti(count = 90, originX, originY) {
    const x = originX !== undefined ? originX : confettiCanvas.width / 2;
    const y = originY !== undefined ? originY : confettiCanvas.height * 0.35;
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiPiece(x, y));
    }
    if (!isConfettiLoopRunning) {
      isConfettiLoopRunning = true;
      requestAnimationFrame(animateConfetti);
    }
  }

  function animateConfetti() {
    if (confettiParticles.length === 0) {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      isConfettiLoopRunning = false;
      return;
    }

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

  // Top bar confetti button
  const confettiBtn = document.getElementById('confettiBtn');
  if (confettiBtn) {
    confettiBtn.addEventListener('click', () => {
      const rect = confettiBtn.getBoundingClientRect();
      launchConfetti(80, rect.left + rect.width / 2, rect.bottom);
      playChimeNote(659.25, 0.4); // E5
    });
  }

  // ==========================================================================
  // 4. AUDIO CHIME ENGINE (FOR CELEBRATIONS & UNBOXING)
  // ==========================================================================
  let audioCtx = null;

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

  function playSynthNote(freq, startTime, duration = 0.5, volume = 0.22) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
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
  // 7. MEMORIES PHOTO GALLERY, MOBILE SLIDER & LIGHTBOX
  // ==========================================================================
  const memoriesTrack = document.getElementById('memoriesTrack');
  const memoryCards = document.querySelectorAll('.memory-card');
  const galleryPrevBtn = document.getElementById('galleryPrevBtn');
  const galleryNextBtn = document.getElementById('galleryNextBtn');
  const galleryDotsWrap = document.getElementById('galleryDots');
  const sliderCounter = document.getElementById('sliderCounter');

  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCount = document.getElementById('lightboxCount');

  let currentSlideIndex = 0;
  const totalSlides = memoryCards.length;

  // Initialize navigation dots
  if (galleryDotsWrap && totalSlides > 0) {
    galleryDotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
      dot.type = 'button';
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        scrollToSlide(i);
      });
      galleryDotsWrap.appendChild(dot);
    }
  }

  function updateSliderActiveState(index) {
    if (index < 0 || index >= totalSlides) return;
    currentSlideIndex = index;
    if (sliderCounter) {
      sliderCounter.textContent = `${index + 1} / ${totalSlides}`;
    }
    if (galleryDotsWrap) {
      const dots = galleryDotsWrap.querySelectorAll('.gallery-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });
    }
  }

  function scrollToSlide(index) {
    if (!memoriesTrack || !memoryCards[index]) return;
    updateSliderActiveState(index);
    const targetCard = memoryCards[index];
    targetCard.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevIdx = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      scrollToSlide(prevIdx);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (currentSlideIndex + 1) % totalSlides;
      scrollToSlide(nextIdx);
    });
  }

  // Update active slide when scrolling/swiping on mobile with rAF
  if (memoriesTrack && totalSlides > 0) {
    let scrollRaf = null;
    memoriesTrack.addEventListener('scroll', () => {
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      scrollRaf = requestAnimationFrame(() => {
        const trackRect = memoriesTrack.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        let closestIdx = 0;
        let minDistance = Infinity;

        memoryCards.forEach((card, idx) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenter = cardRect.left + cardRect.width / 2;
          const dist = Math.abs(trackCenter - cardCenter);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = idx;
          }
        });

        if (closestIdx !== currentSlideIndex) {
          updateSliderActiveState(closestIdx);
        }
      });
    }, { passive: true });
  }

  // Lightbox Modal Implementation
  let currentLightboxIndex = 0;

  function openLightbox(index) {
    if (!lightboxModal || !memoryCards[index]) return;
    currentLightboxIndex = index;
    const card = memoryCards[index];
    const img = card.querySelector('.memory-img');
    const captionEl = card.querySelector('.memory-caption');

    if (img && lightboxImage) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || `Memory ${index + 1}`;
    }
    if (captionEl && lightboxCaption) {
      lightboxCaption.textContent = captionEl.textContent;
    }
    if (lightboxCount) {
      lightboxCount.textContent = `${index + 1} of ${totalSlides}`;
    }

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    const nextIdx = (currentLightboxIndex + direction + totalSlides) % totalSlides;
    openLightbox(nextIdx);
  }

  // Open Lightbox on card click
  memoryCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

  // Keyboard navigation for Lightbox
  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Touch swipe support inside Lightbox
  let lbTouchStartX = 0;
  let lbTouchEndX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].screenX;
      const diffX = lbTouchEndX - lbTouchStartX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          navigateLightbox(-1); // swipe right -> prev
        } else {
          navigateLightbox(1);  // swipe left -> next
        }
      }
    }, { passive: true });
  }

  // Optional custom photo upload handler (fallback)
  const quickPhotoUpload = document.getElementById('quickPhotoUpload');
  const polaroidImg1 = document.getElementById('polaroidImg1');

  function handlePhotoFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
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
      songStatusHint.innerHTML = '✨ Playing dedicated melody for Devu! 💖';
    }
  }

  if (songPlayPauseBtn && specialSongAudio) {
    songPlayPauseBtn.addEventListener('click', () => {
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
              // Audio file blocked or not found, run pleasant synth preview
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

});

