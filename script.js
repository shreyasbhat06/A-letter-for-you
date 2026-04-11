/* ═══════════════════════════════════════════════
   A Letter For You — v5 Script
   Smoother timing to eliminate flash
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  setLetterDate();
  generateRuledLines();
  generateParticles();

  const envCont  = document.getElementById('envelope-container');
  const envelope = document.getElementById('envelope');
  const seal     = document.getElementById('wax-seal');
  const hint     = document.getElementById('envelope-hint');
  const wrapper  = document.getElementById('letter-wrapper');
  const foldBtn  = document.getElementById('fold-btn');

  let state = 'closed'; // closed | animating | open

  seal.addEventListener('click', handleOpen);
  envelope.addEventListener('click', handleOpen);
  foldBtn.addEventListener('click', handleClose);


  /* ─── OPEN ─── */
  function handleOpen(e) {
    if (state !== 'closed') return;
    state = 'animating';
    e.stopPropagation();

    // 1. Fade hint (immediately)
    hint.classList.add('hide');

    // 2. Crack seal + fragments (0ms)
    seal.classList.add('cracking');
    spawnFragments();

    // 3. Open flap (after seal starts cracking)
    setTimeout(() => {
      envelope.classList.add('flap-open');
    }, 600);

    // 4. Letter starts rising (overlapping with flap opening)
    //    Start it early so the letter rises WHILE envelope is still visible
    setTimeout(() => {
      wrapper.classList.remove('folding');
      wrapper.classList.add('rising');
    }, 1800);

    // 5. Envelope fades out (starts AFTER letter has begun rising)
    //    Overlapping transitions = no gap/flash
    setTimeout(() => {
      envCont.classList.add('opened');
    }, 2200);

    // 6. Text reveals (staggered) — after letter has mostly risen
    setTimeout(() => {
      revealText();
      state = 'open';
    }, 4000);
  }


  /* ─── CLOSE ─── */
  function handleClose() {
    if (state !== 'open') return;
    state = 'animating';

    // 1. Hide fold button
    foldBtn.classList.remove('show');

    // 2. Hide text
    hideText();

    // 3. Letter folds back
    setTimeout(() => {
      wrapper.classList.remove('rising');
      wrapper.classList.add('folding');
    }, 700);

    // 4. Envelope returns
    setTimeout(() => {
      envCont.classList.remove('opened');
    }, 1400);

    // 5. Full reset
    setTimeout(() => {
      envelope.classList.remove('flap-open');
      seal.classList.remove('cracking');
      hint.classList.remove('hide');
      wrapper.classList.remove('folding');
      state = 'closed';
    }, 3200);
  }


  /* ─── Staggered text reveal ─── */
  function revealText() {
    const els = document.querySelectorAll(
      '.letter-date, .letter-greeting, .divider, .letter-body p, .letter-closing, .letter-signature, .pressed-flower-letter'
    );

    let delay = 0;
    els.forEach((el, i) => {
      setTimeout(() => el.classList.add('reveal'), delay);
      // Gentle stagger
      if (i < 2) delay += 350;
      else delay += 500;
    });

    // Show fold button after all text
    setTimeout(() => foldBtn.classList.add('show'), delay + 300);
  }

  function hideText() {
    document.querySelectorAll(
      '.letter-date, .letter-greeting, .divider, .letter-body p, .letter-closing, .letter-signature, .pressed-flower-letter'
    ).forEach(el => el.classList.remove('reveal'));
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
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.top  = `${Math.random() * 100}%`;
    p.style.left = `${Math.random() * 100}%`;
    const s = 1.5 + Math.random() * 2.5;
    p.style.width  = `${s}px`;
    p.style.height = `${s}px`;
    p.style.background = Math.random() > 0.3
      ? `rgba(245,196,108,${0.15 + Math.random() * 0.25})`
      : `rgba(255,255,255,${0.08 + Math.random() * 0.12})`;
    p.style.setProperty('--dur',   `${8 + Math.random() * 8}s`);
    p.style.setProperty('--delay', `${Math.random() * 6}s`);
    p.style.setProperty('--dx',    `${-18 + Math.random() * 36}px`);
    p.style.setProperty('--dy',    `${-30 + Math.random() * 12}px`);
    p.style.setProperty('--peak',  `${0.25 + Math.random() * 0.35}`);
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
