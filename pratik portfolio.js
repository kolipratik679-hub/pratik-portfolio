// ========================================
// COLOR PALETTES CONFIGURATION
// ========================================

const colorPalettes = {
    golden: {
        bgPrimary: '#1B1B1B',
        accentPrimary: '#F8B400',
        accentSecondary: '#E63946',
        textPrimary: '#FFFFFF',
        bgLight: '#FAFAFA',
        textLight: '#1B1B1B'
    },
    ocean: {
        bgPrimary: '#0A1929',
        accentPrimary: '#00D9FF',
        accentSecondary: '#7C3AED',
        textPrimary: '#E0F2FE',
        bgLight: '#F0F9FF',
        textLight: '#0A1929'
    },
    forest: {
        bgPrimary: '#1A2F1A',
        accentPrimary: '#7FFF00',
        accentSecondary: '#FFD700',
        textPrimary: '#F0FFF0',
        bgLight: '#F0FFF4',
        textLight: '#1A2F1A'
    },
    sunset: {
        bgPrimary: '#2D1B2E',
        accentPrimary: '#FF6B9D',
        accentSecondary: '#FFA400',
        textPrimary: '#FFF0F5',
        bgLight: '#FFF5F7',
        textLight: '#2D1B2E'
    },
    cyber: {
        bgPrimary: '#0D0D0D',
        accentPrimary: '#00FF41',
        accentSecondary: '#FF0080',
        textPrimary: '#F0F0F0',
        bgLight: '#F5F5F5',
        textLight: '#0D0D0D'
    },
    royal: {
        bgPrimary: '#1A0E2E',
        accentPrimary: '#C9A030',
        accentSecondary: '#9333EA',
        textPrimary: '#FAF5FF',
        bgLight: '#FAF5FF',
        textLight: '#1A0E2E'
    }
};

// ========================================
// THEME MANAGEMENT
// ========================================

class ThemeManager {
    constructor() {
        this.currentPalette = 'golden';
        this.isLightMode = false;
        this.init();
    }

    init() {
        // Load saved preferences
        const savedPalette = sessionStorage.getItem('palette');
        const savedTheme = sessionStorage.getItem('theme');
        
        if (savedPalette && colorPalettes[savedPalette]) {
            this.currentPalette = savedPalette;
            this.applyPalette(savedPalette);
        }
        
        if (savedTheme === 'light') {
            this.isLightMode = true;
            document.body.classList.add('light-mode');
        }
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Palette button
        const paletteBtn = document.getElementById('paletteBtn');
        const paletteDropdown = document.getElementById('paletteDropdown');
        
        paletteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            paletteDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!paletteDropdown.contains(e.target) && e.target !== paletteBtn) {
                paletteDropdown.classList.remove('active');
            }
        });

        // Palette options
        const paletteOptions = document.querySelectorAll('.palette-option');
        paletteOptions.forEach(option => {
            option.addEventListener('click', () => {
                const palette = option.dataset.palette;
                this.applyPalette(palette);
                paletteDropdown.classList.remove('active');
            });
        });
    }

    toggleTheme() {
        this.isLightMode = !this.isLightMode;
        document.body.classList.toggle('light-mode');
        sessionStorage.setItem('theme', this.isLightMode ? 'light' : 'dark');
    }

    applyPalette(paletteName) {
        const palette = colorPalettes[paletteName];
        if (!palette) return;

        const root = document.documentElement;
        
        // Apply colors with smooth transition
        root.style.setProperty('--bg-primary', palette.bgPrimary);
        root.style.setProperty('--accent-primary', palette.accentPrimary);
        root.style.setProperty('--accent-secondary', palette.accentSecondary);
        root.style.setProperty('--text-primary', palette.textPrimary);
        root.style.setProperty('--bg-light', palette.bgLight);
        root.style.setProperty('--text-light', palette.textLight);

        // Update secondary colors with opacity
        const textSecondary = this.hexToRgba(palette.textPrimary, 0.7);
        const textMuted = this.hexToRgba(palette.textPrimary, 0.5);
        const textSecondaryLight = this.hexToRgba(palette.textLight, 0.7);
        const textMutedLight = this.hexToRgba(palette.textLight, 0.5);
        
        root.style.setProperty('--text-secondary', textSecondary);
        root.style.setProperty('--text-muted', textMuted);
        root.style.setProperty('--text-secondary-light', textSecondaryLight);
        root.style.setProperty('--text-muted-light', textMutedLight);

        this.currentPalette = paletteName;
        sessionStorage.setItem('palette', paletteName);
    }

    hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
}

