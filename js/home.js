/* Home — preloader, reveals, parallax, cursor, sliders, lightbox */
(() => {
  const RES = [
    ['res1.png', 'Studio integrado'], ['res2.png', 'Suíte'], ['res3.png', 'Cozinha'], ['res4.png', 'Living'],
    ['res5.png', 'Cozinha e jantar'], ['res6.png', 'Quarto infantil'], ['res7.png', 'Quarto gamer']
  ];
  const SIZES = [
    ['clamp(280px,34vw,560px)', 'clamp(260px,52vh,520px)'], ['clamp(220px,24vw,380px)', 'clamp(220px,40vh,400px)'],
    ['clamp(260px,30vw,480px)', 'clamp(240px,46vh,460px)'], ['clamp(220px,22vw,360px)', 'clamp(260px,52vh,520px)']
  ];
  const COMS = [
    ['cm1.png', 'Salão em pé-direito duplo', 'Luminárias pendentes e composição botânica.'],
    ['cm2.png', 'Estofados sob medida', 'Conforto e ritmo no salão.'],
    ['cm3.png', 'Jardim vertical', 'Assinatura da marca no ponto focal.'],
    ['cm4.png', 'Identidade na parede', 'O nome da marca como protagonista do espaço.']
  ];
  const HOTS = [
    { x: '46%', y: '16%', tag: 'ILUMINAÇÃO', title: 'Luminárias pendentes em diferentes alturas' },
    { x: '70%', y: '70%', tag: 'PAISAGISMO', title: 'Composição botânica no pé-direito duplo' },
    { x: '49%', y: '66%', tag: 'MARCENARIA', title: 'Estofado contínuo sob medida' }
  ];
  const STEPS = [
    ['01', 'Briefing', 'Conversa para entender rotina, estilo e necessidades de cada cliente.'],
    ['02', 'Estudo preliminar', 'Layout e conceito do espaço, com as primeiras referências.'],
    ['03', 'Projeto 3D', 'Imagens realistas para visualizar cada ambiente antes da obra.'],
    ['04', 'Projeto executivo', 'Detalhamento técnico completo para fornecedores e obra.'],
    ['05', 'Acompanhamento', 'Visitas de obra pensando em cada detalhe até a entrega.']
  ];
  const TESTS = [
    ['t1.png', 'Nadine e Fernando', 'Nós conhecemos a Daniely já há alguns anos e recentemente passamos a acompanhar mais de perto seu trabalho. Quando decidimos fazer um projeto de interiores da nossa casa não tivemos dúvida que seria ela a escolhida. Sempre super atenta ao mercado e tendências, logo nas primeiras reuniões já conseguiu captar nosso estilo e nos apresentar um projeto com a nossa identidade e com nosso jeito, sempre atenciosa às nossas dúvidas. Além disso, acompanhou a obra, sempre pensando em cada detalhe, garantindo que tudo ficasse perfeito. Somos muito gratos pelo seu trabalho!! Por toda responsabilidade e dedicação com nosso projeto, que para nós é a realização de um sonho.'],
    ['t2.png', 'Ana Kelly', 'Tive o privilégio de realizar o projeto do meu apartamento, com a arquiteta Daniely Akemi, e posso afirmar que foi um dos melhores investimentos que fiz. Sempre muito atenciosa, cuidadosa e sensível, a Daniely conseguiu captar exatamente o que eu queria e transformou o meu pequeno espaço em um ambiente lindo e aconchegante.'],
    ['t3.png', 'Jessica e Weizer', 'A Daniely tem um traço marcante que a destaca, da criatividade (que transborda), cada detalhe, cada traço e a leitura perfeita do perfil do cliente. Ela desenhou os nossos sonhos e está nos ajudando a realizar, nos conquistou pela tua simplicidade e competência.'],
    ['t4.png', 'Helena e Ricardo', 'Agradecemos a Dani pelo profissionalismo, carinho e dedicação pelo nosso projeto!!'],
    ['t5.png', 'Sara Priscila', 'O que falar dessa arquiteta maravilhosa que fez o meu projeto com tanto amor e carinho, conheço a Tico (como chamamos carinhosamente) há um bom tempo e hoje fico muito orgulhosa da mulher e da arquiteta maravilhosa que se tornou e eu não pensei 2x em dividir esse sonho com ela, o projeto do meu apto ficou maravilhoso do jeitinho que sempre sonhei, ela juntou todas as informações passadas por mim com o bom gosto dela e ficou o projeto mais lindo da vida e não vejo a hora de iniciar as reformas e ver ele pronto! Gratidão por sua vida Tico.']
  ];
  const ABOUT_N = 8;
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const pad2 = n => String(n).padStart(2, '0');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const state = { hot: -1, hover: -1, com: 1, t: 0, lb: -1 };
  let exited = false, dead = false, fallback = 0;
  let px = innerWidth / 2, py = innerHeight / 2, rx = px, ry = py, mx = 0, my = 0, cx = 0, cy = 0;
  let fine = false, navOn = null, chk = 0;
  let abCur = null, aStart = 0, testTimer = 0;
  let io;

  /* ---------- Render das listas ---------- */
  function renderLists() {
    $('#hots').innerHTML = HOTS.map(h => `
      <div class="hot" style="left:${h.x};top:${h.y}">
        <button class="hot-btn" data-cursor="+" aria-label="${esc(h.title)}"><span class="hot-pulse" data-pulse></span><span class="hot-core"></span></button>
        <div class="hot-tip"><div class="hot-tag">${h.tag}</div><div class="hot-title">${h.title}</div></div>
      </div>`).join('');

    $('#about-imgs').innerHTML = Array.from({ length: ABOUT_N }, (_, i) =>
      `<img data-abimg src="img/dani${i + 1}.png" alt="Daniely Akemi" ${i ? 'loading="lazy"' : ''}>`).join('');
    $('#about-bars').innerHTML = Array.from({ length: ABOUT_N }, (_, i) =>
      `<button aria-label="Foto ${i + 1}" data-ab="${i}"><span><i data-afill></i></span></button>`).join('');

    const cta = $('#res-cta');
    cta.insertAdjacentHTML('beforebegin', RES.map(([src, title], i) => `
      <figure class="res-item" data-res="${i}" data-cursor="Ver" style="width:${SIZES[i % 4][0]}">
        <div class="ph" style="height:${SIZES[i % 4][1]}"><img data-hpar src="img/${src}" alt="${title}" draggable="false"></div>
        <figcaption><span>${title}</span><span>${pad2(i + 1)}</span></figcaption>
      </figure>`).join(''));

    $('#com-row').innerHTML = COMS.map(([src, title, desc], i) => `
      <div class="com-item${state.com === i ? ' active' : ''}" data-com="${i}" data-cursor="Ver">
        <img src="img/${src}" alt="${title}">
        <div class="com-shade"></div>
        <div class="com-num">${pad2(i + 1)}</div>
        <div class="com-cap"><b>${title}</b><span>${desc}</span></div>
      </div>`).join('');

    $('#steps').insertAdjacentHTML('beforeend', STEPS.map(([n, t, d]) => `
      <div class="step" data-step>
        <span class="step-dot"></span>
        <div class="step-n">${n}</div><div class="step-t">${t}</div><div class="step-d">${d}</div>
      </div>`).join(''));

    $('#t-list').innerHTML = TESTS.map(([img, name], i) => `
      <button class="t-item${i === state.t ? ' active' : ''}" data-t="${i}" data-cursor="Ler"><img src="img/${img}" alt=""><span>${name}</span><i></i></button>`).join('');
    $('#t-panels').innerHTML = TESTS.map(([, name, text], i) => `
      <div class="t-panel${i === state.t ? ' active' : ''}"><div class="t-q">“</div><p>${text}</p>
        <div class="t-by"><i></i><span>${name.toUpperCase()}</span></div></div>`).join('');
  }

  /* ---------- Reveals ---------- */
  function show(el) {
    const d = parseFloat(el.getAttribute('data-d')) || 0;
    if (el.hasAttribute('data-count')) {
      const to = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', t0 = performance.now() + d * 1000;
      const f = now => {
        const p = Math.max(0, Math.min(1, (now - t0) / 2000)), e = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(to * e) + suf;
        if (p < 1 && !dead) requestAnimationFrame(f);
      };
      requestAnimationFrame(f);
      return;
    }
    el.style.transition = `transform 1.3s ${EASE} ${d}s, opacity 1.1s ease ${d}s, clip-path 1.4s cubic-bezier(.76,0,.24,1) ${d}s`;
    el.style.transform = 'none';
    el.style.opacity = '1';
    if (el.hasAttribute('data-mask')) {
      el.dataset.shown = '1';
      el.style.clipPath = 'inset(0% 0 0 0)';
      $$('[data-mask-img]', el).forEach(i => { i.style.transition = `transform 2s ${EASE} ${d}s`; i.style.transform = 'scale(1)'; });
    }
  }

  // Revela o hero (títulos por linha, cards, zoom da imagem de fundo).
  function revealHero() {
    if (exited) return;
    exited = true; clearTimeout(fallback);
    $$('[data-hero]').forEach(show);
    const img = $('[data-heroimg]');
    img.style.transition = 'transform 2.8s cubic-bezier(.16,1,.3,1)';
    img.style.transform = 'scale(1)';
  }

  function initEntry() {
    YK.bindPageLinks(/^projetos\.html/, 'PORTFÓLIO');
    const fromNav = YK.arrivedFromNav() || document.documentElement.hasAttribute('data-yknav');
    const img = $('[data-heroimg]');
    // espera a imagem do hero (máx. 1,5s) para a revelação não acontecer sobre fundo vazio
    const ready = new Promise(res => {
      if (img.complete) return res();
      img.addEventListener('load', res, { once: true });
      img.addEventListener('error', res, { once: true });
    });
    fallback = setTimeout(revealHero, 1500);
    if (fromNav) {
      $('[data-curtain]').style.clipPath = 'inset(0% 0 0 0)';
      YK.hideCurtainText();
      document.documentElement.removeAttribute('data-yknav');
      ready.then(() => setTimeout(() => { revealHero(); YK.curtainOut(); }, 150));
    } else {
      ready.then(() => setTimeout(revealHero, 100));
    }
    addEventListener('pageshow', e => { if (e.persisted) YK.curtainOut(); });
  }

  function initReveals() {
    io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const t = e.target; io.unobserve(t);
      if (t.hasAttribute('data-line')) $$('[data-r]', t).forEach(show);
      else show(t);
    }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    // linhas de texto: o container (.rline / .ovh) é observado e revela os [data-r] dentro dele
    $$('.rline, .ovh').forEach(w => w.setAttribute('data-line', ''));
    $$('[data-line]').filter(w => !w.querySelector('[data-hero]')).forEach(w => io.observe(w));
    $$('[data-fade],[data-mask],[data-count]').filter(el => !el.hasAttribute('data-hero')).forEach(el => io.observe(el));
    $$('[data-pulse]').forEach((el, i) => el.animate([{ transform: 'scale(1)', opacity: .9 }, { transform: 'scale(3)', opacity: 0 }], { duration: 2000, delay: i * 400, iterations: Infinity, easing: 'ease-out' }));
  }

  /* ---------- Hotspots do hero ---------- */
  function updateHots() {
    const open = state.hot >= 0 ? state.hot : state.hover;
    $$('.hot').forEach((h, i) => h.classList.toggle('open', i === open));
  }

  /* ---------- Sobre: crossfade com duas camadas (anima só clip-path/transform das camadas) ---------- */
  function goAbout(i) {
    const imgs = $$('[data-abimg]'); if (!imgs.length) return;
    const cur = abCur ?? -1; aStart = performance.now();
    if (i === cur) return;
    const E = 'cubic-bezier(.65,0,.35,1)';
    imgs.forEach((im, k) => {
      if (k === cur) { im.style.zIndex = 1; return; }
      if (k === i) return;
      im.getAnimations().forEach(a => a.cancel());
      im.style.zIndex = 0; im.style.clipPath = 'inset(100% 0 0 0)'; im.style.transform = 'scale(1)';
    });
    const nx = imgs[i]; nx.getAnimations().forEach(a => a.cancel());
    nx.style.zIndex = 2; nx.style.clipPath = 'inset(0% 0 0 0)'; nx.style.transform = 'scale(1)';
    if (cur < 0) { abCur = i; return; }
    nx.animate([{ clipPath: 'inset(100% 0 0 0)', transform: 'scale(1.14)' }, { clipPath: 'inset(0% 0 0 0)', transform: 'scale(1)' }], { duration: 1700, easing: E });
    imgs[cur].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06) translateY(-2%)' }], { duration: 1700, easing: E, fill: 'forwards' });
    abCur = i;
    const n = $('[data-abnum]'); if (n) n.textContent = pad2(i + 1) + ' / ' + pad2(ABOUT_N);
  }

  /* ---------- Trilho horizontal (Residencial): scroll livre com inércia ---------- */
  function initTrack() {
    const tr = $('[data-htrack]');
    tr._t = tr.scrollLeft; tr._v = 0;
    let down = false, sx = 0, st = 0, lx = 0, lt = 0, moved = 0;
    tr.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; sx = lx = e.clientX; lt = performance.now();
      st = tr._t = tr.scrollLeft; tr._v = 0; tr._anim = true; tr.style.cursor = 'grabbing';
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const now = performance.now();
      tr._v = (lx - e.clientX) / Math.max(1, now - lt) * 16; lx = e.clientX; lt = now;
      moved = Math.max(moved, Math.abs(e.clientX - sx)); tr._t = st - (e.clientX - sx);
    });
    addEventListener('pointerup', () => { if (!down) return; down = false; tr.style.cursor = 'grab'; tr._coast = true; });
    tr.addEventListener('click', e => { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
    tr.addEventListener('scroll', () => { if (!tr._anim) tr._t = tr.scrollLeft; }, { passive: true });
    const step = d => {
      const f = $('figure', tr);
      tr._coast = false; tr._t = (tr._anim ? tr._t : tr.scrollLeft) + d * (f ? f.offsetWidth + 24 : 400); tr._anim = true;
    };
    $('#res-prev').addEventListener('click', () => step(-1));
    $('#res-next').addEventListener('click', () => step(1));
    tr.addEventListener('click', e => {
      const fig = e.target.closest('[data-res]'); if (fig) openLb(+fig.dataset.res);
    });
  }

  /* ---------- Lightbox ---------- */
  function openLb(i) {
    const first = state.lb < 0;
    state.lb = (i + RES.length) % RES.length;
    $('#lb-img').src = 'img/' + RES[state.lb][0];
    $('#lb-img').alt = RES[state.lb][1];
    $('#lb-title').textContent = `${pad2(state.lb + 1)} / ${pad2(RES.length)} — ${RES[state.lb][1]}`;
    $('#lb').classList.add('open');
    if (first) document.documentElement.style.overflow = 'hidden';  }
  function closeLb() {
    state.lb = -1; $('#lb').classList.remove('open');
    if (exited) document.documentElement.style.overflow = '';
  }

  /* ---------- Depoimentos ---------- */
  function setTest(i) {
    state.t = (i + TESTS.length) % TESTS.length;
    $$('.t-item').forEach((el, k) => el.classList.toggle('active', k === state.t));
    $$('.t-panel').forEach((el, k) => el.classList.toggle('active', k === state.t));
  }
  function restartTestTimer() {
    clearInterval(testTimer);
    testTimer = setInterval(() => setTest(state.t + 1), 9000);
  }

  /* ---------- Cursor / interações globais ---------- */
  function initPointer() {
    const dot = $('[data-cur-dot]'), ring = $('[data-cur-ring]'), lab = $('[data-cur-label]');
    fine = matchMedia('(pointer:fine)').matches;
    const mags = $$('[data-mag]');
    addEventListener('mousemove', e => {
      px = e.clientX; py = e.clientY;
      mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5;
      if (fine) { dot.style.opacity = 1; ring.style.opacity = 1; }
      mags.forEach(el => {
        const r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
        el.style.transition = near ? 'transform .2s ease-out' : `transform .8s ${EASE}`;
        el.style.transform = near ? `translate(${dx * .25}px,${dy * .3}px)` : '';
      });
    });
    addEventListener('mouseover', e => {
      const t = e.target.closest && e.target.closest('[data-cursor],a,button,input,textarea');
      const label = t && t.getAttribute('data-cursor');
      const big = !!label, mid = !!t && !label, s = big ? 84 : mid ? 56 : 40;
      Object.assign(ring.style, { width: s + 'px', height: s + 'px', margin: `-${s / 2}px 0 0 -${s / 2}px`, background: big ? 'rgba(140,106,60,.92)' : 'transparent', borderColor: big ? 'transparent' : '#B08D57' });
      lab.textContent = big ? label.toUpperCase() : ''; lab.style.opacity = big ? 1 : 0;
      dot.style.opacity = fine ? (big ? 0 : 1) : 0;
    });
    if (fine) $('[data-yk]').style.cursor = 'none';
  }

  function initEvents() {
    $$('.hot').forEach((h, i) => {
      const b = $('.hot-btn', h);
      b.addEventListener('click', () => { state.hot = state.hot === i ? -1 : i; updateHots(); });
      b.addEventListener('mouseenter', () => { state.hover = i; updateHots(); });
      b.addEventListener('mouseleave', () => { state.hover = -1; updateHots(); });
    });
    $$('[data-ab]').forEach(b => b.addEventListener('click', () => goAbout(+b.dataset.ab)));
    $$('.com-item').forEach(el => {
      const on = () => {
        const i = +el.dataset.com; if (state.com === i) return;
        state.com = i; $$('.com-item').forEach((c, k) => c.classList.toggle('active', k === i));
      };
      el.addEventListener('mouseenter', on); el.addEventListener('click', on);
    });
    $$('.t-item').forEach(b => b.addEventListener('click', () => { setTest(+b.dataset.t); restartTestTimer(); }));
    $('#t-prev').addEventListener('click', () => { setTest(state.t - 1); restartTestTimer(); });
    $('#t-next').addEventListener('click', () => { setTest(state.t + 1); restartTestTimer(); });
    restartTestTimer();

    // menu mobile
    const root = document.documentElement, burger = $('#burger'), menu = $('#menu');
    const setMenu = open => {
      root.classList.toggle('menu-open', open);
      root.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
    };
    burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
    $('#menu-close').addEventListener('click', () => setMenu(false));
    menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });
    addEventListener('resize', () => { if (innerWidth >= 1080 && root.classList.contains('menu-open')) setMenu(false); });

    $('#lb-close').addEventListener('click', closeLb);
    $('#lb-prev').addEventListener('click', () => openLb(state.lb - 1));
    $('#lb-next').addEventListener('click', () => openLb(state.lb + 1));
    addEventListener('keydown', e => {
      if (state.lb < 0) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') openLb(state.lb + 1);
      if (e.key === 'ArrowLeft') openLb(state.lb - 1);
    });

    // Sem back-end: a mensagem é aberta no WhatsApp do escritório, com os campos preenchidos.
    $('#form').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, v = n => f.elements[n].value.trim();
      const text = ['Olá! Vim pelo site.', v('nome') && `Nome: ${v('nome')}`, v('email') && `Email: ${v('email')}`, v('telefone') && `Telefone: ${v('telefone')}`, v('mensagem') && `\n${v('mensagem')}`].filter(Boolean).join('\n');
      $('#form-label').textContent = 'ABRINDO WHATSAPP';
      window.open('https://wa.me/5511956550749?text=' + encodeURIComponent(text), '_blank', 'noopener');
      setTimeout(() => { $('#form-label').textContent = 'ENVIAR'; }, 3000);
    });
  }

  /* ---------- Loop de scroll / parallax ---------- */
  function tick() {
    if (dead) return;
    const y = scrollY, vh = innerHeight;

    // rede de segurança: revela máscaras que o observer não pegou
    if (exited && ++chk % 10 === 0) {
      $$('[data-mask]').forEach(el => {
        if (el.hasAttribute('data-hero') || el.dataset.shown) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh * .94 && r.bottom > 0) show(el);
      });
    }

    // header em pílula
    const on = y > 60;
    if (on !== navOn) { navOn = on; $('[data-nav]').classList.toggle('on', on); }

    // hero: parallax + mouse
    cx += (mx - cx) * .06; cy += (my - cy) * .06;
    if (y < vh * 1.2) {
      $('[data-herobg]').style.transform = `translate3d(0,${y * .32}px,0)`;
      $('[data-herohot]').style.transform = `translate3d(0,${y * .32}px,0)`;
      const hf = $('[data-herofade]');
      hf.style.transform = `translate3d(0,${y * .12}px,0)`;
      hf.style.opacity = String(Math.max(0, 1 - y / (vh * .8)));
      $$('[data-depth]').forEach(el => { const k = +el.getAttribute('data-depth'); el.style.transform = `translate3d(${cx * k * 2}px,${cy * k * 2}px,0)`; });
    }

    // parallax por velocidade
    $$('[data-speed]').forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.transform = `translate3d(0,${(r.top + r.height / 2 - vh / 2) * +el.getAttribute('data-speed')}px,0)`;
    });

    // trilho horizontal
    const tr = $('[data-htrack]');
    const max = Math.max(1, tr.scrollWidth - tr.clientWidth);
    $('[data-hbar]').style.transform = `scaleX(${Math.max(.04, tr.scrollLeft / max)})`;
    const tb = tr.getBoundingClientRect();
    if (tb.top < vh && tb.bottom > 0) {
      $$('[data-hpar]').forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        img.style.transform = `translate3d(${((r.left + r.width / 2 - innerWidth / 2) / innerWidth) * -4}%,0,0)`;
      });
    }
    if (tr._anim) {
      if (tr._coast) { tr._t += tr._v; tr._v *= .94; if (Math.abs(tr._v) < .2) tr._coast = false; }
      tr._t = Math.max(0, Math.min(max, tr._t));
      const d = tr._t - tr.scrollLeft;
      tr.scrollLeft += d * .085;
      if (Math.abs(d) < .5 && !tr._coast) { tr.scrollLeft = tr._t; tr._anim = false; }
    }

    // processo
    const pr = $('[data-proc]').getBoundingClientRect(), pp = Math.max(0, Math.min(1, (vh * .62 - pr.top) / pr.height));
    $('[data-procfill]').style.transform = `scaleY(${pp})`;
    const st = $$('[data-step]');
    st.forEach((el, i) => el.classList.toggle('on', pp > (i + .15) / st.length));

    // slideshow do Sobre
    const now = performance.now(); if (!aStart) aStart = now;
    if (abCur == null) goAbout(0);
    const ap = Math.min(1, (now - aStart) / 5500), ab = abCur ?? 0;
    $$('[data-afill]').forEach((f, i) => { f.style.transform = `scaleX(${i < ab ? 1 : i === ab ? ap : 0})`; });
    if (ap >= 1 && !document.hidden) goAbout((ab + 1) % ABOUT_N);

    // cursor
    rx += (px - rx) * .16; ry += (py - ry) * .16;
    $('[data-cur-dot]').style.transform = `translate3d(${px}px,${py}px,0)`;
    $('[data-cur-ring]').style.transform = `translate3d(${rx}px,${ry}px,0)`;
    requestAnimationFrame(tick);
  }

  /* ---------- Init ---------- */
  renderLists();
  initEntry();
  initReveals();
  initPointer();
  initTrack();
  initEvents();
  tick();
})();
