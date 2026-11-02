(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');

  /* ---------- Intro: write the signature, then fly it into the corner ---------- */
  var intro = document.getElementById('intro');
  var introSig = intro && intro.querySelector('.intro__sig');
  var headerLogo = document.querySelector('.site-header__logo .sig');

  function finishIntro() {
    if (!intro) return;
    body.classList.remove('is-intro');
    intro.classList.add('is-done');
    if (hero) hero.classList.add('is-in');
    setTimeout(function () { if (intro && intro.parentNode) intro.parentNode.removeChild(intro); intro = null; }, 700);
  }

  function flyToCorner() {
    if (!intro || !headerLogo) return finishIntro();
    var from = introSig.getBoundingClientRect();
    var to = headerLogo.getBoundingClientRect();
    var scale = to.width / from.width;
    var dx = to.left - from.left;
    var dy = to.top - from.top;
    intro.classList.add('is-flying');
    introSig.style.color = getComputedStyle(header).color;
    introSig.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(' + scale + ')';
    if (hero) hero.classList.add('is-in');
    setTimeout(finishIntro, 1050);
  }

  function playIntro() {
    var sig = intro.querySelector('.sig');
    requestAnimationFrame(function () { requestAnimationFrame(function () { sig.classList.add('is-writing'); }); });
    var timer = setTimeout(flyToCorner, 2900);
    // Click or press a key to skip
    function skip() { clearTimeout(timer); intro.removeEventListener('click', skip); flyToCorner(); }
    intro.addEventListener('click', skip);
    window.addEventListener('keydown', skip, { once: true });
  }

  var seen = false;
  try { seen = sessionStorage.getItem('en-intro') === '1'; } catch (e) {}
  if (intro && !reduce && window.scrollY < 40 && !seen) {
    try { sessionStorage.setItem('en-intro', '1'); } catch (e) {}
    body.classList.add('is-intro');
    setTimeout(playIntro, 250);
  } else {
    finishIntro();
  }

  /* ---------- Contact signature writes itself when it scrolls into view ---------- */
  var footSig = document.querySelector('.contact__sig .sig');
  if (footSig && 'IntersectionObserver' in window && !reduce) {
    footSig.classList.add('sig--write');
    var so = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { footSig.classList.add('is-writing'); so.disconnect(); } }, { threshold: .6 });
    so.observe(footSig);
  }

  /* ---------- Header turns solid once you scroll past the hero ---------- */
  function onScroll() {
    var top = document.querySelector('.hero, .page-head, .about--page, .contact--page');
    var limit = top ? top.offsetHeight - 80 : 80;
    header.classList.toggle('is-solid', window.scrollY > limit);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-linked drift: stars and gallery columns ---------- */
  var drifters = document.querySelectorAll('.sky-stars, .gallery__col, .filmstrip');
  if (!reduce && drifters.length) {
    var ticking = false;
    function drift() {
      var vh = window.innerHeight;
      drifters.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var p = ((r.top + r.height / 2) - vh / 2) / vh; // about -1 to 1
        el.style.setProperty('--p', Math.max(-1.5, Math.min(1.5, p)).toFixed(3));
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }, { passive: true });
    window.addEventListener('resize', drift);
    drift();
  }

  /* ---------- Fade sections up as they arrive ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Project cards: show the image once it exists ---------- */
  document.querySelectorAll('.project__media').forEach(function (box) {
    var img = box.querySelector('img');
    if (!img) return;
    function ok() { if (img.naturalWidth > 0) box.classList.add('has-img'); }
    function bad() { img.style.display = 'none'; }
    img.addEventListener('load', ok);
    img.addEventListener('error', bad);
    if (img.complete) { img.naturalWidth > 0 ? ok() : bad(); }
  });

  /* ---------- Lightbox for film photos ---------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var lb = document.getElementById('lightbox');
  if (lb && shots.length) {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('figcaption'), index = 0, lastFocus = null;
    function show(i) {
      index = (i + shots.length) % shots.length;
      var img = shots[index].querySelector('img');
      lbImg.src = img.src; lbImg.alt = img.alt;
      var cap = shots[index].querySelector('figcaption'); lbCap.textContent = cap ? cap.textContent : '';
    }
    function open(i) { lastFocus = document.activeElement; show(i); lb.hidden = false; body.style.overflow = 'hidden'; lb.querySelector('.lightbox__close').focus(); }
    function close() { lb.hidden = true; body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
    shots.forEach(function (s, i) {
      s.tabIndex = 0;
      s.setAttribute('role', 'button');
      s.addEventListener('click', function () { open(i); });
      s.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
    });
    lb.querySelector('.lightbox__close').addEventListener('click', close);
    lb.querySelector('.lightbox__nav--prev').addEventListener('click', function () { show(index - 1); });
    lb.querySelector('.lightbox__nav--next').addEventListener('click', function () { show(index + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    window.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }


  /* ---------- Split headlines into words so they can rise in ---------- */
  if (!reduce) {
    document.querySelectorAll('.about .display, .work .display, .film .display, .contact__title, .page-head__title, .cta__title').forEach(function (el) {
      var i = 0;
      (function walk(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
              var w = document.createElement('span'); w.className = 'w';
              var s = document.createElement('span'); s.textContent = part; s.style.transitionDelay = (0.15 + i++ * 0.07) + 's';
              w.appendChild(s); frag.appendChild(w);
            });
            node.replaceChild(frag, n);
          } else if (n.nodeType === 1 && n.tagName !== 'BR') { walk(n); }
        });
      })(el);
      el.classList.add('split');
    });
  }

  /* ---------- Marquee and film strips speed up while you scroll ---------- */
  if (!reduce && document.getAnimations) {
    var lastY = window.scrollY, boost = 0;
    var running = function () { return document.getAnimations().filter(function (a) { var t = a.effect && a.effect.target; return t && t.matches && t.matches('.marquee__track, .filmstrip__track'); }); };
    var anims = [];
    setTimeout(function () { anims = running(); }, 300);
    window.addEventListener('scroll', function () { var y = window.scrollY; boost = Math.min(8, boost + Math.abs(y - lastY) / 40); lastY = y; }, { passive: true });
    (function tick() { boost *= 0.92; anims.forEach(function (a) { a.playbackRate = 1 + boost; }); requestAnimationFrame(tick); })();
  }

  /* ---------- Header signature rewrites itself on hover ---------- */
  var logoLink = document.querySelector('.site-header__logo');
  if (logoLink && !reduce) {
    logoLink.addEventListener('mouseenter', function () {
      var s = logoLink.querySelector('.sig'); if (!s) return;
      s.classList.remove('is-writing'); s.classList.add('sig--write'); void s.getBoundingClientRect();
      s.style.setProperty('--write', '1.1s'); s.classList.add('is-writing');
    });
  }

  /* ---------- Cursor dot that grows over things you can click ---------- */
  var cursor = document.querySelector('.cursor');
  if (cursor && !reduce && window.matchMedia('(pointer: fine)').matches) {
    var cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.add('is-on'); });
    document.addEventListener('mouseleave', function () { cursor.classList.remove('is-on'); });
    document.addEventListener('mouseover', function (e) { cursor.classList.toggle('is-big', !!e.target.closest('a, button, .shot, .project, .print')); });
    (function loop() { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
  }

  /* ---------- Contact form: send without leaving the page ---------- */
  var form = document.querySelector('.contact-form');
  if (form) {
    var status = form.querySelector('.contact-form__status');
    var send = form.querySelector('.contact-form__send');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = false;
      form.querySelectorAll('[required]').forEach(function (f) {
        var ok = f.value.trim() && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
        f.classList.toggle('is-bad', !ok); if (!ok) bad = true;
      });
      if (bad) { status.textContent = 'Please fill in your name, a valid email and a message.'; return; }
      if (form.querySelector('[name=_honey]').value) return;
      send.disabled = true; status.textContent = 'Sending...';
      var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data)
      }).then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
        .then(function () { form.classList.add('is-sent'); status.textContent = 'Thank you! Your message is on its way, and I\u2019ll get back to you soon.'; })
        .catch(function () {
          send.disabled = false;
          status.innerHTML = 'That didn\u2019t send. Please email me at <a href="mailto:eviegnoel@gmail.com" style="text-decoration:underline">eviegnoel@gmail.com</a>.';
        });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
