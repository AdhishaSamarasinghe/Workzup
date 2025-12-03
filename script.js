const words = [
    "Hiring Made Easy", 
    "Short-Term Work", 
    "Same-Day Hires",
    "Connects Talent"
];

const typingSpeed = 100; 
const deletingSpeed = 50; 
const delayBeforeDelete = 2000; 
let wordIndex = 0; 
let charIndex = 0; 
let isDeleting = false; 
const animatedTextElement = document.getElementById('animated-text');
function typeEffect() {
    const currentWord = words[wordIndex % words.length]; 
    let speed = typingSpeed;
    if (isDeleting) {
        charIndex--;
        speed = deletingSpeed;
        animatedTextElement.textContent = currentWord.substring(0, charIndex);
        if (charIndex === 0) {
            isDeleting = false;
            wordIndex++; 
        }
    } else {
        charIndex++;
        animatedTextElement.textContent = currentWord.substring(0, charIndex);
        if (charIndex === currentWord.length) { 
            speed = delayBeforeDelete; 
            isDeleting = true;
        }
    }
    setTimeout(typeEffect, speed);
}
document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
});


// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
navToggle.addEventListener('click', ()=>{
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close mobile nav on link click
document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click', ()=>{
  if(siteNav.classList.contains('open')){
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
  }
}));

// Scroll reveal using IntersectionObserver
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Back to top
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 420) backToTop.style.display = 'block';
    else backToTop.style.display = 'none';
  });

  backToTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );
}

// Contact form handling: if a data-endpoint is provided on the form (e.g. Formspree), POST to it,
// otherwise fall back to the demo success flow.
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const message = fd.get('message')?.toString().trim();
    if (!name || !email || !message) {
      formStatus.textContent = 'Please complete all required fields.';
      formStatus.classList.remove('success');
      formStatus.classList.add('error');
      return;
    }

    const endpoint = (contactForm.dataset.endpoint || '').trim();
    contactForm.querySelector('button').disabled = true;
    formStatus.textContent = 'Sending...';

    // If user left placeholder or empty, use demo fallback
    if (!endpoint || endpoint.startsWith('REPLACE_WITH')) {
      setTimeout(() => {
        formStatus.textContent = 'Thanks — your message was sent (demo).';
        formStatus.classList.remove('error');
        formStatus.classList.add('success');
        contactForm.reset();
        contactForm.querySelector('button').disabled = false;
      }, 900);
      return;
    }

    // Attempt to POST to the provided endpoint (Formspree-like API)
    try {
      const resp = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      });
      if (resp.ok) {
        formStatus.textContent = 'Thanks — your message was sent.';
        formStatus.classList.remove('error');
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        const data = await resp.json().catch(()=>null);
        formStatus.textContent = (data && data.error) ? `Error: ${data.error}` : 'Submission failed — please try again later.';
        formStatus.classList.remove('success');
        formStatus.classList.add('error');
      }
    } catch (err) {
      formStatus.textContent = 'Network error — please try again later.';
      formStatus.classList.remove('success');
      formStatus.classList.add('error');
    } finally {
      contactForm.querySelector('button').disabled = false;
    }
  });
}
// Waitlist bar
const waitlistForm = document.getElementById('waitlistForm');
const waitlistEmail = document.getElementById('waitlistEmail');
const waitlistStatus = document.getElementById('waitlistStatus');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

if(waitlistForm){
    waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = waitlistEmail.value.trim();
        waitlistStatus.textContent = '';
        waitlistStatus.style.color = 'var(--muted)';
        if (!email) {
            waitlistStatus.textContent = 'Please enter an email address.';
            waitlistStatus.style.color = '#e11d48'; 
            waitlistEmail.focus();
            return;
        }
        if (!emailRegex.test(email)) {
            waitlistStatus.textContent = `Please include an '@' in the email address. '${email}' is missing an '@'.`;
            waitlistStatus.style.color = 'orange'; 
            waitlistEmail.focus();
            return;
        }
            waitlistStatus.textContent = 'Successfully joined, check your Email';
            waitlistStatus.style.color = 'var(--muted)';
            waitlistStatus.classList.add('waitlist-fade');

           
            setTimeout(() => {
                waitlistStatus.classList.add('hide');
            }, 5000);

            waitlistForm.reset();
            waitlistForm.querySelector('button').disabled = false;

      
            setTimeout(() => {
                waitlistStatus.textContent = '';
                waitlistStatus.classList.remove('hide', 'waitlist-fade');
            }, 5800);

    });
}

