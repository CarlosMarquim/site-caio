/* Dr. Caio Rodrigo · interações da landing page (sem dependências) */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = () => window.matchMedia('(max-width: 40em)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- Cabeçalho: sombra depois que a página rola ---------- */
  const header = $('.site-header');
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none;';
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => {
    header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);

  /* ---------- Revelação ao rolar (só quando a página desce) ----------
     Rolando para baixo, os elementos entram pela parte de baixo da tela e animam.
     Rolando para cima, os elementos que entram pelo topo aparecem prontos, sem animação.
     Um elemento só "rearma" quando sai COMPLETAMENTE pela parte de baixo da tela
     (a pessoa subiu além dele), para animar de novo quando ela voltar a descer.
     A animação começa um pouco ANTES de o elemento chegar à tela (margem de baixo positiva),
     compensando o deslocamento inicial, para nunca parecer que a página acabou.
     As duas observações usam a mesma margem de baixo, senão um elemento rearmado
     dentro dessa faixa ficaria invisível. */
  const revealEls = $$('[data-reveal]');
  const revealBottom = '8%';
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  } else {
    const showInstantly = (el) => {
      el.classList.add('no-anim', 'is-revealed');
      void el.offsetWidth;
      el.classList.remove('no-anim');
    };

    const showObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el.classList.contains('is-revealed')) return;
        // Entrando pelo topo da tela = a página está subindo: sem animação.
        const enteringFromTop = entry.boundingClientRect.top < entry.rootBounds.top;
        if (enteringFromTop) showInstantly(el);
        else el.classList.add('is-revealed');
      });
    }, { rootMargin: `-4% 0px ${revealBottom} 0px`, threshold: 0 });

    const resetObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;
        // Saiu por cima (a página desceu além dele): continua visível, sem rearmar.
        if (entry.boundingClientRect.top < 0) return;
        const el = entry.target;
        el.classList.add('no-anim');
        el.classList.remove('is-revealed');
        void el.offsetWidth; // aplica o estado inicial sem transição, fora da tela
        el.classList.remove('no-anim');
      });
    }, { rootMargin: `0px 0px ${revealBottom} 0px`, threshold: 0 });

    revealEls.forEach((el) => {
      showObserver.observe(el);
      resetObserver.observe(el);
    });
  }

  /* ---------- Linha do tempo da consulta: a linha acompanha a leitura ---------- */
  const steps = $('[data-steps]');
  if (steps && !reduceMotion) {
    const thresholds = Array.from({ length: 41 }, (_, i) => i / 40);
    new IntersectionObserver(([entry]) => {
      const past = entry.boundingClientRect.top < 0;
      const progress = past ? 1 : entry.intersectionRatio;
      steps.style.setProperty('--progress', progress.toFixed(3));
    }, { threshold: thresholds, rootMargin: '0px 0px -30% 0px' }).observe(steps);
  }

  /* ---------- Menu do celular ---------- */
  const menu = $('#menu-mobile');
  const openBtn = $('.site-header .menu-toggle');
  let lastFocus = null;

  const openMenu = () => {
    lastFocus = document.activeElement;
    menu.hidden = false;
    void menu.offsetHeight; // aplica o display antes da transição
    menu.classList.add('is-open');
    document.documentElement.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    $('a', menu)?.focus({ preventScroll: true });
  };
  const closeMenu = (restoreFocus = true) => {
    menu.classList.remove('is-open');
    document.documentElement.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
    const done = () => { if (!menu.classList.contains('is-open')) menu.hidden = true; };
    if (reduceMotion) done(); else setTimeout(done, 300);
    if (restoreFocus) (lastFocus || openBtn).focus({ preventScroll: true });
  };
  openBtn?.addEventListener('click', openMenu);
  $('[data-menu-close]', menu)?.addEventListener('click', () => closeMenu());
  $$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    if (e.key === 'Tab' && menu.classList.contains('is-open')) {
      const focusables = $$('a, button', menu).filter((el) => el.offsetParent !== null);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 64em)').addEventListener('change', (e) => {
    if (e.matches && menu.classList.contains('is-open')) closeMenu(false);
  });

  /* ---------- Vídeos: só carregam quando o paciente pede ---------- */
  const players = new Set();
  $$('[data-video]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapper = document.createElement('div');
      wrapper.className = link.className + ' is-playing';
      wrapper.style.cssText = link.getAttribute('style') || '';

      const video = document.createElement('video');
      video.src = link.getAttribute('href');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.setAttribute('aria-label', link.getAttribute('aria-label').replace('Assistir ao ', ''));
      const poster = $('img', link);
      if (poster) video.poster = poster.currentSrc || poster.src;

      wrapper.append(...link.childNodes, video);
      link.replaceWith(wrapper);
      players.add(video);

      video.addEventListener('play', () => {
        players.forEach((other) => { if (other !== video) other.pause(); });
      });

      // Tela cheia no celular: vídeo deitado gira a tela para horizontal (Android).
      // No iPhone o player nativo já acompanha o giro do aparelho.
      const onFullscreenChange = () => {
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
        const orientation = screen.orientation;
        if (!orientation || !orientation.lock) return;
        if (fsEl === video) {
          if (video.videoWidth > video.videoHeight) orientation.lock('landscape').catch(() => {});
        } else {
          try { orientation.unlock(); } catch (_) {}
        }
      };
      document.addEventListener('fullscreenchange', onFullscreenChange);
      document.addEventListener('webkitfullscreenchange', onFullscreenChange);

      const playPromise = video.play();
      if (playPromise) playPromise.catch(() => {});
      video.focus({ preventScroll: true });

      // Depoimentos verticais: no celular, abrir em tela cheia para facilitar a leitura das legendas.
      if (link.hasAttribute('data-fullscreen-mobile') && isSmall()) {
        const fs = video.requestFullscreen || video.webkitRequestFullscreen;
        if (fs) fs.call(video).catch?.(() => {});
        else if (video.webkitEnterFullscreen) video.addEventListener('loadedmetadata', () => video.webkitEnterFullscreen(), { once: true });
      }
    });
  });

  /* ---------- Navegação: destaca a seção atual ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const sections = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  if (sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navObserver.observe(s));
  }
})();
