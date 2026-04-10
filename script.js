/* ═══════════════════════════════════════════════
   A Letter For You — v4 Script
   Smooth single-scene transitions, no flashing
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  setLetterDate();
  generateRuledLines();
  generateParticles();

  const scene     = document.getElementById('scene');
  const envCont   = document.getElementById('envelope-container');
  const envelope  = document.getElementById('envelope');
  const seal      = document.getElementById('wax-seal');
  const hint      = document.getElementById('envelope-hint');
  const wrapper   = document.getElementById('letter-wrapper');
  const paper     = document.getElementById('letter-paper');
  const foldBtn   = document.getElementById('fold-btn');

  let state = 'closed'; // closed | animating | open

  seal.addEventListener('click', handleOpen);
  envelope.addEventListener('click', handleOpen);
  foldBtn.addEventListener('click', handleClose);


  /* ─── OPEN: seamless flow ─── */
  function handleOpen(e) {
    if (state !== 'closed') return;
    state = 'animating';
    e.stopPropagation();

    // Step 1: Hide hint
    hint.classList.add('hide');

    // Step 2: Break seal (0ms)
    seal.classList.add('cracking');
    spawnFragments();

    // Step 3: Open flap (after seal cracks, ~500ms)
    setTimeout(() => {
      envelope.classList.add('flap-open');
    }, 500);

    // Step 4: Start letter rising from envelope position (1.5s)
    setTimeout(() => {
      wrapper.classList.remove('folding');
      wrapper.classList.add('rising');
    }, 1500);

    // Step 5: Envelope slides down and fades (1.8s)
    setTimeout(() => {
      envCont.classList.add('opened');
    }, 1800);

    // Step 6: Text reveals start (staggered, smooth)
    // Wait for letter to finish rising (~2.5s for the transition)
    setTimeout(() => {
      revealText();
      state = 'open';
    }, 3200);
  }


  /* ─── CLOSE: seamless reverse ─── */
  function handleClose() {
    if (state !== 'open') return;
    state = 'animating';

    // Step 1: Hide fold button
    foldBtn.classList.remove('show');

    // Step 2: Hide all text
    hideText();

    // Step 3: Letter folds back (after text fades, ~600ms)
    setTimeout(() => {
      wrapper.classList.remove('rising');
      wrapper.classList.add('folding');
    }, 600);

    // Step 4: Envelope returns (after letter folds, ~1s)
    setTimeout(() => {
      envCont.classList.remove('opened');
    }, 1200);

    // Step 5: Reset everything (after full animation, ~2.5s)
    setTimeout(() => {
      // Reset envelope
      envelope.classList.remove('flap-open');
      seal.classList.remove('cracking');

      // Reset hint
      hint.classList.remove('hide');

      // Reset wrapper
      wrapper.classList.remove('folding');

      state = 'closed';
    }, 2800);
  }


  /* ─── Reveal text elements with staggered delays ─── */
  function revealText() {
    const els = document.querySelectorAll(
      '.letter-date, .letter-greeting, .divider, .letter-body p, .letter-closing, .letter-signature, .pressed-flower'
    );

    let delay = 0;
    els.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('reveal');
      }, delay);

      // Stagger: faster for date/greeting, slower for paragraphs
      if (i < 2) delay += 300;
      else delay += 450;
    });

    // Show fold button after all text has appeared
    setTimeout(() => {
      foldBtn.classList.add('show');
    }, delay + 200);
  }


  /* ─── Hide all text elements ─── */
  function hideText() {
    const els = document.querySelectorAll(
      '.letter-date, .letter-greeting, .divider, .letter-body p, .letter-closing, .letter-signature, .pressed-flower'
    );
    els.forEach(el => el.classList.remove('reveal'));
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
    l.className = 'rl';
    l.style.top = `${i * 36}px`;
    c.appendChild(l);
  }
}

function generateParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.top    = `${Math.random() * 100}%`;
    p.style.left   = `${Math.random() * 100}%`;
    p.style.width  = `${1.5 + Math.random() * 2.5}px`;
    p.style.height = p.style.width;
    p.style.background = Math.random() > 0.3
      ? `rgba(245, 196, 108, ${0.2 + Math.random() * 0.3})`
      : `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`;
    p.style.setProperty('--dur',   `${7 + Math.random() * 8}s`);
    p.style.setProperty('--delay', `${Math.random() * 6}s`);
    p.style.setProperty('--dx',    `${-20 + Math.random() * 40}px`);
    p.style.setProperty('--dy',    `${-35 + Math.random() * 15}px`);
    p.style.setProperty('--peak',  `${0.3 + Math.random() * 0.4}`);
    c.appendChild(p);
  }
}

function spawnFragments() {
  const c = document.getElementById('seal-fragments');
  if (!c) return;
  c.innerHTML = '';

  for (let i = 0; i < 8; i++) {
    const f = document.createElement('div');
    f.className = 'frag';

    const a = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.6;
    const d = 30 + Math.random() * 40;

    f.style.setProperty('--fx', `${Math.cos(a) * d}px`);
    f.style.setProperty('--fy', `${Math.sin(a) * d}px`);
    f.style.setProperty('--fr', `${Math.random() * 360}deg`);
    f.style.width  = `${4 + Math.random() * 6}px`;
    f.style.height = `${4 + Math.random() * 6}px`;
    f.style.background = Math.random() > 0.5 ? 'var(--wax-red)' : 'var(--wax-hi)';

    c.appendChild(f);
    requestAnimationFrame(() => f.classList.add('go'));
  }
}