(function revealOnScroll(){
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if(!items.length) return;

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-reveal-delay') || 0, 10);
        setTimeout(()=> el.classList.add('is-visible'), delay);
        obs.unobserve(el);
      }
    });
  }, {threshold: 0.05});

  items.forEach(i => obs.observe(i));
})();



(function () {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  function animateValue(el, target, duration = 1600) {
    const startTime = performance.now();

    function update(now) {
      if (el.dataset.animating !== 'true') {
        el.textContent = '0';
        return;
      }

      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * target).toLocaleString('en-US');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString('en-US');
      }
    }

    requestAnimationFrame(update);
  }

  function startStats() {
    const numbers = statsSection.querySelectorAll('.stat-number');
    const bars = statsSection.querySelectorAll('.progress-bar');

    numbers.forEach(num => {
      const target = parseInt(num.dataset.target, 10) || 0;
      num.dataset.animating = 'true';
      animateValue(num, target);
    });

    bars.forEach(bar => {
      const width = parseInt(bar.dataset.width, 10) || 0;
      bar.style.transition = 'none';
      bar.style.width = '0%';
      void bar.offsetWidth;
      bar.style.transition = 'width 1.5s ease-out';
      bar.style.width = width + '%';
    });
  }
  function resetStats() {
    const numbers = statsSection.querySelectorAll('.stat-number');
    const bars = statsSection.querySelectorAll('.progress-bar');

    numbers.forEach(num => {
      num.dataset.animating = 'false';
      num.textContent = '0';
    });

    bars.forEach(bar => {
      bar.style.width = '0%';
    });
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target !== statsSection) return;

      if (entry.isIntersecting) {
        startStats();
      } else {
        resetStats();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);
})();


// New about part
/* ===== script.js additions for About page interactivity ===== */
/* If you already have script.js, append this to the bottom. */

document.addEventListener('DOMContentLoaded', function () {
  /* --------- NAV TOGGLE (minimal) --------- */
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteNav.classList.toggle('open');
    });
  }

  /* --------- PARALLAX FOR BLOBS (mousemove + scroll) --------- */
  const blobs = Array.from(document.querySelectorAll('.blob'));
  const hero = document.querySelector('.about-hero');

  function handleParallax(e) {
    // mouse parallax
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mouseX = (e.clientX - cx) / rect.width;
    const mouseY = (e.clientY - cy) / rect.height;

    blobs.forEach((b, i) => {
      const speed = parseFloat(b.dataset.speed) || (0.03 + i * 0.02);
      const tx = -mouseX * 40 * speed;
      const ty = -mouseY * 40 * speed;
      b.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  }

  if (hero) {
    hero.addEventListener('mousemove', handleParallax);
    // subtle scroll influence
    window.addEventListener('scroll', () => {
      const sh = window.scrollY;
      blobs.forEach((b, i) => {
        const base = (i + 1) * 6;
        b.style.transform += ` translateY(${sh * 0.02 * (i+1)}px)`;
      });
    }, { passive: true });
  }

  /* --------- SCROLL REVEAL (IntersectionObserver) --------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // once visible, unobserve to avoid re-trigger
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  /* --------- 3D CARD TILT (pointer move) --------- */
  const tiltContainers = document.querySelectorAll('.card, .team-card');
  tiltContainers.forEach(card => {
    card.addEventListener('pointermove', (ev) => {
      const rect = card.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width;
      const py = (ev.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * 6; // rotateX
      const ry = (px - 0.5) * -8; // rotateY
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  /* --------- COUNTER ANIMATION --------- */
  function animateCounter(el, to) {
    let start = 0;
    const dur = 1400; // ms
    const startTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - startTime) / dur);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.floor(eased * to);
      el.textContent = current.toLocaleString();
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = to.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const to = parseInt(el.dataset.target, 10) || 0;
        animateCounter(el, to);
        counterIO.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => counterIO.observe(c));
});



// Scroll Reveal Observer
const revealItems = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("visible");
  });
}, { threshold: 0.15 });
revealItems.forEach(el => io.observe(el));

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const isHomePage = document.body.classList.contains("home-page");

    if (!isHomePage || !header) return;

    // Make navbar transparent at start
    header.classList.add("transparent");

    let firstScrollTriggered = false;

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        // First scroll → remove transparency
        if (scrollY > 80 && !firstScrollTriggered) {
            firstScrollTriggered = true;
            header.classList.remove("transparent");
        }

        // Scroll back to top → become transparent again
        if (scrollY <= 20) {
            firstScrollTriggered = false;
            header.classList.add("transparent");
        }
    });
});


