/* ═══════════════════════════════════════════════
   SAMUEL SALAS — script.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });
  function animateRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .slide-card, .qi-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '50px';
      ring.style.height = '50px';
      ring.style.opacity = '.8';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '32px';
      ring.style.height = '32px';
      ring.style.opacity = '.5';
    });
  });

  /* ── CANVAS BACKGROUND — Partículas conectadas ── */
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  const N = 60;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function getAccentColor() {
    return document.documentElement.getAttribute('data-theme') === 'light'
      ? '59,130,246' : '59,130,246';
  }

  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: Math.random() * 2 + 1,
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = getAccentColor();
    const alpha = document.documentElement.getAttribute('data-theme') === 'light' ? .25 : .45;

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},${alpha})`;
      ctx.fill();
    });

    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${c},${(1 - dist/130) * .18})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ── THEME TOGGLE ── */
  const themeBtn = document.getElementById('themeToggle');
  const html     = document.documentElement;

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  themeBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ── NAVBAR ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Hamburger
  const ham   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  ham.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // Active link
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('[data-nav]');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAs.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`[data-nav][href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: .4 });
  sections.forEach(s => navObs.observe(s));

  /* ── TYPEWRITER ── */
  const tw     = document.getElementById('typewriter');
  const phrases = [
    'Desarrollador Full Stack',
    'Estudiante de Ing. Informática',
    'Miembro del Club de Robótica',
    'Apasionado por la tecnología',
    'Solucionador de problemas',
  ];
  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      tw.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      tw.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  setTimeout(type, 800);

  /* ── REVEAL ON SCROLL ── */
  const reveals = document.querySelectorAll('.reveal');
  const revObs  = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger children in same parent
        const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: .1 });
  reveals.forEach(el => revObs.observe(el));

  /* ── COUNT UP ANIMATION ── */
  const countEls = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = +e.target.dataset.count;
        let current  = 0;
        const step   = target / 40;
        const interval = setInterval(() => {
          current += step;
          if (current >= target) { e.target.textContent = target; clearInterval(interval); }
          else { e.target.textContent = Math.floor(current); }
        }, 35);
        countObs.unobserve(e.target);
      }
    });
  }, { threshold: .5 });
  countEls.forEach(el => countObs.observe(el));

  /* ── SKILLS TABS ── */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const panels    = document.querySelectorAll('.skills-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      panels.forEach(p => {
        p.classList.remove('active');
        // reset bars
        p.querySelectorAll('.sk-fill').forEach(f => f.style.width = '0');
      });
      btn.classList.add('active');
      const panel = document.querySelector(`[data-panel="${btn.dataset.tab}"]`);
      panel.classList.add('active');
      // animate bars
      setTimeout(() => {
        panel.querySelectorAll('.sk-fill').forEach(f => f.style.width = f.style.getPropertyValue('--pct'));
      }, 50);
    });
  });

  // Animate initial bars when section visible
  const skillSection = document.getElementById('skills');
  const skillObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      document.querySelectorAll('.skills-panel.active .sk-fill').forEach(f => {
        f.style.width = f.style.getPropertyValue('--pct');
      });
      skillObs.disconnect();
    }
  }, { threshold: .2 });
  skillObs.observe(skillSection);

  /* ── PROJECT SLIDER ── */
  const track   = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsEl  = document.getElementById('sliderDots');
  const cards   = track.querySelectorAll('.slide-card');

  let currentSlide = 0;
  let perView = window.innerWidth >= 992 ? 3 : window.innerWidth >= 640 ? 2 : 1;
  const total = cards.length;
  const maxSlide = Math.max(0, total - perView);

  // Build dots
  for (let i = 0; i <= maxSlide; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  }

  function goTo(n) {
    currentSlide = Math.max(0, Math.min(n, maxSlide));
    const cardW = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
    track.style.transform = `translateX(-${currentSlide * cardW}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  prevBtn.addEventListener('click', () => goTo(currentSlide - 1));
  nextBtn.addEventListener('click', () => goTo(currentSlide + 1));

  // Touch / drag
  let startX = 0, isDragging = false;
  track.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
  track.addEventListener('mouseup',   e => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    isDragging = false;
  });
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? currentSlide + 1 : currentSlide - 1);
  });

  window.addEventListener('resize', () => {
    perView = window.innerWidth >= 992 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    goTo(0);
  });

  /* ── CONTACT FORM ── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.querySelector('.btn-text').textContent = 'Enviando...';
    btn.disabled = true;
    // Simula envío — conecta con Formspree/EmailJS para envío real
    setTimeout(() => {
      success.style.display = 'block';
      btn.querySelector('.btn-text').textContent = 'Enviar mensaje';
      btn.disabled = false;
      form.reset();
      setTimeout(() => success.style.display = 'none', 4000);
    }, 1200);
  });

});
