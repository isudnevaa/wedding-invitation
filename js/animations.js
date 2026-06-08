/**
 * Scroll Animations
 * Handles intersection observer animations for scroll-triggered effects
 */

class ScrollAnimations {
    constructor(options = {}) {
        this.config = {
            rootMargin: options.rootMargin || '0px 0px -50px 0px',
            threshold: options.threshold || 0.1,
            staggerDelay: options.staggerDelay || 100
        };

        this.observers = new Map();
        this.init();
    }

    /**
     * Initialize all scroll animations
     */
    init() {
        this.observeFadeIn();
        this.observeFadeInUp();
        this.observeFadeInLeft();
        this.observeFadeInRight();
        this.observeScaleIn();
        this.observeStaggered();
        this.observeTimeline();
        this.observeSchedule();
        this.observeCards();
    }

    /**
     * Create intersection observer
     */
    createObserver(callback, config = {}) {
        const options = {
            rootMargin: config.rootMargin || this.config.rootMargin,
            threshold: config.threshold || this.config.threshold
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target, entry);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        return observer;
    }

    /**
     * Observe fade-in animations
     */
    observeFadeIn() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (elements.length === 0) return;

        const observer = this.createObserver((element) => {
            element.classList.add('is-visible');
        });

        elements.forEach(el => observer.observe(el));
        this.observers.set('fadeIn', observer);
    }

    /**
     * Observe fade-in-up animations
     */
    observeFadeInUp() {
        const elements = document.querySelectorAll('.fade-in-up:not(.hero__name):not(.hero__ampersand):not(.hero__subtitle)');
        if (elements.length === 0) return;

        const observer = this.createObserver((element) => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.animation = 'fadeInUp 0.8s ease forwards';
            }, this.getDelay(element));
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
        this.observers.set('fadeInUp', observer);
    }

    /**
     * Observe fade-in-left animations
     */
    observeFadeInLeft() {
        const elements = document.querySelectorAll('.fade-in-left');
        if (elements.length === 0) return;

        const observer = this.createObserver((element) => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.animation = 'fadeInLeft 0.8s ease forwards';
            }, this.getDelay(element));
        });

        elements.forEach(el => observer.observe(el));
        this.observers.set('fadeInLeft', observer);
    }

    /**
     * Observe fade-in-right animations
     */
    observeFadeInRight() {
        const elements = document.querySelectorAll('.fade-in-right');
        if (elements.length === 0) return;

        const observer = this.createObserver((element) => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.animation = 'fadeInRight 0.8s ease forwards';
            }, this.getDelay(element));
        });

        elements.forEach(el => observer.observe(el));
        this.observers.set('fadeInRight', observer);
    }

    /**
     * Observe scale-in animations
     */
    observeScaleIn() {
        const elements = document.querySelectorAll('.scale-in');
        if (elements.length === 0) return;

        const observer = this.createObserver((element) => {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.animation = 'scaleIn 0.6s ease forwards';
            }, this.getDelay(element));
        });

        elements.forEach(el => observer.observe(el));
        this.observers.set('scaleIn', observer);
    }

    /**
     * Observe staggered animations
     */
    observeStaggered() {
        const containers = document.querySelectorAll('[data-stagger]');
        if (containers.length === 0) return;

        containers.forEach(container => {
            const children = container.children;
            const delay = parseInt(container.dataset.stagger) || this.config.staggerDelay;

            const observer = this.createObserver((element) => {
                Array.from(children).forEach((child, index) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(20px)';
                    child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * delay);
                });
            });

            observer.observe(container);
        });
    }

    /**
     * Observe timeline items
     */
    observeTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        if (items.length === 0) return;

        const observer = this.createObserver((element) => {
            element.classList.add('is-visible');
        }, { threshold: 0.3 });

        items.forEach(el => observer.observe(el));
        this.observers.set('timeline', observer);
    }

    /**
     * Observe schedule items
     */
    observeSchedule() {
        const items = document.querySelectorAll('.schedule-item');
        if (items.length === 0) return;

        const observer = this.createObserver((element) => {
            element.classList.add('is-visible');
        }, { threshold: 0.3 });

        items.forEach(el => observer.observe(el));
        this.observers.set('schedule', observer);
    }

    /**
     * Observe card animations
     */
    observeCards() {
        const cards = document.querySelectorAll('.wish-card, .outfit-card');
        if (cards.length === 0) return;

        const observer = this.createObserver((element) => {
            element.classList.add('is-visible');
        }, { threshold: 0.2 });

        cards.forEach(el => observer.observe(el));
        this.observers.set('cards', observer);
    }

    /**
     * Get delay for element based on data attribute or position
     */
    getDelay(element) {
        const dataDelay = element.dataset.delay;
        if (dataDelay) {
            return parseInt(dataDelay);
        }

        // Calculate based on element position in parent
        const parent = element.parentElement;
        if (parent) {
            const index = Array.from(parent.children).indexOf(element);
            return index * this.config.staggerDelay;
        }

        return 0;
    }

    /**
     * Animate hero elements on load
     */
    animateHero() {
        const heroNames = document.querySelectorAll('.hero__name');
        const heroAmpersand = document.querySelector('.hero__ampersand');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroDate = document.querySelector('.hero__date');
        const heroCta = document.querySelector('.hero__cta');
        const heroCountdown = document.querySelector('.hero__countdown');

        // Animate names
        heroNames.forEach((name, index) => {
            setTimeout(() => {
                name.classList.add('animate');
            }, index * 300);
        });

        // Animate ampersand
        setTimeout(() => {
            if (heroAmpersand) heroAmpersand.classList.add('animate');
        }, 600);

        // Animate subtitle
        setTimeout(() => {
            if (heroSubtitle) {
                heroSubtitle.style.opacity = '0';
                heroSubtitle.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        }, 900);

        // Animate date
        setTimeout(() => {
            if (heroDate) {
                heroDate.style.opacity = '0';
                heroDate.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        }, 1100);

        // CTA and countdown have their own animations in CSS
    }

    /**
     * Trigger hero reveal animation
     */
    revealHero() {
        const heroContent = document.querySelector('.hero__content');
        if (!heroContent) return;

        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';

            setTimeout(() => {
                this.animateHero();
            }, 300);
        }, 100);
    }

    /**
     * Hide hero (for transition)
     */
    hideHero() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        hero.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
        hero.style.transform = 'translateY(-100%)';
        hero.style.opacity = '0';
    }

    /**
     * Reveal main content
     */
    revealMainContent() {
        const mainContent = document.getElementById('mainContent');
        if (!mainContent) return;

        mainContent.classList.add('visible');

        // Trigger scroll animations for visible elements
        setTimeout(() => {
            this.refresh();
        }, 300);
    }

    /**
     * Refresh all observers (check elements that should be visible)
     */
    refresh() {
        this.observers.forEach(observer => {
            // Reconnect observer to trigger check
        });
    }

    /**
     * Disconnect all observers
     */
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }
}

