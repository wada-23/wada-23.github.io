document.addEventListener('DOMContentLoaded', () => {
    // ======================
    // Theme Toggle
    // ======================
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const setTheme = (theme) => {
        if (['light', 'dark'].includes(theme)) {
            body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            themeToggle.setAttribute('aria-label', `${theme} mode`);
        }
    };

    themeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    });

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // ======================
    // Mobile Menu
    // ======================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navRight = document.querySelector('.nav-right');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Toggle menu with animation support
    const toggleMenu = (shouldClose) => {
        const isOpen = mobileMenuBtn.classList.contains('open');
        const shouldOpen = typeof shouldClose === 'undefined' ? !isOpen : !shouldClose;

        mobileMenuBtn.classList.toggle('open', shouldOpen);
        navRight.classList.toggle('active', shouldOpen);
        mobileMenuBtn.setAttribute('aria-expanded', shouldOpen);
        document.body.classList.toggle('menu-open', shouldOpen);

        // Handle visibility for transitions
        if (shouldOpen) {
            navRight.style.visibility = 'visible';
        } else {
            navRight.addEventListener('transitionend', () => {
                navRight.style.visibility = 'hidden';
            }, { once: true });
        }
    };

    // Menu button click handler
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
        mobileMenuBtn.blur();
    });

    // Close menu interactions
    const closeMenu = () => {
        if (mobileMenuBtn.classList.contains('open')) {
            toggleMenu(true);
        }
    };

    // Click outside handler
    document.addEventListener('click', (e) => {
        if (!navRight.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) closeMenu();
        }, 100);
    });

    // Link click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Accessibility setup
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    navRight.setAttribute('aria-hidden', 'true');


    document.addEventListener('DOMContentLoaded', () => {
        const galleryOverlay = document.querySelector('.gallery-overlay');
        const mainImage = document.querySelector('.main-image');
        let currentImages = [];
        let currentImageIndex = 0;
    
        // Click handler for project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => {
                try {
                    currentImages = JSON.parse(card.dataset.images);
                    currentImageIndex = 0;
                    openGallery();
                } catch (error) {
                    console.error('Error parsing gallery images:', error);
                }
            });
        });
    
        // Gallery functions
        const openGallery = () => {
            if (currentImages.length === 0) return;
            
            galleryOverlay.style.display = 'flex';
            mainImage.src = currentImages[currentImageIndex];
            document.body.style.overflow = 'hidden';
        };
    
        const closeGallery = () => {
            galleryOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentImages = [];
        };
    
        const navigate = (direction) => {
            currentImageIndex = (currentImageIndex + direction + currentImages.length) % currentImages.length;
            mainImage.src = currentImages[currentImageIndex];
        };
    
        // Event listeners
        document.querySelector('.close-gallery').addEventListener('click', closeGallery);
        document.querySelector('.prev').addEventListener('click', () => navigate(-1));
        document.querySelector('.next').addEventListener('click', () => navigate(1));
    
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (galleryOverlay.style.display === 'flex') {
                if (e.key === 'Escape') closeGallery();
                if (e.key === 'ArrowLeft') navigate(-1);
                if (e.key === 'ArrowRight') navigate(1);
            }
        });
    
        // Close when clicking outside
        galleryOverlay.addEventListener('click', (e) => {
            if (e.target === galleryOverlay) closeGallery();
        });
    });

    // ======================
    // Smooth Scroll
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.hash);
            if (target) {
                e.preventDefault();
                const offset = 80;
                const targetTop = target.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: targetTop - offset,
                    behavior: 'smooth'
                });

                // Focus target for accessibility
                setTimeout(() => target.setAttribute('tabindex', '-1'), 500);
            }
        });
    });

    // ======================
    // Performance Optimizations
    // ======================
    // Cleanup transitionend listeners
    window.addEventListener('beforeunload', () => {
        navRight.removeEventListener('transitionend', () => {});
    });
});