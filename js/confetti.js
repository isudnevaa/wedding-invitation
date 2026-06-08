/**
 * Confetti Effect with Hearts
 * Beautiful celebration effect for special moments
 */

class HeartConfetti {
    constructor(options = {}) {
        this.config = {
            particleCount: options.particleCount || 100,
            spread: options.spread || 180,
            origin: options.origin || { x: 0.5, y: 0.5 },
            colors: options.colors || ['#D4AF37', '#E8B4B8', '#C8A2C8', '#F4E4BC', '#E8DCC8'],
            gravity: options.gravity || 0.5,
            drift: options.drift || 0,
            shapes: options.shapes || ['heart', 'heart', 'heart'], // All hearts
            scalar: options.scalar || 1.2,
            velocity: options.velocity || 35
        };
    }

    /**
     * Create confetti burst
     */
    burst(options = {}) {
        const config = { ...this.config, ...options };

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        container.style.overflow = 'hidden';
        document.body.appendChild(container);

        // Create particles
        for (let i = 0; i < config.particleCount; i++) {
            this.createHeart(container, config, i);
        }

        // Remove container after animation
        setTimeout(() => {
            document.body.removeChild(container);
        }, 4000);
    }

    /**
     * Create single heart particle
     */
    createHeart(container, config, index) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 16 + 12}px`;
        heart.style.userSelect = 'none';
        heart.style.willChange = 'transform';
        heart.style.marginLeft = '-10px';
        heart.style.marginTop = '-10px';

        // Random starting position
        const startX = config.origin.x * window.innerWidth;
        const startY = config.origin.y * window.innerHeight;

        // Random angle
        const angle = (Math.random() - 0.5) * config.spread * (Math.PI / 180);
        const velocity = config.velocity * (0.5 + Math.random() * 0.5);

        // Physics
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        const gravity = config.gravity * 20;
        const drift = config.drift * 2;
        const scalar = config.scalar;

        heart.style.transform = `translate(${startX}px, ${startY}px)`;
        container.appendChild(heart);

        // Animate
        let x = startX;
        let y = startY;
        let vx_copy = vx;
        let vy_copy = vy;
        let rotation = Math.random() * 360;
        let opacity = 1;
        let scale = 0;

        const animate = () => {
            // Physics
            vy_copy += gravity;
            x += vx_copy;
            y += vy_copy;
            vx_copy += drift;
            rotation += 2;

            // Fade out
            if (y > window.innerHeight * 0.8) {
                opacity -= 0.02;
            }

            // Scale in
            if (scale < 1) {
                scale += 0.05;
            }

            // Apply
            heart.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
            heart.style.opacity = opacity;

            if (opacity > 0 && y < window.innerHeight + 50) {
                requestAnimationFrame(animate);
            }
        };

        // Start animation with staggered delay
        setTimeout(() => {
            requestAnimationFrame(animate);
        }, Math.random() * 500);
    }

    /**
     * Single beautiful heart - appear and pulse
     */
    rain(options = {}) {
        const config = {
            x: options.x || 0.5,
            y: options.y || 0.5,
            size: options.size || 80,
            duration: options.duration || 2000,
            ...options
        };

        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = `${config.size}px`;
        heart.style.transform = 'translate(-50%, -50%) scale(0)';
        heart.style.opacity = '0';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9999';
        heart.style.transition = 'all 0.5s ease';
        heart.style.filter = 'drop-shadow(0 0 20px rgba(228, 180, 188, 0.5))';
        document.body.appendChild(heart);

        // Animate in
        requestAnimationFrame(() => {
            heart.style.transform = 'translate(-50%, -50%) scale(1)';
            heart.style.opacity = '1';

            // Pulse effect
            setTimeout(() => {
                heart.style.transform = 'translate(-50%, -50%) scale(1.2)';
                setTimeout(() => {
                    heart.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 200);
            }, 200);
        });

        // Fade out
        setTimeout(() => {
            heart.style.opacity = '0';
            heart.style.transform = 'translate(-50%, -50%) scale(1.5)';
            setTimeout(() => {
                document.body.removeChild(heart);
            }, 500);
        }, config.duration);
    }

    /**
     * Explosion from center
     */
    explode(options = {}) {
        this.burst({
            particleCount: 80,
            spread: 360,
            velocity: 40,
            gravity: 0.6,
            ...options
        });
    }

    /**
     * Side cannons effect
     */
    cannons(options = {}) {
        const leftCannon = () => {
            this.burst({
                particleCount: 30,
                spread: 60,
                origin: { x: 0.1, y: 0.8 },
                velocity: 35,
                gravity: 0.5,
                ...options
            });
        };

        const rightCannon = () => {
            this.burst({
                particleCount: 30,
                spread: 120,
                origin: { x: 0.9, y: 0.8 },
                velocity: 35,
                gravity: 0.5,
                ...options
            });
        };

        leftCannon();
        setTimeout(rightCannon, 200);
        setTimeout(leftCannon, 400);
        setTimeout(rightCannon, 600);
    }

    /**
     * Floating hearts (subtle effect)
     */
    float(options = {}) {
        const config = {
            count: options.count || 15,
            duration: options.duration || 5000,
            ...options
        };

        for (let i = 0; i < config.count; i++) {
            setTimeout(() => {
                this.burst({
                    particleCount: 1,
                    spread: 30,
                    origin: {
                        x: 0.2 + Math.random() * 0.6,
                        y: 1.1
                    },
                    velocity: 15,
                    gravity: -0.3,
                    drift: Math.random() - 0.5
                });
            }, i * 300);
        }
    }
}

// Initialize global instance
let confetti;

function initConfetti() {
    confetti = new HeartConfetti({
        particleCount: 80,
        colors: ['#D4AF37', '#E8B4B8', '#C8A2C8', '#F4E4BC', '#E8DCC8'],
        gravity: 0.5
    });
}

// Trigger functions
function triggerConfetti() {
    if (confetti) {
        confetti.explode();
    }
}

function triggerConfettiRain() {
    if (confetti) {
        // Show 3 beautiful hearts one after another
        confetti.rain({ duration: 2000 });
        setTimeout(() => confetti.rain({ size: 100, duration: 2000 }), 700);
        setTimeout(() => confetti.rain({ size: 120, duration: 2000 }), 1400);
    }
}

function triggerConfettiCannons() {
    if (confetti) {
        confetti.cannons();
    }
}

function triggerFloatingHearts() {
    if (confetti) {
        confetti.float({ count: 20, duration: 6000 });
    }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfetti);
} else {
    initConfetti();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HeartConfetti };
}
