/* ===== StackOverfly – Landing interactions ===== */
(function () {
  'use strict';

  /* ---------- Navbar shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.problem-card, .feature-card, .goal-card, .tech-item, .team-card, .metric-band, .section-title, .section-lead'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (e.target.dataset.delay || (i % 4) * 60) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = +el.dataset.count;
    const prefix = (el.dataset.prefix || '').replace('&lt;', '<');
    const suffix = el.dataset.suffix || '';
    const dur = 1400; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); counterIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Hero network canvas ---------- */
  const canvas = document.getElementById('network');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, nodes = [], raf;
    const COUNT = () => Math.min(90, Math.floor(window.innerWidth / 16));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      nodes = Array.from({ length: COUNT() }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8
      }));
    };

    const mouse = { x: -9999, y: -9999 };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const maxDist = 130;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // links
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * 0.5;
            ctx.strokeStyle = `rgba(72, 201, 176, ${a})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // mouse glow link
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 170) {
          ctx.strokeStyle = `rgba(110, 231, 183, ${(1 - mdist / 170) * 0.7})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        // node
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(127, 216, 232, 0.85)'; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const start = () => { cancelAnimationFrame(raf); resize(); initNodes(); draw(); };
    window.addEventListener('resize', () => { resize(); initNodes(); });
    start();
  }

  /* ---------- Hero generated background (set when available) ---------- */
  const heroMedia = document.getElementById('heroMedia');
  if (heroMedia) {
    const src = heroMedia.dataset.src;
    if (src) {
      const img = new Image();
      img.onload = () => { heroMedia.style.backgroundImage = `url(${src})`; heroMedia.classList.add('loaded'); };
      img.src = src;
    }
  }
})();
