/**
 * RSVP Form Handler
 * Manages wedding RSVP form validation, submission, and success handling
 */

class RSVPForm {
    constructor(options = {}) {
        this.form = options.form || document.getElementById('rsvpForm');
        this.modal = options.modal || document.getElementById('successModal');
        this.config = {
            submitUrl: options.submitUrl || null,
            submitMethod: options.submitMethod || 'POST',
            onSuccess: options.onSuccess || null,
            onError: options.onError || null,
            storageKey: options.storageKey || 'wedding-rsvp-submitted'
        };

        this.isSubmitting = false;
        this.submittedData = null;

        if (this.form) {
            this.init();
        }
    }

    /**
     * Initialize form handlers
     */
    init() {
        this.bindEvents();
        this.loadSavedData();
        this.checkPreviousSubmission();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        this.form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        // Radio buttons
        this.form.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => this.clearRadioGroupError(radio.name));
        });

        // Attendance change - show/hide guests
        const attendanceRadios = this.form.querySelectorAll('input[name="attendance"]');
        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleAttendanceChange(radio.value));
        });

        // Diet checkbox - show/hide allergy details
        const allergyCheckbox = this.form.querySelector('input[value="allergies"]');
        if (allergyCheckbox) {
            allergyCheckbox.addEventListener('change', (e) => {
                const allergyGroup = document.getElementById('allergyGroup');
                if (allergyGroup) {
                    allergyGroup.style.display = e.target.checked ? 'block' : 'none';
                }
            });
        }

        // Modal close
        const closeModalBtn = document.getElementById('closeModal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.closeModal());
        }

        // Close modal on backdrop click
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    /**
     * Handle attendance change
     */
    handleAttendanceChange(value) {
        const guestsSelect = document.getElementById('guests');
        if (!guestsSelect) return;

        if (value === 'no') {
            guestsSelect.disabled = true;
            guestsSelect.value = '1';
            guestsSelect.parentElement.style.opacity = '0.5';
        } else {
            guestsSelect.disabled = false;
            guestsSelect.parentElement.style.opacity = '1';
        }
    }

    /**
     * Validate a single field
     */
    validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showError(field, 'Это поле обязательно для заполнения');
            return false;
        }

        if (field.type === 'email' && field.value && !Utils.isValidEmail(field.value)) {
            this.showError(field, 'Введите корректный email');
            return false;
        }

        if (field.type === 'tel' && field.value && !Utils.isValidPhone(field.value)) {
            this.showError(field, 'Введите корректный номер телефона');
            return false;
        }

        return true;
    }

    /**
     * Show error message
     */
    showError(field, message) {
        field.classList.add('error');

        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    /**
     * Clear error from field
     */
    clearError(field) {
        field.classList.remove('error');

        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
    }

    /**
     * Clear radio group error
     */
    clearRadioGroupError(name) {
        const group = this.form.querySelector(`input[name="${name}"]`);
        if (group) {
            const container = group.closest('.form-group');
            if (container) {
                const errorSpan = container.querySelector('.form-error');
                if (errorSpan) {
                    errorSpan.textContent = '';
                }
            }
        }
    }

    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;

        // Validate required text inputs
        this.form.querySelectorAll('.form-input[required], .form-textarea[required]').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validate radio groups
        const attendance = this.form.querySelector('input[name="attendance"]:checked');
        if (!attendance) {
            const group = this.form.querySelector('input[name="attendance"]');
            if (group) {
                const container = group.closest('.form-group');
                if (container) {
                    const errorSpan = container.querySelector('.form-error') || container.appendChild(document.createElement('span'));
                    errorSpan.className = 'form-error';
                    errorSpan.textContent = 'Пожалуйста, выберите вариант';
                }
            }
            isValid = false;
        }

        return isValid;
    }

    /**
     * Collect form data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Basic fields
        data.name = formData.get('name');
        data.attendance = formData.get('attendance');
        data.guests = formData.get('guests');
        data.message = formData.get('message');
        data.allergyDetails = formData.get('allergyDetails');

        // Diet preferences (multiple checkboxes)
        data.diet = [];
        this.form.querySelectorAll('input[name="diet"]:checked').forEach(checkbox => {
            data.diet.push(checkbox.value);
        });

        // Add timestamp
        data.submittedAt = new Date().toISOString();

        // Add user agent for analytics
        data.userAgent = navigator.userAgent;

        return data;
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        if (this.isSubmitting) return;

        // Validate form
        if (!this.validateForm()) {
            // Shake the form to indicate error
            this.form.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
                this.form.style.animation = '';
            }, 400);
            return;
        }

        // Collect data
        const data = this.getFormData();
        this.submittedData = data;

        // Show loading state
        this.setSubmitting(true);

        try {
            // Submit data
            await this.submitData(data);

            // Save to localStorage
            this.saveSubmission(data);

            // Show success
            this.showSuccess();

            // Reset form
            this.form.reset();

            // Call success callback
            if (this.config.onSuccess) {
                this.config.onSuccess(data);
            }

        } catch (error) {
            console.error('RSVP submission error:', error);

            // Показываем понятное сообщение
            let errorMessage = 'Произошла ошибка. Пожалуйста, попробуйте позже.';

            if (error.message.includes('сервер') || error.message.includes('сети')) {
                errorMessage = 'Не удалось подключиться к серверу. Проверьте интернет и попробуйте снова.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = 'Ошибка сервера. Пожалуйста, свяжитесь с нами.';
            }

            Utils.showToast(errorMessage);

            // Call error callback
            if (this.config.onError) {
                this.config.onError(error);
            }
        } finally {
            this.setSubmitting(false);
        }
    }

    /**
     * Submit data to server
     */
    async submitData(data) {
        if (!this.config.submitUrl) {
            // Demo mode - just log to console
            console.log('🎉 RSVP Form Submitted (Demo Mode):', data);
            Utils.showToast('Данные сохранены (демо режим)');
            return new Promise(resolve => setTimeout(resolve, 1000));
        }

        try {
            const response = await fetch(this.config.submitUrl, {
                method: this.config.submitMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            // Проверяем ответ от Google Script
            if (!result.success) {
                throw new Error(result.error || 'Ошибка при сохранении данных');
            }

            return result;

        } catch (error) {
            // CORS ошибки или другие проблемы сети
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                console.error('Ошибка сети:', error);
                throw new Error('Не удалось подключиться к серверу. Проверьте подключение к интернету.');
            }
            throw error;
        }
    }

    /**
     * Set submitting state
     */
    setSubmitting(isSubmitting) {
        this.isSubmitting = isSubmitting;

        const submitBtn = this.form.querySelector('.submit-btn');
        if (submitBtn) {
            if (isSubmitting) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            } else {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }

        // Disable all inputs during submission
        this.form.querySelectorAll('input, select, textarea').forEach(field => {
            field.disabled = isSubmitting;
        });
    }

    /**
     * Save submission to localStorage
     */
    saveSubmission(data) {
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    }

    /**
     * Load previously submitted data
     */
    loadSavedData() {
        const saved = localStorage.getItem(this.config.storageKey);
        if (saved) {
            try {
                this.submittedData = JSON.parse(saved);
                this.populateForm(this.submittedData);
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    /**
     * Populate form with saved data
     */
    populateForm(data) {
        // Basic fields
        if (data.name) {
            const nameField = this.form.querySelector('[name="name"]');
            if (nameField) nameField.value = data.name;
        }

        // Radio buttons
        if (data.attendance) {
            const radio = this.form.querySelector(`input[name="attendance"][value="${data.attendance}"]`);
            if (radio) {
                radio.checked = true;
                this.handleAttendanceChange(data.attendance);
            }
        }

        // Select
        if (data.guests) {
            const select = this.form.querySelector('[name="guests"]');
            if (select) select.value = data.guests;
        }

        // Checkboxes
        if (data.diet && Array.isArray(data.diet)) {
            data.diet.forEach(value => {
                const checkbox = this.form.querySelector(`input[name="diet"][value="${value}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    if (value === 'allergies') {
                        const allergyGroup = document.getElementById('allergyGroup');
                        if (allergyGroup) allergyGroup.style.display = 'block';
                    }
                }
            });
        }

        // Textarea
        if (data.message) {
            const textarea = this.form.querySelector('[name="message"]');
            if (textarea) textarea.value = data.message;
        }
    }

    /**
     * Check if previously submitted
     */
    checkPreviousSubmission() {
        const saved = localStorage.getItem(this.config.storageKey);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const submittedDate = new Date(data.submittedAt);
                const now = new Date();
                const daysSince = Math.floor((now - submittedDate) / (1000 * 60 * 60 * 24));

                // Show message if submitted recently
                if (daysSince < 7) {
                    setTimeout(() => {
                        Utils.showToast(`Вы уже подтвердили присутствие ${daysSince === 0 ? 'сегодня' : daysSince + ' дн. назад'}`);
                    }, 2000);
                }
            } catch (e) {
                console.error('Error checking previous submission:', e);
            }
        }
    }

    /**
     * Show success modal
     */
    showSuccess() {
        if (!this.modal) return;

        this.modal.classList.add('active');

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Focus trap
        Utils.trapFocus(this.modal);

        // Confetti celebration!
        if (typeof triggerConfetti === 'function') {
            setTimeout(() => {
                triggerConfettiRain();
            }, 300);
        }

        // Auto-close after delay
        setTimeout(() => {
            this.closeModal();
        }, 5000);
    }

    /**
     * Close modal
     */
    closeModal() {
        if (!this.modal) return;

        this.modal.classList.remove('active');

        // Restore body scroll
        document.body.style.overflow = '';
    }

    /**
     * Reset form
     */
    reset() {
        this.form.reset();
        this.submittedData = null;
        localStorage.removeItem(this.config.storageKey);

        // Reset visual states
        this.form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        this.form.querySelectorAll('.form-error').forEach(el => el.textContent = '');

        // Reset guests select
        const guestsSelect = document.getElementById('guests');
        if (guestsSelect) {
            guestsSelect.disabled = false;
            guestsSelect.parentElement.style.opacity = '1';
        }

        // Hide allergy group
        const allergyGroup = document.getElementById('allergyGroup');
        if (allergyGroup) {
            allergyGroup.style.display = 'none';
        }
    }

    /**
     * Get submission statistics (for admin)
     */
    getStats() {
        if (!this.submittedData) return null;

        return {
            submitted: !!this.submittedData,
            attendance: this.submittedData.attendance,
            guests: parseInt(this.submittedData.guests) || 1,
            submittedAt: new Date(this.submittedData.submittedAt)
        };
    }

    /**
     * Destroy form handler
     */
    destroy() {
        if (this.form) {
            this.form.removeEventListener('submit', this.handleSubmit);
        }
    }
}

// RSVP Analytics (simple tracker)
class RSVPAnalytics {
    constructor() {
        this.events = [];
        this.storageKey = 'wedding-rsvp-analytics';
    }

    /**
     * Track event
     */
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString()
        };

        this.events.push(event);
        this.saveEvents();

        console.log('[RSVP Analytics]', eventName, data);
    }

    /**
     * Save events to localStorage
     */
    saveEvents() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.events.slice(-100))); // Keep last 100 events
        } catch (e) {
            console.error('Error saving analytics:', e);
        }
    }

    /**
     * Get events
     */
    getEvents() {
        return [...this.events];
    }

    /**
     * Clear events
     */
    clear() {
        this.events = [];
        localStorage.removeItem(this.storageKey);
    }
}

// Initialize RSVP form
let rsvpForm;
let rsvpAnalytics;

function initRSVP() {
    const form = document.getElementById('rsvpForm');
    if (!form) return;

    rsvpForm = new RSVPForm({
        form: form,
        modal: document.getElementById('successModal'),
        // 🎉 Для отправки данных на Email - создайте Google Apps Script
        // Инструкция: GOOGLE_APPS_SCRIPT.md в корне проекта
        // После создания вставьте URL ниже вместо null:
        submitUrl: 'https://script.google.com/macros/s/AKfycbyQFEjeqShiB0odh3dJ4RnaXRVfNLnzdOhoGvjsjL3-7kRXg-Nd9HFCAsIkOcydYfXdCw/exec', // ← Вставьте сюда URL: https://script.google.com/macros/s/.../exec
        submitMethod: 'POST',
        onSuccess: (data) => {
            rsvpAnalytics.track('rsvp_submitted', data);
        },
        onError: (error) => {
            rsvpAnalytics.track('rsvp_error', { error: error.message });
        }
    });

    rsvpAnalytics = new RSVPAnalytics();
    rsvpAnalytics.track('rsvp_loaded');

    console.log('RSVP form initialized');
}

// Export functions for external use
function submitRSVP() {
    if (rsvpForm) {
        rsvpForm.form.dispatchEvent(new Event('submit'));
    }
}

function resetRSVP() {
    if (rsvpForm) {
        rsvpForm.reset();
    }
}

function getRSVPStats() {
    return rsvpForm ? rsvpForm.getStats() : null;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRSVP);
} else {
    initRSVP();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RSVPForm, RSVPAnalytics };
}
