/* ═══════════════════════════════════════════════
   Handwritten Letter — v3 Script
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  setLetterDate();
  generateRuledLines();
  generateDustParticles();
  generateLetterParticles();

  const seal         = document.getElementById('wax-seal');
  const envelope     = document.getElementById('envelope');
  const envelopeScene = document.getElementById('envelope-scene');
  const letterScene   = document.getElementById('letter-scene');
  const letterPaper   = document.getElementById('letter-paper');
  const hint         = document.getElementById('envelope-hint');
  const foldBtn      = document.getElementById('fold-btn');

  let isOpen      = false;
  let isAnimating = false;

  // Open on seal or envelope click
  seal.addEventListener('click', openLetter);
  envelope.addEventListener('click', openLetter);

  // Close on fold button
  foldBtn.addEventListener('click', closeLetter);


  /* ─── OPEN FLOW ─── */
  function openLetter(e) {
    if (isOpen || isAnimating) return;
    isAnimating = true;
    e.stopPropagation();

    // Hide hint
    hint.classList.add('fade');

    // Break seal + fragments
    seal.classList.add('breaking');
    spawnSealFragments();

    // Open flap after seal fades
    setTimeout(() => {
      envelope.classList.add('opened');
    }, 500);

    // Begin fading envelope scene
    setTimeout(() => {
      envelopeScene.classList.add('fade-out');
    }, 1800);

    // Switch to letter scene
    setTimeout(() => {
      envelopeScene.classList.add('hidden');

      letterScene.classList.remove('hidden');
      // Force a reflow so the opacity transition fires
      letterScene.offsetHeight;
      letterScene.classList.add('visible');

      // Unfold paper
      requestAnimationFrame(() => {
        letterPaper.classList.add('unfold');
      });

      isOpen = true;
      isAnimating = false;
    }, 3000);
  }


  /* ─── CLOSE FLOW ─── */
  function closeLetter() {
    if (!isOpen || isAnimating) return;
    isAnimating = true;

    // Hide fold button
    foldBtn.style.opacity = '0';
    foldBtn.style.pointerEvents = 'none';

    // Fold the paper
    letterPaper.classList.remove('unfold');
    letterPaper.classList.add('fold-back');

    // Fade out letter scene
    setTimeout(() => {
      letterScene.classList.remove('visible');
    }, 400);

    // Switch back to envelope
    setTimeout(() => {
      letterScene.classList.add('hidden');

      // Reset letter
      letterPaper.classList.remove('fold-back');
      resetLetterAnimations();

      // Reset fold button
      foldBtn.style.opacity = '';
      foldBtn.style.pointerEvents = '';
      foldBtn.style.animation = 'none';
      foldBtn.offsetHeight;
      foldBtn.style.animation = '';

      // Restore envelope
      envelopeScene.classList.remove('hidden');
      envelopeScene.classList.remove('fade-out');
      envelope.classList.remove('opened');
      seal.classList.remove('breaking');

      hint.classList.remove('fade');

      isOpen = false;
      isAnimating = false;
    }, 1200);
  }
});


/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */

function setLetterDate() {
  const el = document.getElementById('letter-date');
  if (!el) return;
  el.textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function generateRuledLines() {
  const c = document.getElementById('ruled-lines');
  if (!c) return;
  for (let i = 0; i < 22; i++) {
    const l = document.createElement('div');
    l.className = 'rule-line';
    l.style.top = `${i * 38}px`;
    c.appendChild(l);
  }
}

function generateDustParticles() {
  const c = document.getElementById('dust-particles');
  if (!c) return;
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.top    = `${Math.random() * 100}%`;
    p.style.left   = `${Math.random() * 100}%`;
    p.style.width  = `${2 + Math.random() * 2}px`;
    p.style.height = p.style.width;
    p.style.setProperty('--dur',   `${7 + Math.random() * 6}s`);
    p.style.setProperty('--delay', `${Math.random() * 5}s`);
    p.style.setProperty('--dx',    `${-25 + Math.random() * 50}px`);
    p.style.setProperty('--dy',    `${-40 + Math.random() * 20}px`);
    c.appendChild(p);
  }
}

function generateLetterParticles() {
  const c = document.getElementById('letter-particles');
  if (!c) return;
  for (let i = 0; i < 10; i++) {
    const p = document.createElement('span');
    p.className = 'lp';
    p.style.left = `${Math.random() * 100}%`;
    p.style.top  = `${20 + Math.random() * 70}%`;
    p.style.setProperty('--dur',   `${9 + Math.random() * 6}s`);
    p.style.setProperty('--delay', `${Math.random() * 6}s`);
    c.appendChild(p);
  }
}

function spawnSealFragments() {
  const c = document.getElementById('seal-fragments');
  if (!c) return;
  c.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    const f = document.createElement('div');
    f.className = 'seal-fragment';

    const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const dist  = 35 + Math.random() * 45;

    f.style.setProperty('--fx', `${Math.cos(angle) * dist}px`);
    f.style.setProperty('--fy', `${Math.sin(angle) * dist}px`);
    f.style.setProperty('--fr', `${Math.random() * 360}deg`);
    f.style.width  = `${5 + Math.random() * 7}px`;
    f.style.height = `${5 + Math.random() * 7}px`;
    f.style.background = Math.random() > 0.5 ? 'var(--wax-red)' : 'var(--wax-highlight)';

    c.appendChild(f);
    requestAnimationFrame(() => f.classList.add('animate'));
  }
}

function resetLetterAnimations() {
  const content = document.getElementById('letter-content');
  if (!content) return;

  const els = content.querySelectorAll(
    '.letter-date, .letter-greeting, .letter-body p, .letter-closing, .letter-signature, .ornament-divider, .pressed-flower'
  );

  els.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
  });
}
