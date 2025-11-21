// Mobile nav toggle with aria-hidden for screen readers
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if(navToggle && siteNav){
  // initialize
  siteNav.setAttribute('aria-hidden', siteNav.classList.contains('open') ? 'false' : 'true');
  navToggle.addEventListener('click', ()=>{
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    siteNav.setAttribute('aria-hidden', open ? 'false' : 'true');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.site-nav a').forEach(a=>a.addEventListener('click', ()=>{
    if(siteNav.classList.contains('open')){
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
      siteNav.setAttribute('aria-hidden','true');
    }
  }));
}

// Scroll reveal using IntersectionObserver
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      // If the element is a container with multiple children, let staggerObserver handle it
      const el = entry.target;
      const isContainer = el.matches && (el.classList.contains('features-grid') || el.classList.contains('steps-grid') || el.classList.contains('team-grid') || el.classList.contains('screens-grid') || el.classList.contains('contact-grid'));
      if(!isContainer){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// Staggered reveal for grouped containers (features, steps, team, screens)
const staggerSelectors = ['.features-grid','.steps-grid','.team-grid','.screens-grid','.contact-grid'];
const staggerObserver = new IntersectionObserver((entries, obs)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const children = Array.from(entry.target.querySelectorAll('.reveal'));
    children.forEach((ch, i)=>{
      setTimeout(()=>ch.classList.add('visible'), i * 90);
    });
    obs.unobserve(entry.target);
  });
},{threshold:0.12});
staggerSelectors.forEach(sel=>{
  document.querySelectorAll(sel).forEach(el=>staggerObserver.observe(el));
});

// Hero button pop on load (respect reduced-motion)
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  window.addEventListener('load', ()=>{
    const heroButtons = document.querySelectorAll('.hero .btn');
    heroButtons.forEach((b,i)=>setTimeout(()=>b.classList.add('btn-pop'), i*120));
  });
}

// Simple parallax for .mockup (subtle)
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const parallaxEls = document.querySelectorAll('.mockup');
  function updateParallax(){
    parallaxEls.forEach(el=>{
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const mid = rect.top + rect.height/2 - winH/2;
      const max = 40; // max px translate
      const y = Math.max(Math.min(mid / (winH/2) * max, max), -max);
      el.style.transform = `translateY(${y* -0.2}px)`; // subtle
    });
  }
  window.addEventListener('scroll', updateParallax, {passive:true});
  window.addEventListener('resize', updateParallax);
  updateParallax();
}

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

// Nav underline animation and active handling
(function(){
  const nav = document.querySelector('.site-nav');
  if(!nav) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const underline = document.createElement('span');
  underline.className = 'nav-underline';
  nav.appendChild(underline);
  const links = nav.querySelectorAll('a');

  function moveTo(el, immediate){
    if(!el) return;
    const r = el.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    const left = r.left - nr.left;
    const width = r.width;
    underline.style.left = left + 'px';
    underline.style.width = width + 'px';
    underline.style.opacity = '1';
    if(immediate){
      underline.style.transition = 'none';
      requestAnimationFrame(()=>underline.style.transition = 'left .28s cubic-bezier(.2,.9,.2,1),width .28s cubic-bezier(.2,.9,.2,1),opacity .18s');
    }
  }

  // set initial to active link
  const active = nav.querySelector('a.active') || links[0];
  if(active) moveTo(active, true);

  links.forEach(a=>{
    a.addEventListener('mouseenter', ()=>{ if(!prefersReduced) moveTo(a); });
    a.addEventListener('focus', ()=>{ if(!prefersReduced) moveTo(a); });
    a.addEventListener('click', ()=>{ links.forEach(x=>x.classList.remove('active')); a.classList.add('active'); moveTo(a); });
  });

  nav.addEventListener('mouseleave', ()=>{
    const act = nav.querySelector('a.active');
    if(act) moveTo(act);
    else underline.style.opacity = '0';
  });

  window.addEventListener('resize', ()=>{
    const act = nav.querySelector('a.active');
    if(act) moveTo(act, true);
  });
})();

// Highlight active nav link based on current path
(function setActiveNav(){
  try{
    const links = document.querySelectorAll('.site-nav a');
    const path = window.location.pathname.split('/').pop().toLowerCase();
    links.forEach(a=>{
      const href = (a.getAttribute('href')||'').split('/').pop().toLowerCase();
      if(href && (href === path || (href === '' && path === 'index.html'))){
        a.classList.add('active');
      } else if(href && href.replace('.html','') === path.replace('.html','')){
        a.classList.add('active');
      }
    });
  }catch(e){/* ignore */}
})();

// Add scrolled class to header for stronger contrast on scroll
(function headerScroll(){
  const header = document.querySelector('.site-header');
  if(!header) return;
  const onScroll = ()=>{
    if(window.scrollY > 14) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
})();
