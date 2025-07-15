// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuToggle?.addEventListener('click', toggleMobileMenu);
mobileMenuClose?.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(185, 28, 28, 0.95) 100%)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, var(--red-primary) 0%, var(--red-dark) 100%)';
        header.style.backdropFilter = 'blur(10px)';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.benefit-card, .feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let target;
                
                if (text.includes('M+')) {
                    target = parseFloat(text) * 1000000;
                    stat.dataset.suffix = 'M+';
                } else if (text.includes('%')) {
                    target = parseFloat(text);
                    stat.dataset.suffix = '%';
                } else {
                    target = parseInt(text);
                    stat.dataset.suffix = '';
                }
                
                stat.textContent = '0';
                animateCounter(stat, target);
                
                // Add suffix after animation
                setTimeout(() => {
                    if (stat.dataset.suffix) {
                        stat.textContent += stat.dataset.suffix;
                    }
                }, 2000);
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Form Validation (if forms are added later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Add loading states to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Only add loading state for actual form submissions or API calls
        if (this.type === 'submit' || this.dataset.action) {
            this.classList.add('loading');
            this.disabled = true;
            
            // Remove loading state after 2 seconds (replace with actual API call)
            setTimeout(() => {
                this.classList.remove('loading');
                this.disabled = false;
            }, 2000);
        }
    });
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // FAQ navigation with Enter key
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
        e.target.click();
    }
});

// Add focus styles for keyboard navigation
document.addEventListener('DOMContentLoaded', () => {
    // Add tabindex to FAQ questions for keyboard accessibility
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });
    
    // Update aria-expanded when FAQ items are toggled
    const faqObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const faqItem = mutation.target;
                const question = faqItem.querySelector('.faq-question');
                const isActive = faqItem.classList.contains('active');
                question.setAttribute('aria-expanded', isActive.toString());
            }
        });
    });
    
    document.querySelectorAll('.faq-item').forEach(item => {
        faqObserver.observe(item, { attributes: true });
    });
});

// Performance optimization: Lazy load images
function lazyLoadImages() {
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

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add CSS classes for loading states
const style = document.createElement('style');
style.textContent = `
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: var(--red-primary);
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
    
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
`;

document.head.appendChild(style);

