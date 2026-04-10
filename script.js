// ─── Handwritten Letter — Script ─── //

document.addEventListener('DOMContentLoaded', () => {
  // Date formatting
  const dateEl = document.getElementById('letter-date');
  if (dateEl) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', options);
  }

  // Generate ruled lines
  generateRuledLines();

  // Envelope interaction
  const seal = document.getElementById('wax-seal');
  const envelope = document.getElementById('envelope');
  const envelopeScene = document.getElementById('envelope-scene');
  const letterScene = document.getElementById('letter-scene');

  if (seal) {
    seal.addEventListener('click', handleSealClick);
    envelope.addEventListener('click', handleSealClick);
  }

  let opened = false;

  function handleSealClick(e) {
    if (opened) return;
    opened = true;
    e.stopPropagation();

    // Break the wax seal
    seal.classList.add('breaking');

    // Open the envelope flap after seal breaks
    setTimeout(() => {
      envelope.classList.add('opened');
    }, 500);

    // Transition to the letter
    setTimeout(() => {
      envelopeScene.classList.add('fade-out');
    }, 1400);

    setTimeout(() => {
      envelopeScene.classList.add('hidden');
      letterScene.classList.remove('hidden');
    }, 2200);
  }
});

function generateRuledLines() {
  const container = document.getElementById('ruled-lines');
  if (!container) return;

  const lineSpacing = 38; // px between lines
  const lineCount = 20;

  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'rule-line';
    line.style.top = `${i * lineSpacing}px`;
    container.appendChild(line);
  }
}
