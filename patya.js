// Typing Effect
const phrases = [
    'Full Stack Developer',
    'Business-Focused Web Solutions',
    'AI-Assisted Development'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingText = document.getElementById('typingText');

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scrollProgress').style.width = scrolled + '%';
});

// Color Palette Switcher
const paletteBtn = document.getElementById('paletteBtn');
const paletteDropdown = document.getElementById('paletteDropdown');
const paletteOptions = document.querySelectorAll('.palette-option');

paletteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    paletteDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!paletteDropdown.contains(e.target) && e.target !== paletteBtn) {
        paletteDropdown.classList.remove('active');
    }
});

paletteOptions.forEach(option => {
    option.addEventListener('click', () => {
        const palette = option.dataset.palette;
        
        // Remove active class from all options
        paletteOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Set palette on document
        document.documentElement.setAttribute('data-palette', palette);
        
        // Save to localStorage
        localStorage.setItem('colorPalette', palette);
        
        // Close dropdown
        paletteDropdown.classList.remove('active');
    });
});

// Load saved palette
const savedPalette = localStorage.getItem('colorPalette');
if (savedPalette) {
    document.documentElement.setAttribute('data-palette', savedPalette);
    const activeOption = document.querySelector(`[data-palette="${savedPalette}"]`);
    if (activeOption) {
        paletteOptions.forEach(opt => opt.classList.remove('active'));
        activeOption.classList.add('active');
    }
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
}

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Animations with Intersection Observer
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all animatable elements
const animateElements = document.querySelectorAll(
    '.about-content, .skill-card, .project-card, .why-card, .blog-card'
);

animateElements.forEach(el => observer.observe(el));

// Testimonials Carousel
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].classList.add('active');
    testimonialDots[index].classList.add('active');
}

nextBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
});

prevBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
});

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(currentTestimonial);
    });
});

// Auto-play testimonials
let testimonialInterval = setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Pause auto-play on hover
const testimonialsWrapper = document.querySelector('.testimonials-wrapper');
testimonialsWrapper.addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
});

testimonialsWrapper.addEventListener('mouseleave', () => {
    testimonialInterval = setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }, 5000);
});

// Contact Form Handling
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    formMessage.className = 'form-message';
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let hasError = false;
    
    // Validate name
    if (name === '') {
        document.getElementById('nameError').textContent = 'Name is required';
        document.getElementById('name').closest('.form-group').classList.add('error');
        hasError = true;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        document.getElementById('emailError').textContent = 'Email is required';
        document.getElementById('email').closest('.form-group').classList.add('error');
        hasError = true;
    } else if (!emailRegex.test(email)) {
        document.getElementById('emailError').textContent = 'Please enter a valid email';
        document.getElementById('email').closest('.form-group').classList.add('error');
        hasError = true;
    }
    
    // Validate message
    if (message === '') {
        document.getElementById('messageError').textContent = 'Message is required';
        document.getElementById('message').closest('.form-group').classList.add('error');
        hasError = true;
    }
    
    if (hasError) return;
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.classList.add('loading');
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        formMessage.textContent = 'Thank you! Your message has been sent successfully.';
        formMessage.className ='form-message success';
contactForm.reset();
// Hide success message after 5 seconds
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}, 2000);
});
// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
let current = '';
sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
    }
});

navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
    }
});
});