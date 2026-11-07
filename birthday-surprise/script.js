/**
 * ============================================================================
 * 21ST BIRTHDAY VINTAGE SCRAPBOOK INTERACTIVE ENGINE
 * ============================================================================
 * 
 * Hi there! This file powers all interactive features of the website:
 * - Smooth chapter-by-chapter screen transitions
 * - Interactive music player with Web Audio API fallback (never fails!)
 * - Realistic candle blowing animation with smoke & canvas confetti
 * - Photo Lightbox modal
 * - Envelope opening & falling flower petal generator
 * 
 * PERSONALIZATION TIP:
 * You can customize the name, photos, and messages directly in the BIRTHDAY_DATA
 * configuration object below!
 */

const BIRTHDAY_DATA = {
  friendName: "Bestie", // Your best friend's name (e.g. "Sarah", "Emily", "Ayu")
  age: "21",
  birthDate: "November 2026",
  
  // Custom audio path (put your favourite song in music/birthday-song.mp3)
  musicPath: "music/birthday-song.mp3",
};

document.addEventListener("DOMContentLoaded", () => {
  initScreenNavigation();
  initMusicPlayer();
  initCakeCandles();
  initFinalSurprise();
  initLightbox();
  initPetalLayer();
});

/* ============================================================================
   1. SCREEN NAVIGATION & CHAPTER TRACKER
   ============================================================================ */
let currentScreenIndex = 1;
const totalScreens = 8;

const chapterTitles = [
  "Chapter I: The Celebration",
  "Chapter II: A Little Secret",
  "Chapter III: Golden Moments",
  "Chapter IV: Heartfelt Wishes",
  "Chapter V: Memory Vault",
  "Chapter VI: My Letter To You",
  "Chapter VII: Make A Wish",
  "Chapter VIII: Final Surprise"
];

function initScreenNavigation() {
  const chapterBadge = document.getElementById("chapter-badge");
  
  // Connect all Next buttons
  const nextButtons = document.querySelectorAll("[data-next-screen]");
  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetIndex = parseInt(btn.getAttribute("data-next-screen"), 10);
      goToScreen(targetIndex);
    });
  });

  // Connect all Back buttons
  const backButtons = document.querySelectorAll("[data-back-screen]");
  backButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetIndex = parseInt(btn.getAttribute("data-back-screen"), 10);
      goToScreen(targetIndex);
    });
  });
}

function goToScreen(index) {
  if (index < 1 || index > totalScreens || index === currentScreenIndex) return;

  const currentScreen = document.getElementById(`screen-${currentScreenIndex}`);
  const nextScreen = document.getElementById(`screen-${index}`);
  const chapterBadge = document.getElementById("chapter-badge");

  if (!nextScreen) return;

  // Hide current screen immediately so it takes 0 space and doesn't push down
  if (currentScreen) {
    currentScreen.classList.remove("active");
  }

  // Activate next screen
  nextScreen.classList.add("active");
  currentScreenIndex = index;

  // Update Chapter indicator
  if (chapterBadge) {
    chapterBadge.textContent = chapterTitles[index - 1] || `Chapter ${index} of ${totalScreens}`;
  }

  // Immediately reset all scroll positions to 0 so content starts at top
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  const viewport = document.getElementById("app-viewport");
  if (viewport) viewport.scrollTop = 0;
  nextScreen.scrollTop = 0;
}

/* ============================================================================
   2. VINTAGE BACKGROUND MUSIC PLAYER
   Features:
   - Toggles audio playback seamlessly across screens
   - Animated vinyl disc rotation
   - Graceful Web Audio API fallback (plays an authentic acoustic music box 
     birthday melody if the MP3 file is not yet added!)
   ============================================================================ */
let isPlaying = false;
let audioPlayer = null;
let webAudioContext = null;
let musicBoxInterval = null;

