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
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 420) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';
});
backToTop.addEventListener('click', ()=>window.scrollTo({top:0,behavior:'smooth'}));

// Contact form handling (no backend) — show simple success message
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const form = new FormData(contactForm);
    const name = form.get('name')?.toString().trim();
    const email = form.get('email')?.toString().trim();
    const message = form.get('message')?.toString().trim();
    if(!name || !email || !message){
      formStatus.textContent = 'Please complete all fields.';
      formStatus.style.color = '#e11d48';
      return;
    }
    contactForm.querySelector('button').disabled = true;
    formStatus.textContent = 'Sending...';
    setTimeout(()=>{
      formStatus.textContent = 'Thanks, your message was sent (demo).';
      formStatus.style.color = 'green';
      contactForm.reset();
      contactForm.querySelector('button').disabled = false;
    },900);
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
        waitlistForm.querySelector('button').disabled = true;
        waitlistStatus.textContent = 'Adding...';
        setTimeout(() => {
            waitlistStatus.textContent = '✅ Successfully added to the waitlist!';
            waitlistStatus.style.color = 'green';
            waitlistForm.reset();
            waitlistForm.querySelector('button').disabled = false;
        }, 1200);
    });
}


//Key features
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
  }, {threshold: 0.18});
  items.forEach(i => obs.observe(i));
})();


// Small accessibility: focus outline visibility
document.addEventListener('keyup', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});



