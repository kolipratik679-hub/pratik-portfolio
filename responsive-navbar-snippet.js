// Hamburger Menu Toggle
  const hamburger = document.getElementById('hamburger');
  const navbar = document.querySelector('.navbar');
  const navbarClose = document.getElementById('navbarClose');
  const navMenu = document.querySelector('.nav-menu');
  const dropdownItems = document.querySelectorAll('.dropdown');
  const body = document.body;

  // Toggle hamburger and navbar
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('active');
    body.classList.toggle('menu-open');
  });

  // Close navbar with close button
  navbarClose.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navbar.classList.remove('active');
    body.classList.remove('menu-open');
  });

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-menu > li > a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Don't close if it's a dropdown item
      if (!link.parentElement.classList.contains('dropdown')) {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  });

  // Handle dropdown menus on mobile
  dropdownItems.forEach(dropdown => {
    const link = dropdown.querySelector('> a');
    const menu = dropdown.querySelector('.dropdown-menu');

    link.addEventListener('click', (e) => {
      // On mobile (max-width: 900px)
      if (window.innerWidth <= 900) {
        e.preventDefault();
        menu.classList.toggle('active');
        
        // Rotate chevron
        const chevron = link.querySelector('i');
        if (chevron) {
          chevron.style.transform = menu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
        }
      }
    });
  });

  // Close menu when clicking on overlay
  document.addEventListener('click', (e) => {
    if (body.classList.contains('menu-open') && !e.target.closest('.navbar') && !e.target.closest('.hamburger')) {
      hamburger.classList.remove('active');
      navbar.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      hamburger.classList.remove('active');
      navbar.classList.remove('active');
      body.classList.remove('menu-open');
      dropdownItems.forEach(dropdown => {
        dropdown.querySelector('.dropdown-menu').classList.remove('active');
      });
    }
  });












