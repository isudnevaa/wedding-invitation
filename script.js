// ========== Elements ==========
const mainScreen = document.getElementById('mainScreen');
const detailsScreen = document.getElementById('detailsScreen');
const openBtn = document.getElementById('openBtn');
const backBtn = document.getElementById('backBtn');
const rsvpBtn = document.getElementById('rsvpBtn');
const rsvpModal = document.getElementById('rsvpModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');
const rsvpForm = document.getElementById('rsvpForm');
const toast = document.getElementById('toast');

// Guest selector
const guestBtns = document.querySelectorAll('.guest-btn');
const guestInput = document.querySelector('.guest-picker input');

// Wedding date - 26 July 2026, 16:00
const weddingDate = new Date('2026-07-26T16:00:00');

// ========== Smooth Screen Transitions ==========
function openDetails() {
    mainScreen.classList.remove('active');
    detailsScreen.classList.add('active');
}

function closeDetails() {
    detailsScreen.classList.remove('active');
    mainScreen.classList.add('active');
}

// ========== Event Listeners ==========
openBtn.addEventListener('click', () => {
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    openDetails();
});

backBtn.addEventListener('click', () => {
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
    closeDetails();
});

// ========== Modal with smooth animation ==========
rsvpBtn.addEventListener('click', () => {
    rsvpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (navigator.vibrate) {
        navigator.vibrate(10);
    }
});

function hideModal() {
    rsvpModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalBackdrop.addEventListener('click', hideModal);
modalClose.addEventListener('click', hideModal);

// Close modal on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal.classList.contains('active')) {
        hideModal();
    }
});

// ========== Guest Selector with animation ==========
guestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.classList.contains('plus') ? 'plus' : 'minus';
        let value = parseInt(guestInput.value);

        if (action === 'plus' && value < 5) {
            value++;
        } else if (action === 'minus' && value > 1) {
            value--;
        }

        guestInput.value = value;
        guestInput.style.transform = 'scale(1.1)';
        setTimeout(() => {
            guestInput.style.transform = 'scale(1)';
        }, 150);

        if (navigator.vibrate) {
            navigator.vibrate(5);
        }
    });
});

// ========== Form Submit ==========
rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const data = Object.fromEntries(formData);

    console.log('RSVP:', data);

    showToast('Спасибо! Ждем вас на свадьбе');

    setTimeout(() => {
        hideModal();
        rsvpForm.reset();
        guestInput.value = '1';
    }, 2000);
});

// ========== Toast Notification ==========
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== Countdown ==========
function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');

    // Smooth number transition
    if (daysEl.textContent !== days.toString()) {
        animateNumber(daysEl, parseInt(daysEl.textContent) || 0, days, 500);
    }
    if (hoursEl.textContent !== hours.toString().padStart(2, '0')) {
        animateNumber(hoursEl, parseInt(hoursEl.textContent) || 0, hours, 500);
    }
    if (minutesEl.textContent !== minutes.toString().padStart(2, '0')) {
        animateNumber(minutesEl, parseInt(minutesEl.textContent) || 0, minutes, 500);
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const diff = end - start;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + diff * eased);

        element.textContent = current.toString().padStart(2, '0');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ========== Load Photos ==========
function loadPhotos() {
    // Uncomment when photos are ready:
    /*
    const groomPhoto = document.getElementById('groomPhoto');
    const bridePhoto = document.getElementById('bridePhoto');

    groomPhoto.innerHTML = '<img src="photos/groom.jpg" alt="Дмитрий">';
    bridePhoto.innerHTML = '<img src="photos/bride.jpg" alt="Ирина">';
    */

    console.log('💡 Добавьте фото в папку "photos/" и раскомментируйте код в loadPhotos()');
}

// ========== Swipe Gesture (Back) ==========
let touchStartX = 0;
let touchStartY = 0;

detailsScreen.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

detailsScreen.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Detect swipe right (back gesture)
    if (diffX < -80 && Math.abs(diffY) < 50) {
        const detailsContent = document.querySelector('.details-content');
        if (detailsContent.scrollTop <= 10) {
            closeDetails();
        }
    }
}, { passive: true });

// ========== Button Ripple Effect ==========
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos();
    updateCountdown();
    setInterval(updateCountdown, 60000);

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        // navigator.serviceWorker.register('sw.js');
    }

    console.log('💍 Дмитрий & Ирина | 26.07.2026');
});

// ========== Prevent scroll bounce on modal ==========
rsvpModal.addEventListener('touchmove', (e) => {
    if (e.target.closest('.modal-card')) {
        const { scrollTop, scrollHeight, clientHeight } = e.target.closest('.modal-card');
        if (scrollTop + clientHeight >= scrollHeight) {
            e.stopPropagation();
        }
    }
}, { passive: true });
