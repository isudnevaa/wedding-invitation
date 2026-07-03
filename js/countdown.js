/**
 * Wedding Countdown Timer
 * Displays time remaining until the wedding day
 */

class CountdownTimer {
    constructor(options = {}) {
        this.config = {
            weddingDate: options.weddingDate || Utils.getWeddingDate(),
            onUpdate: options.onUpdate || null,
            onComplete: options.onComplete || null,
            elements: {
                days: options.elements?.days || document.getElementById('days'),
                hours: options.elements?.hours || document.getElementById('hours'),
                minutes: options.elements?.minutes || document.getElementById('minutes'),
                seconds: options.elements?.seconds || document.getElementById('seconds')
            }
        };

        this.intervalId = null;
        this.isComplete = false;

        // Validate elements
        this.hasElements = Object.values(this.config.elements).every(el => el !== null);
    }

    /**
     * Calculate time remaining
     */
    getTimeRemaining() {
        const total = Date.parse(this.config.weddingDate) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        return { total, days, hours, minutes, seconds };
    }

    /**
     * Format number with leading zero
     */
    formatNumber(num) {
        return num < 10 ? `0${num}` : num;
    }

    /**
     * Update display
     */
    updateDisplay(time) {
        if (!this.hasElements) return;

        const elements = ['days', 'hours', 'minutes', 'seconds'];
        const values = [time.days, time.hours, time.minutes, time.seconds];

        elements.forEach((key, index) => {
            const element = this.config.elements[key];
            if (element) {
                const currentValue = parseInt(element.textContent);
                const newValue = values[index];

                // Add animation if value changed
                if (currentValue !== newValue && !isNaN(currentValue)) {
                    element.classList.add('changing');
                    setTimeout(() => {
                        element.classList.remove('changing');
                    }, 300);
                }

                element.textContent = this.formatNumber(newValue);
            }
        });

        // Call update callback
        if (this.config.onUpdate) {
            this.config.onUpdate(time);
        }
    }

    /**
     * Update countdown
     */
    update() {
        const time = this.getTimeRemaining();

        if (time.total <= 0) {
            this.stop();
            this.isComplete = true;
            this.updateDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });

            if (this.config.onComplete) {
                this.config.onComplete();
            }
            return;
        }

        this.updateDisplay(time);
    }

    /**
     * Start countdown
     */
    start() {
        if (this.intervalId) return;

        // Initial update
        this.update();

        // Start interval
        this.intervalId = setInterval(() => {
            this.update();
        }, 1000);
    }

    /**
     * Stop countdown
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    /**
     * Reset countdown
     */
    reset() {
        this.stop();
        this.isComplete = false;
        this.start();
    }

    /**
     * Update wedding date
     */
    setWeddingDate(date) {
        this.config.weddingDate = date;
        Utils.saveWeddingDate(date);
        this.reset();
    }

    /**
     * Get remaining time object
     */
    getRemaining() {
        return this.getTimeRemaining();
    }

    /**
     * Check if countdown is complete
     */
    isCompleted() {
        return this.isComplete;
    }

    /**
     * Destroy countdown instance
     */
    destroy() {
        this.stop();
        this.isComplete = true;
    }
}

// Countdown with animation effects
class AnimatedCountdown extends CountdownTimer {
    constructor(options) {
        super(options);
        this.previousValues = { days: null, hours: null, minutes: null, seconds: null };
    }

    /**
     * Update display with flip animation
     */
    updateDisplay(time) {
        if (!this.hasElements) return;

        const elements = ['days', 'hours', 'minutes', 'seconds'];
        const values = [time.days, time.hours, time.minutes, time.seconds];

        elements.forEach((key, index) => {
            const element = this.config.elements[key];
            if (element) {
                const newValue = values[index];
                const previousValue = this.previousValues[key];

                if (previousValue !== null && previousValue !== newValue) {
                    this.animateValueChange(element, previousValue, newValue);
                } else if (previousValue === null) {
                    element.textContent = this.formatNumber(newValue);
                }

                this.previousValues[key] = newValue;
            }
        });

        if (this.config.onUpdate) {
            this.config.onUpdate(time);
        }
    }

    /**
     * Animate value change
     */
    animateValueChange(element, oldValue, newValue) {
        const formattedNew = this.formatNumber(newValue);

        element.style.transform = 'rotateX(0deg)';
        element.style.transition = 'transform 0.3s ease';

        requestAnimationFrame(() => {
            element.style.transform = 'rotateX(-90deg)';

            setTimeout(() => {
                element.textContent = formattedNew;
                element.style.transform = 'rotateX(0deg)';
            }, 150);
        });
    }
}

// Initialize countdown
let countdownInstance;

function initCountdown() {
    const elements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    // Check if all elements exist
    const allExist = Object.values(elements).every(el => el !== null);

    if (!allExist) {
        console.warn('Countdown elements not found');
        return;
    }

    countdownInstance = new AnimatedCountdown({
        weddingDate: new Date('2026-07-26T14:00:00'),
        elements: elements,
        onUpdate: (time) => {
            // Optional: update document title
            const totalHours = time.days * 24 + time.hours;
            document.title = `${time.days}д ${time.hours}ч до свадьбы!`;
        },
        onComplete: () => {
            document.title = 'Сегодня свадьба Ирины и Дмитрия! 💒';
            Utils.showToast('Поздравляем! Сегодня особенный день! 💕');

            // Add celebration animation
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.classList.add('celebrating');
            }
        }
    });

    countdownInstance.start();
}

// Reset countdown to wedding date
function resetCountdown() {
    if (countdownInstance) {
        countdownInstance.setWeddingDate(new Date('2026-07-26T14:00:00'));
    }
}

// Update countdown with custom date
function updateCountdown(dateString) {
    try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            if (countdownInstance) {
                countdownInstance.setWeddingDate(date);
            }
            Utils.showToast('Дата свадьбы обновлена');
        } else {
            throw new Error('Invalid date');
        }
    } catch (err) {
        console.error('Invalid date format:', err);
        Utils.showToast('Неверный формат даты');
    }
}

// Get countdown status
function getCountdownStatus() {
    if (!countdownInstance) return null;

    const remaining = countdownInstance.getRemaining();
    const totalDays = Math.floor(remaining.total / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(remaining.total / (1000 * 60 * 60));

    return {
        isComplete: countdownInstance.isCompleted(),
        totalDays,
        totalHours,
        remaining
    };
}

// Format countdown for display
function formatCountdownText() {
    const status = getCountdownStatus();
    if (!status) return '';

    if (status.isComplete) {
        return 'Свадьба сегодня! 💒';
    }

    const { days, hours, minutes } = status.remaining;

    const dayText = Utils.pluralize(days, ['день', 'дня', 'дней']);
    const hourText = Utils.pluralize(hours, ['час', 'часа', 'часов']);
    const minuteText = Utils.pluralize(minutes, ['минута', 'минуты', 'минут']);

    return `${days} ${dayText}, ${hours} ${hourText} и ${minutes} ${minuteText} до свадьбы`;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountdown);
} else {
    initCountdown();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CountdownTimer, AnimatedCountdown };
}
