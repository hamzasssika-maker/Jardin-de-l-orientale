/* =====================================================
   JARDIN ORIENTAL — script.js
   ===================================================== */

/* ---------- Thème clair / sombre (persistant via localStorage) ---------- */
(function initTheme(){
  const saved = localStorage.getItem('jo-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', () => {

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle){

    /* Repositionne le bouton là où l'utilisateur l'a laissé, sur n'importe quelle page */
    function applySavedPosition(){
      const saved = localStorage.getItem('jo-theme-toggle-pos');
      if (!saved) return;
      try {
        const { left, top } = JSON.parse(saved);
        const w = themeToggle.offsetWidth || 52;
        const h = themeToggle.offsetHeight || 52;
        const maxLeft = window.innerWidth - w - 6;
        const maxTop = window.innerHeight - h - 6;
        const safeLeft = Math.min(Math.max(left, 6), Math.max(maxLeft, 6));
        const safeTop = Math.min(Math.max(top, 6), Math.max(maxTop, 6));
        themeToggle.style.left = safeLeft + 'px';
        themeToggle.style.top = safeTop + 'px';
        themeToggle.style.right = 'auto';
        themeToggle.style.transform = 'none';
      } catch(e){ /* position ignorée si corrompue */ }
    }
    applySavedPosition();
    window.addEventListener('resize', applySavedPosition);

    let dragging = false;
    let moved = false;
    let startX = 0, startY = 0, originLeft = 0, originTop = 0;

    function pointerPos(e){
      if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function dragStart(e){
      const p = pointerPos(e);
      const rect = themeToggle.getBoundingClientRect();
      dragging = true;
      moved = false;
      startX = p.x; startY = p.y;
      originLeft = rect.left; originTop = rect.top;
      themeToggle.style.transition = 'none';
    }

    function dragMove(e){
      if (!dragging) return;
      const p = pointerPos(e);
      const dx = p.x - startX;
      const dy = p.y - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      if (!moved) return;
      e.preventDefault();
      const w = themeToggle.offsetWidth;
      const h = themeToggle.offsetHeight;
      const maxLeft = window.innerWidth - w - 6;
      const maxTop = window.innerHeight - h - 6;
      const newLeft = Math.min(Math.max(originLeft + dx, 6), Math.max(maxLeft, 6));
      const newTop = Math.min(Math.max(originTop + dy, 6), Math.max(maxTop, 6));
      themeToggle.style.left = newLeft + 'px';
      themeToggle.style.top = newTop + 'px';
      themeToggle.style.right = 'auto';
      themeToggle.style.transform = 'none';
    }

    function dragEnd(){
      if (!dragging) return;
      dragging = false;
      themeToggle.style.transition = '';
      if (moved){
        const rect = themeToggle.getBoundingClientRect();
        localStorage.setItem('jo-theme-toggle-pos', JSON.stringify({ left: rect.left, top: rect.top }));
      }
    }

    themeToggle.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove);
    window.addEventListener('mouseup', dragEnd);
    themeToggle.addEventListener('touchstart', dragStart, {passive:true});
    window.addEventListener('touchmove', dragMove, {passive:false});
    window.addEventListener('touchend', dragEnd);

    themeToggle.addEventListener('click', () => {
      if (moved) { moved = false; return; } // ne bascule pas le thème si on vient de déplacer le bouton
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('jo-theme', next);
    });
  }

  /* ---------- Header au scroll ---------- */
  const header = document.getElementById('siteHeader');
  if (header){
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ---------- Barre rapide : toujours collée sous le header ---------- */
  const quickNav = document.getElementById('quickNav');
  if (header && quickNav){
    const placeQuickNav = () => { quickNav.style.top = header.offsetHeight + 'px'; };
    placeQuickNav();
    window.addEventListener('scroll', placeQuickNav);
    window.addEventListener('resize', placeQuickNav);
  }

  /* ---------- Menu burger mobile ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('mainNav');
  if (burger && nav){
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- Entrée : portes royales qui s'ouvrent sur la page d'accueil ---------- */
  const doorIntro = document.getElementById('doorIntro');
  if (doorIntro){
    const doors = doorIntro.querySelector('.di-doors');
    const logo = doorIntro.querySelector('.di-logo');
    const burst = doorIntro.querySelector('.di-burst');
    const particlesWrap = doorIntro.querySelector('.di-particles');
    const skipBtn = doorIntro.querySelector('.di-skip');

    if (particlesWrap){
      for (let i=0;i<36;i++){
        const p = document.createElement('div');
        p.className = 'di-particle';
        p.style.left = Math.random()*100+'%';
        p.style.animationDuration = (6+Math.random()*8)+'s';
        p.style.animationDelay = (Math.random()*6)+'s';
        particlesWrap.appendChild(p);
      }
    }

    function closeIntro(){
      doorIntro.classList.add('fade-out');
      document.body.style.overflow = '';
      setTimeout(() => { doorIntro.style.display = 'none'; }, 1000);
    }

    const music = doorIntro.querySelector('#diMusic');
    const creak = doorIntro.querySelector('#diCreak');
    function safePlay(el){ if (el) { el.play().catch(() => {}); } }

    function runIntro(){
      document.body.style.overflow = 'hidden';
      if (music) { music.volume = 0.35; safePlay(music); }
      setTimeout(() => { if (logo) logo.classList.add('di-hide'); }, 1700);
      setTimeout(() => { if (burst) burst.classList.add('di-show'); }, 2200);
      setTimeout(() => {
        if (creak) { creak.volume = 0.6; safePlay(creak); }
        if (doors) doors.classList.add('di-open');
      }, 2400);
      setTimeout(() => { doorIntro.classList.add('di-zoom'); }, 3400);
      setTimeout(closeIntro, 4300);
      setTimeout(() => {
        if (music){
          const fade = setInterval(() => {
            music.volume = Math.max(0, music.volume - 0.05);
            if (music.volume <= 0){ music.pause(); clearInterval(fade); }
          }, 60);
        }
      }, 3400);
    }

    runIntro();
    if (skipBtn) skipBtn.addEventListener('click', () => {
      if (music) music.pause();
      if (creak) creak.pause();
      closeIntro();
    });
  }

  /* ---------- Lazy-load vidéos + fallback (salles empilées + galerie négafa + photos du menu) ----------
     Important : le fallback ne doit JAMAIS être basé sur un délai calculé depuis le chargement
     de la page, car une vidéo en lazy-load n'a même pas commencé à se charger tant qu'elle n'est
     pas entrée dans le viewport. On ne déclenche donc "video-failed" que sur de vrais événements
     d'échec (error / play() rejeté), avec un délai de sécurité qui démarre seulement APRÈS le
     début réel du chargement. */
  document.querySelectorAll('[data-src]').forEach(row => {
    const video = row.querySelector('video');
    const src = row.getAttribute('data-src');
    if (!video) return;

    video.addEventListener('loadeddata', () => {
      row.classList.remove('video-failed');
      row.classList.add('video-ready');
    });
    video.addEventListener('error', () => row.classList.add('video-failed'));

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const source = document.createElement('source');
          source.src = src;
          source.type = 'video/mp4';
          video.appendChild(source);
          video.load();

          // On attend que la vidéo ait assez de données avant de lancer play(),
          // pour éviter qu'un play() trop précoce soit rejeté (ce qui déclenchait
          // un faux "video-failed" alors que la vidéo continuait de charger).
          const tryPlay = () => { video.play().catch(() => {}); };
          video.addEventListener('canplay', tryPlay, { once: true });

          // Filet de sécurité : on laisse largement le temps à une vidéo non
          // compressée de charger (connexions lentes / mobile) avant de basculer
          // sur le fallback. Ne se déclenche QUE si rien n'a chargé du tout.
          setTimeout(() => {
            if (video.readyState === 0) row.classList.add('video-failed');
          }, 12000);

          observer.unobserve(row);
        }
      });
    }, {threshold:.2});
    observer.observe(row);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.15});
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animation "chute" des cartes menu, en cascade ---------- */
  const menuCards = document.querySelectorAll('.menu-card');
  if (menuCards.length){
    const menuObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const card = entry.target;
          const index = Array.from(menuCards).indexOf(card);
          card.style.animationDelay = (index % 8) * 0.12 + 's';
          card.classList.add('fall-in');
          menuObserver.unobserve(card);
        }
      });
    }, {threshold:.2});
    menuCards.forEach(card => menuObserver.observe(card));
  }

  /* ---------- Barre d'onglets du menu : ombre quand elle reste collée en haut ---------- */
  const tabsSentinel = document.getElementById('tabsSentinel');
  const menuTabsWrap = document.getElementById('menuTabsWrap');
  if (tabsSentinel && menuTabsWrap){
    const stickyObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        menuTabsWrap.classList.toggle('is-stuck', !entry.isIntersecting);
      });
    }, {threshold:0});
    stickyObserver.observe(tabsSentinel);
  }

  /* ---------- Onglets de catégories du menu (Entrées / Plats / Desserts / Boissons) ---------- */
  const menuTabs = document.getElementById('menuTabs');
  if (menuTabs){
    const tabBtns = menuTabs.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.menu-card');
    const catVideoWrap = document.getElementById('categoryVideoWrap');
    const catVideo = document.getElementById('categoryVideo');
    const catSource = document.getElementById('categorySource');
    const catTitle = document.getElementById('categoryTitle');
    const dessertCarouselWrap = document.getElementById('dessertCarouselWrap');
    let catVideoReady = false;
    let pendingFilter = null;

    function loadCategoryVideo(filter){
      if (!catVideoWrap || !catVideo || !catSource) return;
      catVideoWrap.classList.remove('video-failed');
      catSource.src = 'videos/menu-' + filter + '.mp4';
      catVideo.load();
      catVideo.addEventListener('canplay', () => { catVideo.play().catch(() => {}); }, { once: true });
      // Le délai démarre ici, juste après le début réel du chargement de cette vidéo,
      // et non depuis l'ouverture de la page — donc pas de faux "échec" prématuré.
      setTimeout(() => { if (catVideo.readyState === 0) catVideoWrap.classList.add('video-failed'); }, 12000);
    }

    function applyFilter(filter){
      cards.forEach((card, index) => {
        const match = card.dataset.category === filter;
        card.classList.toggle('hide', !match);
        if (match){
          card.classList.remove('fall-in');
          void card.offsetWidth; // relance l'animation
          card.style.animationDelay = (index % 8) * 0.08 + 's';
          card.classList.add('fall-in');
        }
      });
      pendingFilter = filter;
      if (catVideoReady) loadCategoryVideo(filter);
      if (catTitle){
        const btn = menuTabs.querySelector(`.tab-btn[data-filter="${filter}"]`);
        if (btn) catTitle.textContent = btn.textContent;
      }
      if (dessertCarouselWrap) dessertCarouselWrap.classList.toggle('hide', filter !== 'desserts');
    }

    // La vidéo de la bannière ne se charge que lorsqu'elle entre réellement dans le viewport
    if (catVideoWrap){
      const catObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting){
            catVideoReady = true;
            loadCategoryVideo(pendingFilter || 'entrees');
            catObserver.unobserve(catVideoWrap);
          }
        });
      }, {threshold:.2});
      catObserver.observe(catVideoWrap);
    }

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter);
      });
    });

    const initial = menuTabs.querySelector('.tab-btn.active');
    if (initial) applyFilter(initial.dataset.filter);
  }

  /* ---------- Carousel vidéo réutilisable (salles / négafa / menu) ----------
     Chaque .vcarousel charge UNE SEULE vidéo à la fois (la vidéo active),
     pour rester léger — conformément à la recommandation du LISEZMOI sur le
     nombre de vidéos chargées en simultané. */
  document.querySelectorAll('.vcarousel').forEach(root => {
    const track = root.querySelector('.vcarousel-track');
    if (!track) return;
    const slides = Array.from(track.children);
    const infoItems = Array.from(root.querySelectorAll('.vcarousel-info-item'));
    const prevBtn = root.querySelector('.vc-prev');
    const nextBtn = root.querySelector('.vc-next');
    const playBtn = root.querySelector('.vc-play');
    const counter = root.querySelector('.vcarousel-counter');
    const loaded = new Set();
    let idx = 0;

    function loadSlide(i){
      if (loaded.has(i)) return;
      const slide = slides[i];
      const video = slide.querySelector('video');
      const src = slide.getAttribute('data-src');
      if (!video || !src) return;
      const source = document.createElement('source');
      source.src = src;
      source.type = 'video/mp4';
      video.appendChild(source);
      video.load();
      loaded.add(i);
      video.addEventListener('error', () => slide.classList.add('video-failed'));
      // Délai de sécurité généreux (vidéos non compressées / connexions lentes) :
      // on ne marque l'échec que si rien n'a chargé du tout après 12s.
      setTimeout(() => { if (video.readyState === 0) slide.classList.add('video-failed'); }, 12000);
    }

    function pauseAllExcept(current){
      slides.forEach((s, i) => {
        if (i === current) return;
        const v = s.querySelector('video');
        if (v) v.pause();
      });
    }

    function updatePlayIcon(){
      const video = slides[idx].querySelector('video');
      if (!playBtn || !video) return;
      playBtn.classList.toggle('paused', video.paused);
    }

    function goTo(i){
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      loadSlide(idx);
      pauseAllExcept(idx);
      infoItems.forEach((el, di) => el.classList.toggle('active', di === idx));
      if (counter) counter.textContent = `${idx + 1} / ${slides.length}`;
      const video = slides[idx].querySelector('video');
      if (video){
        const attemptPlay = () => {
          video.play().then(updatePlayIcon).catch(() => {
            // Un rejet ici ne veut pas forcément dire que la vidéo a échoué
            // (ex: play() interrompu par un changement de slide) : on ne
            // bascule PAS sur le fallback ici, le vrai échec est géré par
            // l'event 'error' et le timeout de sécurité dans loadSlide().
            updatePlayIcon();
          });
        };
        // Si la vidéo est déjà prête (slide déjà visité), on relance direct.
        // Sinon on attend le 1er "canplay" avant de lancer play() — au lieu
        // d'un délai fixe de 200ms qui échouait sur les vidéos non compressées.
        if (video.readyState >= 3){
          attemptPlay();
        } else {
          video.addEventListener('canplay', attemptPlay, { once: true });
        }
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));
    if (playBtn){
      playBtn.addEventListener('click', () => {
        const video = slides[idx].querySelector('video');
        if (!video) return;
        if (video.paused) video.play(); else video.pause();
        updatePlayIcon();
      });
    }

    // Ne démarre le chargement/la lecture que lorsque le carousel entre dans l'écran
    const vcObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          goTo(idx);
          vcObserver.unobserve(root);
        }
      });
    }, {threshold:.25});
    vcObserver.observe(root);
  });

  /* ---------- Formulaire de réservation -> WhatsApp ---------- */
  const resForm = document.getElementById('resForm');
  if (resForm){
    resForm.addEventListener('submit', function(e){
      e.preventDefault();
      const prenom = document.getElementById('prenom').value.trim();
      const nom = document.getElementById('nom').value.trim();
      const message = document.getElementById('message').value.trim();

      let texte = `Bonjour, je suis ${prenom} ${nom}.`;
      if (message) {
        texte += ` ${message}`;
      } else {
        texte += ` Je souhaite réserver une visite / date à Jardin Oriental.`;
      }

      const numero = "212767601146"; // 0767601146 au format international
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(texte)}`;
      window.open(url, "_blank");
    });
  }

});
