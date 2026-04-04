// --- Lenis Smooth Scroll ---
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// --- GSAP Setup ---
gsap.registerPlugin(ScrollTrigger);

// --- Theme Toggle ---
const tmode = document.getElementById('tmode');
const toggleTheme = () => {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
};
if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
if (tmode) tmode.onclick = toggleTheme;

// --- Premium Cursor Fix ---
if (window.innerWidth > 900) {
  const cdot = document.getElementById('cdot'), cring = document.getElementById('cring');
  let mx = 0, my = 0, rx = 0, ry = 0, isMoving = false;

  document.addEventListener('mousemove', e => {
    if (!isMoving) { 
      isMoving = true; 
      rx = e.clientX; ry = e.clientY; 
      if (cdot) cdot.style.opacity = '1';
      if (cring) cring.style.opacity = '1';
    }
    mx = e.clientX; my = e.clientY;
    if (cdot) {
      cdot.style.left = mx + 'px';
      cdot.style.top = my + 'px';
    }
  });

  function updateRing() {
    if (isMoving && cring) {
      rx += (mx - rx) * 0.15; 
      ry += (my - ry) * 0.15;
      cring.style.left = rx + 'px';
      cring.style.top = ry + 'px';
    }
    requestAnimationFrame(updateRing);
  }
  updateRing();

  document.querySelectorAll('a, button, .prjitem, .skcard, .tmode, .btn-g, .btn-o').forEach(el => {
    el.addEventListener('mouseenter', () => cring?.classList.add('big'));
    el.addEventListener('mouseleave', () => cring?.classList.remove('big'));
  });

  document.addEventListener('mouseleave', () => { if(cdot) cdot.style.opacity = '0'; if(cring) cring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if(isMoving && cdot) cdot.style.opacity = '1'; if(isMoving && cring) cring.style.opacity = '1'; });
} else {
  document.body.classList.add('mobile-cursor-off');
}

// --- Loader & Hero Animation ---
const loaderBar = document.getElementById('ldbar');
let progress = 0;
const loaderIv = setInterval(() => {
  progress += Math.random() * 20 + 10; // Faster loader
  if (progress >= 100) {
    progress = 100; clearInterval(loaderIv);
    setTimeout(() => {
      gsap.to('#loader', { opacity: 0, duration: 1, ease: 'power4.inOut', onComplete: () => {
        const ld = document.getElementById('loader');
        if (ld) ld.style.display = 'none';
        animateHero();
      }});
    }, 200);
  }
  if (loaderBar) loaderBar.style.width = progress + '%'; 
}, 50);

function animateHero() {
  const tl = gsap.timeline();
  tl.to('.hnin', { y: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' })
    .to(['.hrole', '.hdesc', '.hctas'], { opacity: 1, y: 0, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, "-=0.8")
    .to('.hcard', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=1");
  typedInit();
}

function typedInit() {
  const words = ['Full Stack Engineer', 'Flutter Specialist', 'System Designer', 'Product Maker'];
  let wordIdx = 0, charIdx = 0, isDeleting = false, textEl = document.getElementById('ttext');
  function type() {
    if (!textEl) return;
    let current = words[wordIdx];
    if (isDeleting) { textEl.textContent = current.substring(0, charIdx--); }
    else { textEl.textContent = current.substring(0, charIdx++); }
    let speed = isDeleting ? 40 : 80;
    if (!isDeleting && charIdx === current.length + 1) { speed = 2000; isDeleting = true; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 500; }
    setTimeout(type, speed);
  }
  type();
}

// --- Scroll Reveal ---
gsap.utils.toArray('.gr').forEach(el => {
  gsap.fromTo(el, { opacity:0, y:30 }, { opacity:1, y:0, duration:1, ease:'power3.out', scrollTrigger: { trigger:el, start:'top 90%' } });
});

// --- Counters ---
gsap.utils.toArray('.cval').forEach(el => {
  let v = +el.getAttribute('data-v');
  ScrollTrigger.create({ trigger:el, start:'top 90%', onEnter: () => {
    gsap.to(el, { textContent: v, duration: 2, snap:{textContent:1}, onUpdate: () => { el.textContent = Math.floor(+el.textContent); } });
  }});
});

// --- Background Particles ---
const canvas = document.getElementById('pcanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, pList = [];
  function initCanvas() { 
    w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; pList = []; 
    for (let i=0; i<50; i++) pList.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1+0.5, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, a: Math.random()*0.3+0.1 }); 
  }
  initCanvas(); window.addEventListener('resize', initCanvas);
  function drawParticles() {
    ctx.clearRect(0,0,w,h);
    pList.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x<0||p.x>w) p.vx*=-1; if (p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fillStyle = document.body.classList.contains('light-mode') ? `rgba(179,139,34,${p.a})` : `rgba(201,168,76,${p.a})`; ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}
