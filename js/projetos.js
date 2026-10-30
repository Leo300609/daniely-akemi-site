/* Projetos — listas Residencial/Comercial, página do projeto, lightbox. Roteamento por hash. */
(() => {
  const PROJECTS = [
    { id: 'sm', cat: 'residencial', name: 'Projeto S.M', meta: 'Apartamento', n: 12 },
    { id: 'nf', cat: 'residencial', name: 'Projeto N.F', meta: 'Residência', n: 15 },
    { id: 'jw', cat: 'residencial', name: 'Projeto J.W', meta: 'Apartamento', n: 13 },
    { id: 'hr', cat: 'residencial', name: 'Projeto H.R', meta: 'Banheiros', n: 7 },
    { id: 'obento', cat: 'comercial', name: 'Obento do Japa', meta: 'Restaurante · Suzano', n: 14 },
    { id: 'obento2', cat: 'comercial', name: 'Obento do Japa II', meta: 'Restaurante · Unidade II', n: 4 },
    { id: 'santahelena', cat: 'comercial', name: 'Projeto Santa Helena', meta: 'Espaço corporativo', n: 15 },
    { id: 'ierc', cat: 'comercial', name: 'Projeto IERC', meta: 'Auditório', n: 9 }
  ];
  const TABS = {
    residencial: { title: 'Residenciais', desc: 'Conheça alguns de nossos lindos e funcionais projetos residenciais, com a marca e conceito Daniely Akemi.' },
    comercial: { title: 'Comerciais', desc: 'Espaços comerciais pensados para a identidade da marca e para a experiência de quem visita.' }
  };
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const img = (p, i) => `img/p/${p.id}/${String(i + 1).padStart(2, '0')}.jpg`;
  const pad2 = n => String(n).padStart(2, '0');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $('#app'), pnav = $('#pnav'), lbEl = $('#lb');

  const state = { tab: 'residencial', pid: null, lb: -1 };
  let busy = false, skipDU = false, io = null, animTimer = 0;
  const current = () => PROJECTS.find(x => x.id === state.pid);

  /* ---------- Templates ---------- */
  function listHTML() {
    const t = TABS[state.tab], list = PROJECTS.filter(p => p.cat === state.tab);
    return `
    <section class="plist" data-view="list">
      <div class="plist-head">
        <div>
          <div class="ovh"><div class="eyebrow" data-in>PORTFÓLIO · ${state.tab.toUpperCase()}</div></div>
          <h1 class="plist-title">
            <span class="rline"><span data-in style="display:block">Projetos</span></span>
            <span class="rline script"><span class="script" data-in style="display:block">${t.title}</span></span>
          </h1>
        </div>
        <p class="plist-desc" data-in>${t.desc}</p>
      </div>
      <div class="cards">
        ${list.map((c, i) => `
        <a class="card" href="#p=${c.id}" data-go="p=${c.id}">
          <div class="card-img" data-cardimg>
            <img src="${img(c, 0)}" alt="${c.name}">
            <div class="card-shade"></div>
            <span class="card-num">${pad2(i + 1)} — ${pad2(c.n)} FOTOS</span>
            <span class="card-go">VER PROJETO <span>→</span></span>
          </div>
          <div class="card-cap"><span class="card-name">${c.name}</span><span class="card-meta">${c.meta}</span></div>
        </a>`).join('')}
      </div>
    </section>`;
  }

  function detailHTML(p) {
    const all = PROJECTS.filter(x => x.cat === p.cat), idx = all.indexOf(p), next = all[(idx + 1) % all.length];
    return `
    <div data-view="detail">
      <section class="dcover">
        <div class="dcover-img" data-dcover><img src="${img(p, 0)}" alt="${p.name}"></div>
        <div class="dcover-shade"></div>
        <div class="dcover-info">
          <div>
            <div class="ovh"><div class="dcover-cat" data-in>${p.cat.toUpperCase()} · ${pad2(idx + 1)} / ${pad2(all.length)}</div></div>
            <h1 class="dcover-title"><span class="rline"><span data-in style="display:block">${p.name}</span></span></h1>
          </div>
          <div class="dcover-facts" data-in>
            <div><small>TIPO</small><span>${p.meta}</span></div>
            <div><small>IMAGENS</small><span>${pad2(p.n)}</span></div>
          </div>
        </div>
      </section>
      <div class="dbar">
        <a class="dback" href="#${p.cat}" data-go="${p.cat}"><span>←</span> TODOS OS PROJETOS</a>
        <span class="dhint">CLIQUE NAS IMAGENS PARA AMPLIAR</span>
      </div>
      <div class="gallery">
        ${Array.from({ length: p.n }, (_, i) => `
        <figure data-gimg data-open="${i}"><img src="${img(p, i)}" alt="${p.name} ${i + 1}" loading="lazy"></figure>`).join('')}
      </div>
      <a class="dnext" href="#p=${next.id}" data-go="p=${next.id}">
        <img src="${img(next, 0)}" alt="${next.name}">
        <div class="dnext-info">
          <div><div class="dnext-lab">PRÓXIMO PROJETO</div><div class="dnext-name">${next.name}</div></div>
          <span class="dnext-arrow">→</span>
        </div>
      </a>
    </div>`;
  }

  /* ---------- Estado e render ---------- */
  function render() {
    const p = current();
    app.innerHTML = p ? detailHTML(p) : listHTML();
    pnav.dataset.tab = state.tab;
    document.title = (p ? p.name : 'Projetos ' + TABS[state.tab].title) + ' · Daniely Akemi Arquitetura';
  }

  // Aplica mudança de estado; re-renderiza e agenda a animação de entrada quando tab/pid mudam.
  function setState(patch, { silent } = {}) {
    const prev = { ...state };
    Object.assign(state, patch);
    if (prev.tab !== state.tab || prev.pid !== state.pid) {
      render();
      if (!silent && !skipDU) {
        clearTimeout(animTimer);
        if (prev.pid === state.pid) animateIn(); else animTimer = setTimeout(animateIn, 450);
      }
    }
    if (prev.lb !== state.lb) renderLb(prev.lb);
  }

  function readHash(silent) {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith('p=')) {
      const p = PROJECTS.find(x => x.id === h.slice(2));
      if (p) { setState({ pid: p.id, tab: p.cat, lb: -1 }, { silent }); scrollTo(0, 0); return; }
    }
    if (TABS[h]) { setState({ tab: h, pid: null, lb: -1 }, { silent }); return; }
    setState({ pid: null, lb: -1 }, { silent });
  }

  /* ---------- Navegação ---------- */
  function nav(hash) {
    if (busy) return; busy = true;
    const p = PROJECTS.find(x => 'p=' + x.id === hash);
    const v = $('[data-view="list"]');

    // Residencial <-> Comercial: sem cortina, só fade da lista
    if (TABS[hash] && !state.pid && v) {
      if (hash === state.tab) { busy = false; return; }
      v.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(24px)' }], { duration: 420, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' })
        .onfinish = () => {
          history.pushState(null, '', '#' + hash);
          skipDU = true;
          setState({ tab: hash, pid: null, lb: -1 });
          skipDU = false;
          animateIn();
          setTimeout(() => { busy = false; }, 300);
        };
      return;
    }

    // Demais casos: cortina
    YK.curtainIn(p ? p.name.toUpperCase() : (TABS[hash] ? 'PROJETOS ' + TABS[hash].title.toUpperCase() : ''), () => {
      if (location.hash === '#' + hash) readHash(); else location.hash = hash;
      scrollTo({ top: 0, behavior: 'instant' });
      const want = p ? p.id : null, t0 = performance.now();
      const ready = () => {
        const ok = state.pid === want && (!TABS[hash] || state.tab === hash);
        const im = $(p ? '[data-dcover] img' : '[data-cardimg] img');
        const loaded = im && im.complete && im.naturalWidth > 0;
        if ((ok && loaded) || performance.now() - t0 > 1500) {
          requestAnimationFrame(() => { YK.curtainOut(1700); setTimeout(() => { busy = false; }, 1200); });
        } else setTimeout(ready, 40);
      };
      setTimeout(ready, 40);
    });
  }

  /* ---------- Animações de entrada ---------- */
  function animateIn() {
    $$('[data-in]').forEach((el, i) => el.animate([{ transform: 'translateY(110%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 1200, delay: 80 + i * 90, easing: EASE, fill: 'backwards' }));
    $$('[data-cardimg]').forEach((c, i) => {
      c.animate([{ clipPath: 'inset(100% 0 0 0 round 24px)' }, { clipPath: 'inset(0% 0 0 0 round 24px)' }], { duration: 1400, delay: 250 + i * 120, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'backwards' });
      const im = $('img', c); im && im.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 2000, delay: 250 + i * 120, easing: EASE, fill: 'backwards' });
      const cap = c.parentElement.lastElementChild;
      cap && cap.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 600 + i * 120, easing: EASE, fill: 'backwards' });
    });
    const cov = $('[data-dcover]');
    if (cov) {
      cov.animate([{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)' }], { duration: 1400, easing: 'cubic-bezier(.76,0,.24,1)' });
      cov.firstElementChild.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 2400, easing: EASE });
    }
    io && io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target); e.target.style.opacity = '';
      e.target.animate([{ opacity: 0, transform: 'translateY(60px)', clipPath: 'inset(12% 0 0 0 round 16px)' }, { opacity: 1, transform: 'none', clipPath: 'inset(0% 0 0 0 round 16px)' }], { duration: 1200, easing: EASE, fill: 'backwards' });
    }), { rootMargin: '0px 0px -8% 0px' });
    $$('[data-gimg]').forEach(g => {
      const r = g.getBoundingClientRect();
      if (r.top > innerHeight * .92) { g.style.opacity = 0; io.observe(g); }
      else g.animate([{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }], { duration: 1100, delay: 500, easing: EASE, fill: 'backwards' });
    });
  }

  /* ---------- Lightbox ---------- */
  function renderLb(prevLb) {
    const p = current();
    if (!p || state.lb < 0) {
      lbEl.hidden = true; lbEl.innerHTML = '';
      document.documentElement.style.overflow = '';
      return;
    }
    if (prevLb < 0) {
      lbEl.innerHTML = `
        <div class="lb-top"><span data-lbtitle></span><button class="lb-close" data-lbclose>FECHAR ✕</button></div>
        <div class="lb-stage" data-lbbg>
          <img data-lbimg src="" alt="${p.name}">
          <button class="lb-arrow prev" data-lbprev aria-label="Anterior">←</button>
          <button class="lb-arrow next" data-lbnext aria-label="Próxima">→</button>
        </div>
        <div class="lb-thumbs">${Array.from({ length: p.n }, (_, i) => `<button data-lbthumb="${i}" aria-label="Foto ${i + 1}"><img src="${img(p, i)}" alt="" loading="lazy"></button>`).join('')}</div>`;
      lbEl.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      lbEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400, easing: 'ease' });
    }
    const im = $('[data-lbimg]', lbEl);
    im.src = img(p, state.lb);
    im.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: EASE });
    $('[data-lbtitle]', lbEl).textContent = `${p.name} — ${pad2(state.lb + 1)} / ${pad2(p.n)}`;
    $$('[data-lbthumb]', lbEl).forEach((b, i) => b.classList.toggle('on', i === state.lb));
    const active = $('[data-lbthumb].on', lbEl);
    active && active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: prevLb < 0 ? 'instant' : 'smooth' });
  }
  function lbStep(d) {
    const p = current(); if (!p || state.lb < 0) return;
    setState({ lb: (state.lb + d + p.n) % p.n });
  }

  /* ---------- Eventos ---------- */
  function bind() {
    document.addEventListener('click', e => {
      const t = e.target;
      const go = t.closest && t.closest('[data-go]');
      if (go && !e.metaKey && !e.ctrlKey) { e.preventDefault(); nav(go.dataset.go); return; }
      const tab = t.closest && t.closest('.pill button');
      if (tab) { nav(tab.dataset.tab); return; }
      const op = t.closest && t.closest('[data-open]');
      if (op) { setState({ lb: +op.dataset.open }); return; }
      if (!lbEl.hidden) {
        if (t.closest('[data-lbclose]')) setState({ lb: -1 });
        else if (t.closest('[data-lbprev]')) lbStep(-1);
        else if (t.closest('[data-lbnext]')) lbStep(1);
        else if (t.closest('[data-lbthumb]')) setState({ lb: +t.closest('[data-lbthumb]').dataset.lbthumb });
        else if (t.closest('[data-lbbg]') && !t.closest('[data-lbimg]')) setState({ lb: -1 });
      }
    });
    addEventListener('hashchange', () => readHash());
    addEventListener('keydown', e => {
      if (state.lb < 0) return;
      if (e.key === 'Escape') setState({ lb: -1 });
      if (e.key === 'ArrowRight') lbStep(1);
      if (e.key === 'ArrowLeft') lbStep(-1);
    });
    addEventListener('pageshow', e => { if (e.persisted) { busy = false; YK.curtainOut(); } });
    YK.bindPageLinks(/^index\.html/, 'INÍCIO');
  }

  /* ---------- Init ---------- */
  readHash(true);
  render();
  bind();
  if (YK.arrivedFromNav()) YK.hideCurtainText();
  $('[data-curtain]').style.clipPath = 'inset(0% 0 0 0)';
  requestAnimationFrame(() => document.documentElement.removeAttribute('data-yknav'));
  setTimeout(() => { YK.curtainOut(); animateIn(); }, 80);
})();
