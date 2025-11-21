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

// Small accessibility: focus outline visibility
document.addEventListener('keyup', (e)=>{
  if(e.key === 'Tab') document.body.classList.add('show-focus');
});
