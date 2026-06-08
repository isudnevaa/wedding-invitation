/**
 * Wedding Invitation Main Application
 * Coordinates all modules and handles user interactions
 */

class WeddingInvitation {
    constructor() {
        this.modules = {};
        this.isInvitationOpened = false;
        this.initialized = false;
    }

    /**
     * Initialize application
     */
    init() {
        if (this.initialized) return;

        console.log('🎊 Wedding Invitation initializing...');

        // Wait for preloader
        this.hidePreloader();

        // Initialize all modules
        this.initModules();

        // Bind events
        this.bindEvents();

        // Check invitation state
        this.checkInvitationState();

        // Track page view
        this.trackPageView();

        this.initialized = true;

        console.log('✅ Wedding Invitation initialized');
    }

    /**
     * Hide preloader
     */
    hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (!preloader) return;

        // Minimum preloader display time
        const minDisplayTime = 1500;
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDisplayTime - elapsed);

            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, remaining);
        }, { once: true });
    }

    /**
     * Initialize all modules
     */
    initModules() {
        // Particles are initialized in particles.js
        // Scroll animations are initialized in animations.js
        // Countdown is initialized in countdown.js
        // Music is initialized in music.js
        // RSVP is initialized in rsvp.js

        // Store references
        this.modules.particles = typeof particlesInstance !== 'undefined' ? particlesInstance : null;
        this.modules.scrollAnimations = typeof scrollAnimations !== 'undefined' ? scrollAnimations : null;
        this.modules.countdown = typeof countdownInstance !== 'undefined' ? countdownInstance : null;
        this.modules.music = typeof musicController !== 'undefined' ? musicController : null;
        this.modules.rsvp = typeof rsvpForm !== 'undefined' ? rsvpForm : null;
    }

    /**
     * Bind global events
     */
    bindEvents() {
        // Open invitation button
        const openBtn = document.getElementById('openInvitation');
        if (openBtn) {
            openBtn.addEventListener('click', () => this.openInvitation());
        }

        // Copy address button
        const copyAddressBtn = document.getElementById('copyAddress');
        if (copyAddressBtn) {
            copyAddressBtn.addEventListener('click', () => this.copyAddress());
        }

        // Route button
        const routeBtn = document.getElementById('routeBtn');
        if (routeBtn) {
            routeBtn.addEventListener('click', () => this.openRoute());
        }

        // Share button
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareInvitation());
        }

        // Swatch color copy
        document.querySelectorAll('.swatch').forEach(swatch => {
            swatch.addEventListener('click', () => this.copyColor(swatch));
        });

        // Scroll progress indicator (optional)
        this.initScrollProgress();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    /**
     * Open invitation (scroll to content)
     */
    openInvitation() {
        if (this.isInvitationOpened) {
            // Already opened, scroll to top
            Utils.scrollTo('#mainContent', 0);
            return;
        }

        this.isInvitationOpened = true;

        // Trigger open invitation animation
        if (this.modules.scrollAnimations) {
            openInvitation();
        } else {
            // Fallback
            Utils.scrollTo('#mainContent', 0);
        }

        // Try to start music on user interaction
        if (this.modules.music && !this.modules.music.isMusicPlaying()) {
            setTimeout(() => {
                this.modules.music.play(true);
            }, 500);
        }

        // Track event
        this.trackEvent('invitation_opened');
    }

    /**
     * Copy address to clipboard
     */
    async copyAddress() {
        const addressEl = document.getElementById('address');
        if (!addressEl) return;

        const address = addressEl.textContent.trim();
        const success = await Utils.copyToClipboard(address);

        if (success) {
            Utils.showToast('Адрес скопирован: ' + address);
            this.trackEvent('address_copied');
        } else {
            Utils.showToast('Не удалось скопировать адрес');
        }
    }

    /**
     * Open maps route
     */
    openRoute() {
        const addressEl = document.getElementById('address');
        const address = addressEl ? addressEl.textContent.trim() : 'Улица Свадебная, д. 1, Москва';

        Utils.openMaps(address, 55.7558, 37.6176);
        this.trackEvent('route_opened');
    }

    /**
     * Share invitation
     */
    async shareInvitation() {
        const shareData = {
            title: 'Свадьба Ирины и Дмитрия',
            text: 'Приглашаем вас на нашу свадьбу! 15 августа 2026',
            url: window.location.href
        };

        const success = await Utils.shareContent(shareData);

        if (success) {
            this.trackEvent('invitation_shared');
        }
    }

    /**
     * Copy color from swatch
     */
    async copyColor(swatch) {
        const color = swatch.dataset.color;
        const name = swatch.querySelector('.swatch__name')?.textContent || color;

        const success = await Utils.copyToClipboard(color);

        if (success) {
            Utils.showToast(`${name}: ${color}`);
            this.trackEvent('color_copied', { color, name });
        }
    }

    /**
     * Check invitation state from localStorage
     */
    checkInvitationState() {
        const opened = localStorage.getItem('invitationOpened');
        if (opened === 'true') {
            this.isInvitationOpened = true;

            // Show main content
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.classList.add('visible');
            }
        }
    }

    /**
     * Initialize scroll progress indicator
     */
    initScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.id = 'scrollProgress';
        document.body.appendChild(progressBar);

        // Update on scroll
        const updateProgress = Utils.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / scrollHeight) * 100;

            progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }, 50);

        window.addEventListener('scroll', updateProgress);
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Don't trigger if user is typing in an input
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
            return;
        }

        switch(e.key) {
            case 'm':
            case 'M':
                // Toggle music
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (this.modules.music) {
                        this.modules.music.toggle();
                    }
                }
                break;

            case 'ArrowDown':
                // Scroll to next section
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.scrollToNextSection();
                }
                break;

            case 'ArrowUp':
                // Scroll to previous section
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.scrollToPrevSection();
                }
                break;

            case 'Home':
                // Scroll to top
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                break;

            case 'End':
                // Scroll to bottom
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
                break;
        }
    }

    /**
     * Scroll to next section
     */
    scrollToNextSection() {
        const sections = document.querySelectorAll('section');
        const currentScroll = window.pageYOffset + 100;

        for (const section of sections) {
            if (section.offsetTop > currentScroll) {
                Utils.scrollTo(section, 0);
                return;
            }
        }
    }

    /**
     * Scroll to previous section
     */
    scrollToPrevSection() {
        const sections = Array.from(document.querySelectorAll('section')).reverse();
        const currentScroll = window.pageYOffset - 100;

        for (const section of sections) {
            if (section.offsetTop < currentScroll) {
                Utils.scrollTo(section, 0);
                return;
            }
        }
    }

    /**
     * Track page view
     */
    trackPageView() {
        const urlParams = Utils.getUrlParams();
        this.trackEvent('page_view', { urlParams });

        // Track time on page
        this.startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - this.startTime;
            this.trackEvent('time_spent', { duration: timeSpent });
        });
    }

    /**
     * Track custom event
     */
    trackEvent(eventName, data = {}) {
        console.log('[Analytics]', eventName, data);

        // Store in analytics module if available
        if (typeof rsvpAnalytics !== 'undefined') {
            rsvpAnalytics.track(eventName, data);
        }
    }

    /**
     * Get app status
     */
    getStatus() {
        return {
            initialized: this.initialized,
            invitationOpened: this.isInvitationOpened,
            modules: {
                particles: !!this.modules.particles,
                scrollAnimations: !!this.modules.scrollAnimations,
                countdown: !!this.modules.countdown,
                music: !!this.modules.music,
                rsvp: !!this.modules.rsvp
            },
            music: {
                playing: this.modules.music ? this.modules.music.isMusicPlaying() : false
            },
            countdown: this.modules.countdown ? this.modules.countdown.getRemaining() : null
        };
    }

    /**
     * Reset app state
     */
    reset() {
        localStorage.clear();
        location.reload();
    }

    /**
     * Destroy app
     */
    destroy() {
        // Destroy all modules
        if (this.modules.particles) {
            this.modules.particles.destroy();
        }
        if (this.modules.music) {
            this.modules.music.destroy();
        }
        if (this.modules.scrollAnimations) {
            this.modules.scrollAnimations.destroy();
        }
        if (this.modules.countdown) {
            this.modules.countdown.destroy();
        }
        if (this.modules.rsvp) {
            this.modules.rsvp.destroy();
        }

        this.initialized = false;
    }
}