function initMusicPlayer() {
  const musicToggle = document.getElementById("music-toggle");
  const vinylDisc = document.getElementById("vinyl-disc");
  const musicLabel = document.getElementById("music-label");

  // Create standard HTML5 Audio element
  audioPlayer = new Audio();
  audioPlayer.src = BIRTHDAY_DATA.musicPath;
  audioPlayer.loop = true;
  audioPlayer.preload = "auto";

  // Check if user clicks music button
  musicToggle.addEventListener("click", () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // Try playing custom MP3, fallback to gentle music box if missing or blocked
  function playMusic() {
    isPlaying = true;
    vinylDisc.classList.add("spinning");
    musicLabel.textContent = "Playing ♪";

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // If file doesn't exist or failed to load, play sweet Web Audio music box tune!
        console.log("Custom MP3 not found yet or blocked. Starting sweet Music Box tune!");
        startWebAudioMusicBox();
      });
    }
  }

  function pauseMusic() {
    isPlaying = false;
    vinylDisc.classList.remove("spinning");
    musicLabel.textContent = "Music Box";

    if (audioPlayer) {
      audioPlayer.pause();
    }
    stopWebAudioMusicBox();
  }

  // Gentle first-interaction auto-hint
  const enableAudioOnFirstTap = () => {
    // Only attempt on first user gesture if not already playing
    document.removeEventListener("click", enableAudioOnFirstTap);
  };
  document.addEventListener("click", enableAudioOnFirstTap, { once: true });
}

/**
 * Procedural Vintage Music Box Synthesizer (Web Audio API)
 * Plays the iconic "Happy Birthday" lullaby on a chime / celesta music box!
 */
function startWebAudioMusicBox() {
  stopWebAudioMusicBox(); // reset any ongoing melody
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    webAudioContext = new AudioContext();

    // Notes frequencies for Happy Birthday:
    // C4, D4, E4, F4, G4, A4, B4, C5
    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88, C5: 523.25
    };

    const melody = [
      { note: notes.C4, dur: 0.35 },
      { note: notes.C4, dur: 0.2 },
      { note: notes.D4, dur: 0.6 },
      { note: notes.C4, dur: 0.6 },
      { note: notes.F4, dur: 0.6 },
      { note: notes.E4, dur: 1.0 },

      { note: notes.C4, dur: 0.35 },
      { note: notes.C4, dur: 0.2 },
      { note: notes.D4, dur: 0.6 },
      { note: notes.C4, dur: 0.6 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.F4, dur: 1.0 },

      { note: notes.C4, dur: 0.35 },
      { note: notes.C4, dur: 0.2 },
      { note: notes.C5, dur: 0.6 },
      { note: notes.A4, dur: 0.6 },
      { note: notes.F4, dur: 0.6 },
      { note: notes.E4, dur: 0.6 },
      { note: notes.D4, dur: 0.8 },

      { note: notes.Bb4, dur: 0.35 },
      { note: notes.Bb4, dur: 0.2 },
      { note: notes.A4, dur: 0.6 },
      { note: notes.F4, dur: 0.6 },
      { note: notes.G4, dur: 0.6 },
      { note: notes.F4, dur: 1.2 }
    ];

    let noteIdx = 0;

    function playNote(freq, duration) {
      if (!webAudioContext || !isPlaying) return;
      
      const osc = webAudioContext.createOscillator();
      const gain = webAudioContext.createGain();

      // Sine wave with soft harmonic sparkle for antique music box sound
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, webAudioContext.currentTime);

      gain.gain.setValueAtTime(0.001, webAudioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, webAudioContext.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, webAudioContext.currentTime + duration + 0.8);

      osc.connect(gain);
      gain.connect(webAudioContext.destination);

      osc.start();
      osc.stop(webAudioContext.currentTime + duration + 0.9);
    }

    function stepMelody() {
      if (!isPlaying) return;
      const current = melody[noteIdx];
      playNote(current.note, current.dur);
      noteIdx = (noteIdx + 1) % melody.length;
      
      const pauseBetweenNotes = current.dur * 680;
      musicBoxInterval = setTimeout(stepMelody, pauseBetweenNotes);
    }

    stepMelody();
  } catch (e) {
    console.warn("Web Audio could not be initialized:", e);
  }
}

function stopWebAudioMusicBox() {
  if (musicBoxInterval) {
    clearTimeout(musicBoxInterval);
    musicBoxInterval = null;
  }
  if (webAudioContext) {
    try {
      webAudioContext.close();
    } catch (e) {}
    webAudioContext = null;
  }
}

/* ============================================================================
   3. ANIMATED BIRTHDAY CAKE & WISH CELEBRATION (SCREEN 7)
   ============================================================================ */
