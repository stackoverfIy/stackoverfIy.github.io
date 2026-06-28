/* ===== StackOverfly – Landing interactions ===== */
(function () {
  'use strict';

  /* ---------- Navbar shadow · Scroll-Progress · Scroll-Spy ---------- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const spyTargets = Array.from(document.querySelectorAll('#navLinks a[href^="#"]'))
    .map(a => ({ a, sec: document.querySelector(a.getAttribute('href')) }))
    .filter(o => o.sec);

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    let current = null;
    for (const o of spyTargets) {
      if (o.sec.getBoundingClientRect().top <= 120) current = o;
    }
    spyTargets.forEach(o => o.a.classList.toggle('active', o === current));
  };
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
    '.problem-card, .feature-card, .goal-card, .tech-item, .team-card, .section-title, .section-lead'
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
    const COUNT = () => Math.min(80, Math.floor(window.innerWidth / 18));

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
        r: Math.random() * 2.6 + 1.4
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
      const maxDist = 165;
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
            ctx.strokeStyle = `rgba(47, 212, 174, ${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // mouse glow link
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 210) {
          ctx.strokeStyle = `rgba(127, 212, 194, ${(1 - mdist / 210) * 0.7})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        // node
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(127, 212, 194, 0.85)'; ctx.fill();
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

  /* ---------- Lösung-Karten → runter zum passenden Prototyp-Schritt ---------- */
  document.querySelectorAll('.feature-card').forEach(card => {
    const slug = (card.dataset.shot || '').split('/').pop().replace(/\.png$/i, '');
    const target = document.getElementById('proto-' + slug);
    const go = () => {
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  /* ---------- Karten "schauen" zur Maus — gruppenweit (wie caruso-dataplace.com) ---------- */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (finePointer && !reduceMotion) {
    const MAX = 12;   // max. Neigung in Grad
    const REF = 420;  // Referenzdistanz (px) für volle Neigung
    const clamp = (v) => Math.max(-1, Math.min(1, v));
    const groups = document.querySelectorAll('.problem-grid, .goal-grid, .tech-grid, .team-grid, .feature-grid');
    groups.forEach(group => {
      const cards = group.querySelectorAll('.problem-card, .goal-card, .tech-item, .team-card, .feature-card');
      // Sobald die Maus über dem Karten-Bereich ist, richten sich ALLE Karten der Gruppe zur Maus aus
      group.addEventListener('pointermove', (e) => {
        cards.forEach(card => {
          const r = card.getBoundingClientRect();
          const ox = clamp((e.clientX - (r.left + r.width / 2)) / REF);   // Maus links/rechts der Kartenmitte
          const oy = clamp((e.clientY - (r.top + r.height / 2)) / REF);   // Maus über/unter der Kartenmitte
          card.style.transition = 'transform .18s ease-out';
          card.style.transform = `perspective(800px) rotateX(${(-oy * MAX).toFixed(2)}deg) rotateY(${(ox * MAX).toFixed(2)}deg) scale(1.02)`;
        });
      });
      group.addEventListener('pointerleave', () => {
        cards.forEach(card => {
          card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
          card.style.transform = '';
        });
      });
    });
  }
})();
