// Navbar scroll state
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive:true });

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', false);
  }));

  // Scroll reveal
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // Contact form (envio real via Formspree)
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnLabel = submitBtn.innerHTML;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando...';
    formNote.style.color = '';
    formNote.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formNote.textContent = 'Mensagem enviada com sucesso! Retornamos em até 1 dia útil.';
        formNote.style.color = '#D9C4A2';
        form.reset();
      } else {
        formNote.textContent = 'Não foi possível enviar agora. Tente novamente ou use o WhatsApp abaixo.';
        formNote.style.color = '#e0a0a0';
      }
    } catch (err) {
      formNote.textContent = 'Erro de conexão. Tente novamente ou use o WhatsApp abaixo.';
      formNote.style.color = '#e0a0a0';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = submitBtnLabel;
    }
  });