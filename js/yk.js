/* Utilidades compartilhadas entre Home e Projetos: cortina de transição e navegação entre páginas. */
window.YK = (() => {
  const EASE_CURTAIN = 'cubic-bezier(.76,0,.24,1)';
  const EASE_REVEAL = 'cubic-bezier(.16,1,.3,1)';
  let startedAt = 0;

  const curtain = () => document.querySelector('[data-curtain]');

  // Cortina sobe cobrindo a tela. `leave` = navegação entre páginas (texto some antes de trocar).
  function curtainIn(label, cb, leave) {
    const c = curtain();
    if (!c) { cb && cb(); return; }
    const t = c.firstElementChild, l = c.querySelector('[data-curtain-lab]');
    if (l) l.textContent = label || 'ARQUITETURA & INTERIORES';
    startedAt = performance.now();
    c.getAnimations().forEach(a => a.cancel());
    [t, l].forEach(x => x && x.getAnimations().forEach(a => a.cancel()));
    c.style.pointerEvents = 'auto';
    c.style.clipPath = 'inset(100% 0 0 0)';
    c.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }], { duration: 800, easing: EASE_CURTAIN, fill: 'forwards' });
    const txt = [{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }];
    t.animate(txt, { duration: 700, delay: 380, easing: EASE_REVEAL, fill: 'both' });
    l && l.animate(txt, { duration: 700, delay: 470, easing: EASE_REVEAL, fill: 'both' });
    if (leave) {
      setTimeout(() => { [t, l].forEach(x => x && x.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280, easing: 'ease', fill: 'forwards' })); }, 1250);
      setTimeout(() => cb && cb(), 1560);
    } else setTimeout(() => cb && cb(), 850);
  }

  // Cortina desce revelando a página. `minHold` = tempo mínimo (ms) desde o início da entrada.
  function curtainOut(minHold) {
    const c = curtain();
    if (!c) return;
    const go = () => {
      c.getAnimations().forEach(a => a.cancel());
      c.style.clipPath = 'inset(0% 0 0 0)';
      const t = c.firstElementChild, l = c.querySelector('[data-curtain-lab]');
      [t, l].forEach(x => x && x.animate([{ opacity: getComputedStyle(x).opacity }, { opacity: 0, transform: 'translateY(-16px)' }], { duration: 400, easing: 'ease', fill: 'forwards' }));
      c.animate([{ clipPath: 'inset(0% 0 0 0)' }, { clipPath: 'inset(100% 0 0 0)' }], { duration: 950, delay: 180, easing: EASE_CURTAIN, fill: 'forwards' })
        .onfinish = () => {
          c.style.pointerEvents = 'none';
          c.style.clipPath = 'inset(100% 0 0 0)';
          c.getAnimations().forEach(a => a.cancel());
          [t, l].forEach(x => x && x.getAnimations().forEach(a => a.cancel()));
        };
    };
    setTimeout(go, Math.max(0, (minHold || 0) - (performance.now() - startedAt)));
  }

  // Intercepta links entre páginas e navega com a cortina. Retorna função para desfazer.
  function bindPageLinks(re, label) {
    const onLink = e => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      const href = a.getAttribute('href');
      if (!re.test(href)) return;
      e.preventDefault(); e.stopPropagation();
      try { sessionStorage.setItem('yk-nav', '1'); } catch (_) {}
      curtainIn(label, () => { location.href = href; }, true);
    };
    document.addEventListener('click', onLink, true);
    return () => document.removeEventListener('click', onLink, true);
  }

  // Consome a flag de chegada vinda da outra página.
  function arrivedFromNav() {
    let v = false;
    try { v = sessionStorage.getItem('yk-nav') === '1'; sessionStorage.removeItem('yk-nav'); } catch (_) {}
    return v;
  }

  // Esconde o texto da cortina (página nova já abre coberta e só faz a descida).
  function hideCurtainText() {
    const c = curtain();
    if (c) [...c.children].forEach(x => { x.style.opacity = 0; });
  }

  return { curtainIn, curtainOut, bindPageLinks, arrivedFromNav, hideCurtainText };
})();