// ========================================
// SMOOTH SCROLL NAVIGATION
// ========================================

class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        const navLinks = document.querySelectorAll('.nav-link');
        const ctaButtons = document.querySelectorAll('.hero-cta a');
        
        [...navLinks, ...ctaButtons].forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.skillCards = document.querySelectorAll('.skill-card');
        this.init();
    }

    init() {
        this.setupObserver();
        this.animateSkillBars();
    }

    setupObserver() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.sections.forEach(section => {
            observer.observe(section);
        });

        this.skillCards.forEach(card => {
            observer.observe(card);
        });
    }

    animateSkillBars() {
        const skillFills = document.querySelectorAll('.skill-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const level = fill.getAttribute('data-level');
                    setTimeout(() => {
                        fill.style.width = level + '%';
                    }, 200);
                    observer.unobserve(fill);
                }
            });
        }, { threshold: 0.5 });

        skillFills.forEach(fill => {
            observer.observe(fill);
        });
    }
}

// ========================================
// ACTIVE NAVIGATION LINK
// ========================================

class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        const scrollPosition = window.scrollY + 150;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ========================================
// FORM HANDLING
// ========================================

class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Add focus animations
        const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show success message (in real implementation, this would send to server)
        this.showMessage('Thank you for reaching out! I will get back to you soon.', 'success');
        this.form.reset();
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-primary);
            color: var(--bg-primary);
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
        `;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => messageDiv.remove(), 500);
        }, 3000);
    }
}

// ========================================
// CURSOR EFFECTS (OPTIONAL ENHANCEMENT)
// ========================================

class CursorEffects {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .skill-card, .benefit-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images if any are added later
        if ('IntersectionObserver' in window) {
            this.lazyLoadImages();
        }

        // Debounce scroll events
        this.debounceScroll();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    debounceScroll() {
        let scrollTimer;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                // Scroll ended - perform any cleanup if needed
            }, 150);
        });
    }
}

// ========================================
// HEADER SCROLL BEHAVIOR
// ========================================

class HeaderBehavior {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add background on scroll
            if (currentScroll > 100) {
                this.header.style.background = 'rgba(27, 27, 27, 0.95)';
            } else {
                this.header.style.background = 'rgba(27, 27, 27, 0.8)';
            }

            this.lastScroll = currentScroll;
        });
    }
}

// ========================================
// ANIMATIONS KEYFRAMES (ADD TO CSS DYNAMICALLY)
// ========================================

function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .form-group.focused .form-label {
            color: var(--accent-primary);
        }

        .nav-link.active {
            color: var(--accent-primary);
        }

        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// INITIALIZE ALL MODULES
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Add dynamic styles
    addAnimationStyles();

    // Initialize all modules
    new ThemeManager();
    new SmoothScroll();
    new ScrollAnimations();
    new ActiveNavigation();
    new FormHandler();
    new CursorEffects();
    new PerformanceOptimizer();
    new HeaderBehavior();

    // Remove loading class if exists
    document.body.classList.remove('loading');

    // Console signature
    console.log('%cPratik\'s Portfolio', 'color: #F8B400; font-size: 24px; font-weight: bold;');
    console.log('%cCrafted with precision and passion', 'color: #E63946; font-size: 14px;');
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// EXPORT FOR POTENTIAL MODULE USE
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        SmoothScroll,
        ScrollAnimations,
        FormHandler
    };
}