// 3D Parallax Tilt
document.querySelectorAll(".feature-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width/2;
    const y = e.clientY - rect.top - rect.height/2;
    card.style.transform =
      `rotateX(${-y/20}deg) rotateY(${x/20}deg) scale(1.05)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});



/* 1. BOUNCE-IN ENTRANCE ANIMATION */
function addBounceAnimation() {
  document.querySelectorAll(
    ".feature-card, .routine-card, .main-feature-card, .barrier-card"
  ).forEach((card, i) => {
    card.style.animation = `bounceIn 0.9s ease forwards`;
    card.style.animationDelay = `${i * 0.12}s`;
  });
}

window.addEventListener("load", addBounceAnimation);


/* 2. STAGGERED SCROLL REVEAL */
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const cards = entry.target.querySelectorAll(
      ".feature-card, .routine-card, .main-feature-card, .barrier-card"
    );

    cards.forEach((card, index) => {
      card.classList.add("visible");
      card.style.transitionDelay = index * 120 + "ms";
    });

    staggerObserver.unobserve(entry.target);
  });
}, { threshold: 0.25 });

document
  .querySelectorAll(".features, .routine, .main-features, .barriers")
  .forEach((section) => staggerObserver.observe(section));


/* 3. PREMIUM PARALLAX TILT EFFECT */
document.querySelectorAll(
  ".feature-card, .routine-card, .main-feature-card, .barrier-card"
).forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `
      perspective(900px)
      rotateX(${y * -10}deg)
      rotateY(${x * 10}deg)
      translateZ(8px)
      scale(1.03)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      perspective(900px)
      rotateX(0)
      rotateY(0)
      translateZ(0)
      scale(1)
    `;
  });
});


/* 4. HORIZONTAL SWIPE-TO-SCROLL (MOBILE ONLY) */
function enableHorizontalSwipe(selector) {
  const container = document.querySelector(selector);
  if (!container) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  container.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => (isDown = false));
  container.addEventListener("mouseup", () => (isDown = false));

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.3;
    container.scrollLeft = scrollLeft - walk;
  });

  // Mobile touch events
  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("touchmove", (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 1.2;
    container.scrollLeft = scrollLeft - walk;
  });
}

/* Apply swipe scroll to each grid */
enableHorizontalSwipe(".features-grid");
enableHorizontalSwipe(".routine-grid");
enableHorizontalSwipe(".main-features-grid");
enableHorizontalSwipe(".barriers-grid");


/* 5. BOUNCE KEYFRAME (ADD) */
const style = document.createElement("style");
style.textContent = `
@keyframes bounceIn {
  0% { opacity: 0; transform: scale(0.85) translateY(20px); }
  60% { opacity: 1; transform: scale(1.03) translateY(-6px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
`;
document.head.appendChild(style);