// Animation controller for special effects
class AnimationController {
    constructor() {
        this.animations = new Map();
    }

    /**
     * Add custom animation
     */
    addAnimation(name, callback) {
        this.animations.set(name, callback);
    }

    /**
     * Run animation by name
     */
    run(name, ...args) {
        const animation = this.animations.get(name);
        if (animation) {
            animation(...args);
        }
    }

    /**
     * Heartbeat animation
     */
    heartbeat(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'heartBeat 1.5s ease-in-out';
        }, 10);
    }

    /**
     * Pulse animation
     */
    pulse(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'pulse 2s ease-in-out infinite';
        }, 10);
    }

    /**
     * Glow animation
     */
    glow(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'glow 2s ease-in-out infinite';
        }, 10);
    }

    /**
     * Float animation
     */
    float(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'float 3s ease-in-out infinite';
        }, 10);
    }

    /**
     * Shimmer effect
     */
    shimmer(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'shimmer 2s infinite';
        }, 10);
    }

    /**
     * Bounce animation
     */
    bounce(element) {
        element.style.animation = 'none';
        setTimeout(() => {
            element.style.animation = 'bounce 2s ease';
        }, 10);
    }
}

// Initialize scroll animations
let scrollAnimations;
let animationController;

function initScrollAnimations() {
    scrollAnimations = new ScrollAnimations();
    animationController = new AnimationController();

    // Reveal hero on load
    if (document.readyState === 'complete') {
        scrollAnimations.revealHero();
    } else {
        window.addEventListener('load', () => {
            scrollAnimations.revealHero();
        });
    }
}

// Open invitation animation
function openInvitation() {
    const hero = document.querySelector('.hero');
    const mainContent = document.getElementById('mainContent');

    if (!hero || !mainContent) return;

    // Scroll to main content
    setTimeout(() => {
        Utils.scrollTo('#mainContent', 0);
        scrollAnimations.revealMainContent();

        // Confetti celebration!
        setTimeout(() => {
            if (typeof triggerConfettiCannons === 'function') {
                triggerConfettiCannons();
            }
        }, 800);
    }, 300);

    // Mark as opened
    localStorage.setItem('invitationOpened', 'true');
}

// Check if invitation was opened before
function checkInvitationOpened() {
    const opened = localStorage.getItem('invitationOpened');
    if (opened === 'true') {
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.add('visible');
        }
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initScrollAnimations();
        checkInvitationOpened();
    });
} else {
    initScrollAnimations();
    checkInvitationOpened();
}
