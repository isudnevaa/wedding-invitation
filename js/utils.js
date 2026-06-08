/**
 * Utility functions for wedding invitation
 */

const Utils = {
    /**
     * Debounce function for performance optimization
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function for scroll events
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit = 100) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds
     */
    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = toast.querySelector('.toast__message');

        toastMessage.textContent = message;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, duration);
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    textArea.remove();
                    return true;
                } catch (err) {
                    textArea.remove();
                    return false;
                }
            }
        } catch (err) {
            console.error('Failed to copy text:', err);
            return false;
        }
    },

    /**
     * Get wedding date from localStorage or use default
     * @returns {Date} Wedding date object
     */
    getWeddingDate() {
        const stored = localStorage.getItem('weddingDate');
        if (stored) {
            return new Date(stored);
        }
        // Default date: August 15, 2026
        return new Date('2026-08-15T16:00:00');
    },

    /**
     * Save wedding date to localStorage
     * @param {Date|string} date - Date to save
     */
    saveWeddingDate(date) {
        localStorage.setItem('weddingDate', date.toISOString());
    },

    /**
     * Format date for display
     * @param {Date} date - Date to format
     * @returns {Object} Formatted date parts
     */
    formatDate(date) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('ru-RU', options);
        const parts = formatter.formatToParts(date);

        return {
            day: parts.find(p => p.type === 'day').value,
            month: parts.find(p => p.type === 'month').value,
            year: parts.find(p => p.type === 'year').value
        };
    },

    /**
     * Get mobile operating system
     * @returns {string} OS name ('ios', 'android', 'unknown')
     */
    getMobileOS() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'ios';
        }

        if (/android/i.test(userAgent)) {
            return 'android';
        }

        return 'unknown';
    },

    /**
     * Open maps application based on OS
     * @param {string} address - Address to navigate to
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    openMaps(address, lat = 56.8389, lng = 60.6057) {
        const os = this.getMobileOS();
        const encodedAddress = encodeURIComponent(address);
        let url;

        if (os === 'ios') {
            // Apple Maps
            url = `maps://?q=${encodedAddress}`;
        } else if (os === 'android') {
            // Google Maps app
            url = `geo:${lat},${lng}?q=${encodedAddress}`;
        } else {
            // Web Google Maps
            url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
        }

        window.open(url, '_blank');
    },

    /**
     * Share content using Web Share API or fallback
     * @param {Object} shareData - Share data
     * @returns {Promise<boolean>} Success status
     */
    async shareContent(shareData) {
        const defaultData = {
            title: 'Свадьба Ирины и Дмитрия',
            text: 'Приглашаем вас на нашу свадьбу! 15 августа 2026',
            url: window.location.href
        };

        const data = { ...defaultData, ...shareData };

        try {
            if (navigator.share) {
                await navigator.share(data);
                return true;
            } else {
                // Fallback: copy URL to clipboard
                const success = await this.copyToClipboard(data.url);
                if (success) {
                    this.showToast('Ссылка скопирована в буфер обмена');
                }
                return success;
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Share failed:', err);
            }
            return false;
        }
    },

    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} threshold - Threshold percentage
     * @returns {boolean} Is in viewport
     */
    isInViewport(element, threshold = 0.1) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        const vertPercent = (rect.height - Math.max(0, -rect.top, rect.top - windowHeight)) / rect.height;
        const horPercent = (rect.width - Math.max(0, -rect.left, rect.left - windowWidth)) / rect.width;

        return vertInView && horInView && (vertPercent >= threshold || horPercent >= threshold);
    },

    /**
     * Smooth scroll to element
     * @param {HTMLElement|string} target - Element or selector
     * @param {number} offset - Offset from top
     */
    scrollTo(target, offset = 0) {
        const element = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Parse URL parameters
     * @returns {Object} URL parameters
     */
    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const result = {};

        for (const [key, value] of params) {
            result[key] = value;
        }

        return result;
    },

    /**
     * Set URL parameter without reloading
     * @param {string} key - Parameter key
     * @param {string} value - Parameter value
     */
    setUrlParam(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.pushState({}, '', url);
    },

    /**
     * Generate random ID
     * @returns {string} Random ID
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} Is valid
     */
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Validate phone number (Russian format)
     * @param {string} phone - Phone to validate
     * @returns {boolean} Is valid
     */
    isValidPhone(phone) {
        const re = /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return re.test(phone);
    },

    /**
     * Format phone number for display
     * @param {string} phone - Phone number
     * @returns {string} Formatted phone
     */
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `+7 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
        }
        return phone;
    },

    /**
     * Get image placeholder URL
     * @param {number} width - Image width
     * @param {number} height - Image height
     * @param {string} text - Placeholder text
     * @returns {string} Placeholder URL
     */
    getPlaceholder(width = 400, height = 300, text = 'Изображение') {
        return `https://via.placeholder.com/${width}x${height}/D4AF37/FFFFFF?text=${encodeURIComponent(text)}`;
    },

    /**
     * Lazy load images
     */
    lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    },

    /**
     * Check if device is touch device
     * @returns {boolean} Is touch device
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    },

    /**
     * Add touch class to body if touch device
     */
    detectTouch() {
        if (this.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    },

    /**
     * Preload images
     * @param {Array<string>} urls - Array of image URLs
     * @returns {Promise} Load promise
     */
    preloadImages(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => reject(url);
                img.src = url;
            });
        });

        return Promise.all(promises);
    },

    /**
     * Get viewport dimensions
     * @returns {Object} Viewport dimensions
     */
    getViewport() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight
        };
    },

    /**
     * Check if element is focused
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} Is focused
     */
    isFocused(element) {
        return document.activeElement === element;
    },

    /**
     * Trap focus in modal
     * @param {HTMLElement} modal - Modal element
     */
    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Calculate time remaining to date
     * @param {Date} targetDate - Target date
     * @returns {Object} Time remaining
     */
    getTimeRemaining(targetDate) {
        const total = Date.parse(targetDate) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        return { total, days, hours, minutes, seconds };
    },

    /**
     * Pluralize Russian words
     * @param {number} count - Count
     * @param {Array<string>} forms - Word forms [one, few, many]
     * @returns {string} Pluralized word
     */
    pluralize(count, forms) {
        const cases = [2, 0, 1, 1, 1, 2];
        return forms[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
    },

    /**
     * Initialize all utilities
     */
    init() {
        this.detectTouch();
        this.lazyLoadImages();
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Utils.init());
} else {
    Utils.init();
}
