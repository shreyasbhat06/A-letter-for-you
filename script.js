/* ═══════════════════════════════════════════════
   Handwritten Letter — Enhanced Script
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // ─── Setup ───
  setLetterDate();
  generateRuledLines();
  generateDustParticles();
  generateLetterParticles();

  // ─── Envelope → Letter Interaction ───
  const seal       = document.getElementById('wax-seal');
  const envelope   = document.getElementById('envelope');
  const envelopeScene = document.getElementById('envelope-scene');
  const letterScene   = document.getElementById('letter-scene');
  const letterPaper   = document.getElementById('letter-paper');
  const hint       = document.getElementById('envelope-hint');
  const foldBtn    = document.getElementById('fold-btn');

  let isOpen       = false;
  let isAnimating  = false;

  // Click seal OR envelope to open
  if (seal) {
    seal.addEventListener('click', openLetter);
    envelope.addEventListener('click', openLetter);
  }

  // Click fold button to close
  if (foldBtn) {
    foldBtn.addEventListener('click', closeLetter);
  }

  // ─── Open Letter Flow ───
  function openLetter(e) {
    if (isOpen || isAnimating) return;
    isAnimating = true;
    e.stopPropagation();

    // 1. Fade out hint text
    if (hint) hint.classList.add('fade');

    // 2. Break wax seal with fragments
    seal.classList.add('breaking');
    spawnSealFragments();

    // 3. Open the envelope flap (3D rotation)
    setTimeout(() => {
      envelope.classList.add('opened');
    }, 600);

    // 4. Letter peeks out of envelope
    // (handled by CSS: .envelope.opened .letter-peek-paper)

    // 5. Dim and fade envelope scene
    setTimeout(() => {
      envelopeScene.classList.add('fade-out');
    }, 2000);

    // 6. Show letter scene
    setTimeout(() => {
      envelopeScene.classList.add('hidden');
      letterScene.classList.remove('hidden');
      letterScene.classList.add('appearing');

      // 7. Unfold the letter paper
      requestAnimationFrame(() => {
        letterPaper.classList.add('unfold');
      });

      isOpen = true;
      isAnimating = false;
    }, 3200);
  }

  // ─── Close Letter Flow (fold back) ───
  function closeLetter() {
    if (!isOpen || isAnimating) return;
    isAnimating = true;

    // 1. Hide fold button immediately
    foldBtn.style.opacity = '0';
    foldBtn.style.pointerEvents = 'none';

    // 2. Fold the paper
    letterPaper.classList.remove('unfold');
    letterPaper.classList.add('fold-back');

    // 3. After paper folds, switch back to envelope scene
    setTimeout(() => {
      letterScene.classList.add('hidden');
      letterScene.classList.remove('appearing');

      // Reset letter paper for next open
      letterPaper.classList.remove('fold-back');

      // Reset all ink-appear animations
      resetLetterAnimations();

      // Prepare envelope scene
      envelopeScene.classList.remove('hidden');
      envelopeScene.classList.remove('fade-out');

      // Reset envelope
      envelope.classList.remove('opened');
      seal.classList.remove('breaking');
      seal.style.display = '';

      // Reset hint
      if (hint) hint.classList.remove('fade');

      // Reset fold button for next time
      foldBtn.style.opacity = '';
      foldBtn.style.pointerEvents = '';
      foldBtn.style.animation = 'none';

      isOpen = false;
      isAnimating = false;
    }, 1000);
  }
});


// ═══════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════

function setLetterDate() {
  const dateEl = document.getElementById('letter-date');
  if (!dateEl) return;
  const now = new Date();
  dateEl.textContent = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generateRuledLines() {
  const container = document.getElementById('ruled-lines');
  if (!container) return;
  const spacing = 38;
  const count   = 22;
  for (let i = 0; i < count; i++) {
    const line = document.createElement('div');
    line.className = 'rule-line';
    line.style.top = `${i * spacing}px`;
    container.appendChild(line);
  }
}

// ─── Dust particles (envelope scene) ───
function generateDustParticles() {
  const container = document.getElementById('dust-particles');
  if (!container) return;

  for (let i = 0; i < 15; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.top  = `${Math.random() * 100}%`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.setProperty('--dur',   `${6 + Math.random() * 6}s`);
    p.style.setProperty('--delay', `${Math.random() * 5}s`);
    p.style.setProperty('--dx',    `${-30 + Math.random() * 60}px`);
    p.style.setProperty('--dy',    `${-50 + Math.random() * 30}px`);
    p.style.width  = `${2 + Math.random() * 2}px`;
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}

// ─── Soft particles (letter scene) ───
function generateLetterParticles() {
  const container = document.getElementById('letter-particles');
  if (!container) return;

  for (let i = 0; i < 10; i++) {
    const p = document.createElement('span');
    p.className = 'lp';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top  = `${20 + Math.random() * 70}%`;
    p.style.setProperty('--dur',   `${8 + Math.random() * 6}s`);
    p.style.setProperty('--delay', `${Math.random() * 6}s`);
    container.appendChild(p);
  }
}

// ─── Wax seal fragment burst ───
function spawnSealFragments() {
  const container = document.getElementById('seal-fragments');
  if (!container) return;
  container.innerHTML = '';

  const count = 8;
  for (let i = 0; i < count; i++) {
    const frag = document.createElement('div');
    frag.className = 'seal-fragment';

    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist  = 40 + Math.random() * 50;
    const fx    = Math.cos(angle) * dist;
    const fy    = Math.sin(angle) * dist;
    const fr    = Math.random() * 360;

    frag.style.setProperty('--fx', `${fx}px`);
    frag.style.setProperty('--fy', `${fy}px`);
    frag.style.setProperty('--fr', `${fr}deg`);
    frag.style.width  = `${5 + Math.random() * 8}px`;
    frag.style.height = `${5 + Math.random() * 8}px`;
    frag.style.background = Math.random() > 0.5
      ? 'var(--wax-red)'
      : 'var(--wax-highlight)';

    container.appendChild(frag);

    // Trigger animation
    requestAnimationFrame(() => {
      frag.classList.add('animate');
    });
  }
}

// ─── Reset letter content animations for re-open ───
function resetLetterAnimations() {
  const letterContent = document.getElementById('letter-content');
  if (!letterContent) return;

  // Get all animated elements
  const animated = letterContent.querySelectorAll(
    '.letter-date, .letter-greeting, .letter-body p, .letter-closing, .letter-signature, .ornament-divider, .pressed-flower'
  );

  animated.forEach(el => {
    // Remove animation, reset opacity
    const currentAnim = el.style.animation;
    el.style.animation = 'none';
    el.offsetHeight; // Force reflow
    el.style.animation = '';
  });

  // Reset fold button animation
  const foldBtn = document.getElementById('fold-btn');
  if (foldBtn) {
    requestAnimationFrame(() => {
      foldBtn.style.animation = '';
    });
  }
}