function initCakeCandles() {
  const blowBtn = document.getElementById("blow-candles-btn");
  const candles = document.querySelectorAll(".candle");
  const wishRevealBox = document.getElementById("wish-reveal-box");
  let candlesBlown = false;

  if (!blowBtn) return;

  blowBtn.addEventListener("click", () => {
    if (candlesBlown) return;
    candlesBlown = true;

    // Extinguish candles
    candles.forEach(candle => {
      candle.classList.add("blown-out");
    });

    // Play chime sound effect if audio is active
    playChimeEffect();

    // Trigger golden confetti burst!
    triggerCelebrationConfetti();

    // Update button text
    blowBtn.innerHTML = "✨ Wish Sent to the Stars! ✨";
    blowBtn.style.opacity = "0.7";
    blowBtn.style.pointerEvents = "none";

    // Reveal heartfelt wish message
    setTimeout(() => {
      if (wishRevealBox) {
        wishRevealBox.classList.add("show");
      }
    }, 700);
  });
}

function playChimeEffect() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);
      }, idx * 120);
    });
  } catch (e) {}
}

/* ============================================================================
   4. CELEBRATION CONFETTI ENGINE (VINTAGE GOLD, BURGUNDY & ROSE)
   ============================================================================ */
function triggerCelebrationConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;

  const confettiColors = ["#c99e56", "#851c27", "#f4ecdc", "#c75667", "#e6c88f", "#fff"];
  const particles = [];
  const particleCount = 75;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 80,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 12,
      vy: -(Math.random() * 10 + 5),
      size: Math.random() * 7 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 15,
      alpha: 1
    });
  }

  let animationFrameId;
  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.007;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrameId = requestAnimationFrame(updateConfetti);
    } else {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  updateConfetti();
}

/* ============================================================================
   5. SCREEN 8: FINAL HIDDEN SURPRISE & ENVELOPE
   ============================================================================ */
function initFinalSurprise() {
  const openSurpriseBtn = document.getElementById("open-surprise-btn");
  const envelope = document.getElementById("secret-envelope");
  const hiddenMessagePanel = document.getElementById("hidden-message-panel");
  const replayBtn = document.getElementById("replay-scrapbook-btn");

  if (!openSurpriseBtn) return;

  openSurpriseBtn.addEventListener("click", () => {
    if (envelope) {
      envelope.classList.add("opened");
    }
    openSurpriseBtn.style.display = "none";

    setTimeout(() => {
      if (hiddenMessagePanel) {
        hiddenMessagePanel.style.display = "block";
      }
      // Trigger romantic shower of flower petals
      generateContinuousPetals();
    }, 600);
  });

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      goToScreen(1);
    });
  }
}

/* ============================================================================
   6. VINTAGE SCRAPBOOK LIGHTBOX MODAL (SCREEN 5)
   ============================================================================ */
function initLightbox() {
  const lightbox = document.getElementById("vintage-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close-btn");

  if (!lightbox) return;

  // Open modal on click of any gallery photo
  const clickablePhotos = document.querySelectorAll("[data-lightbox-src]");
  clickablePhotos.forEach(item => {
    item.addEventListener("click", () => {
      // Use active image src (respecting fallbacks) or data-lightbox-src
      const imgChild = item.querySelector("img");
      const src = (imgChild && imgChild.src) ? imgChild.src : item.getAttribute("data-lightbox-src");
      const caption = item.getAttribute("data-lightbox-caption") || "Our special memory";

      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightbox.classList.add("active");
    });
  });

  // Close handlers
  const closeLightbox = () => {
    lightbox.classList.remove("active");
  };

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/* ============================================================================
   7. FLOATING ROSE PETALS (SCREEN 8 & AMBIENCE)
   ============================================================================ */
function initPetalLayer() {
  // ambient setup
}

function generateContinuousPetals() {
  const container = document.getElementById("floating-petal-container");
  if (!container) return;

  const petalColors = ["#851c27", "#c75667", "#a32837", "#f3cfd6"];

  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const petal = document.createElement("div");
      petal.className = "petal-particle";

      const size = Math.random() * 14 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 4;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];

      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${left}%`;
      petal.style.backgroundColor = color;
      petal.style.animationDuration = `${duration}s`;

      container.appendChild(petal);

      // Clean up after animation finishes
      setTimeout(() => {
        petal.remove();
      }, duration * 1000);
    }, i * 180);
  }
}