// Global app instance
let app;

// Initialize application
function initApp() {
    app = new WeddingInvitation();
    app.init();

    // Expose to window for debugging
    window.WeddingApp = app;
    window.Utils = Utils;

    console.log('🎉 Wedding Invitation ready!');
    console.log('💡 Tip: Use Ctrl+M to toggle music, Arrow keys to navigate sections');
}

// Service Worker registration (PWA)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => {
                    console.log('Service Worker registered:', reg.scope);

                    // Check for updates
                    reg.addEventListener('updatefound', () => {
                        const newWorker = reg.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                Utils.showToast('Доступна новая версия. Обновите страницу!');
                            }
                        });
                    });
                })
                .catch(err => {
                    console.log('Service Worker registration failed:', err);
                });
        });
    }
}

// Handle online/offline status
function handleConnectivity() {
    function updateOnlineStatus() {
        if (navigator.onLine) {
            Utils.showToast('Вы онлайн');
            document.body.classList.remove('offline');
        } else {
            Utils.showToast('Вы оффлайн. Некоторые функции могут быть недоступны.');
            document.body.classList.add('offline');
        }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    updateOnlineStatus();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        registerServiceWorker();
        handleConnectivity();
    });
} else {
    initApp();
    registerServiceWorker();
    handleConnectivity();
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeddingInvitation };
}
