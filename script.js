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

