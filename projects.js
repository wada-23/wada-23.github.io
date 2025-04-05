document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const setTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    themeToggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    });

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // Modal Handling
    window.openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex'; // Changed to flex
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = (modalId) => {
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    };

    // Image Viewer
    let currentImageIndex = 0;
    let currentImages = [];

    window.openImageViewer = (modalId, src) => {
        const modal = document.getElementById(modalId);
        currentImages = Array.from(modal.querySelectorAll('.image-gallery img'));
        currentImageIndex = currentImages.findIndex(img => img.getAttribute('src') === src);
        document.getElementById('expandedImage').src = src;
        document.getElementById('imageViewer').style.display = 'flex'; // Changed to flex
    };

    window.closeImageViewer = () => {
        document.getElementById('imageViewer').style.display = 'none';
    };

    window.prevImage = () => {
        currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
        document.getElementById('expandedImage').src = currentImages[currentImageIndex].getAttribute('src');
    };

    window.nextImage = () => {
        currentImageIndex = (currentImageIndex + 1) % currentImages.length;
        document.getElementById('expandedImage').src = currentImages[currentImageIndex].getAttribute('src');
    };

    // Close modals on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            closeImageViewer();
        }
    });

    // Mobile Menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const finalPosition = targetPosition - offset;

                window.scrollTo({
                    top: finalPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Back to Top Button Functionality
const backToTop = () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    let isScrolling;

    // Scroll Handler
    const handleScroll = () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            backToTopBtn.classList.toggle('active', scrollPosition > 300);
        }, 50);
    };

    // Click Handler with Smooth Scroll Polyfill
    const scrollToTop = () => {
        const startPosition = window.scrollY || document.documentElement.scrollTop;
        const duration = 600;
        const startTime = performance.now();

        const animateScroll = (timestamp) => {
            const timeElapsed = timestamp - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            window.scrollTo(0, startPosition * (1 - easeInOutCubic(progress)));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animateScroll);
            }
        };

        const easeInOutCubic = (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        };

        requestAnimationFrame(animateScroll);
    };

    // Event Listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    backToTopBtn.addEventListener('click', scrollToTop);
    backToTopBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            scrollToTop();
        }
    });

    // Initialize
    handleScroll(); // Check initial position
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', backToTop);