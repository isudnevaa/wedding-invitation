/**
 * Gold Particles Animation
 * Creates beautiful floating golden particles on canvas
 */

class GoldParticles {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;

        // Configuration
        this.config = {
            particleCount: options.particleCount || 50,
            minSize: options.minSize || 2,
            maxSize: options.maxSize || 6,
            minSpeed: options.minSpeed || 0.2,
            maxSpeed: options.maxSpeed || 0.8,
            minOpacity: options.minOpacity || 0.3,
            maxOpacity: options.maxOpacity || 0.8,
            color: options.color || '#D4AF37',
            connectionDistance: options.connectionDistance || 100,
            enabled: options.enabled !== false
        };

        this.resize();
        this.init();
    }

    /**
     * Resize canvas to full size
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    /**
     * Create initial particles
     */
    init() {
        this.particles = [];
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    /**
     * Create a single particle
     * @returns {Object} Particle object
     */
    createParticle() {
        const size = this.random(this.config.minSize, this.config.maxSize);
        const x = Math.random() * this.canvas.width;
        const y = Math.random() * this.canvas.height;
        const speedX = this.random(-this.config.maxSpeed, this.config.maxSpeed);
        const speedY = this.random(-this.config.maxSpeed, this.config.maxSpeed);
        const opacity = this.random(this.config.minOpacity, this.config.maxOpacity);
        const pulseSpeed = this.random(0.01, 0.03);
        const pulseOffset = Math.random() * Math.PI * 2;

        return {
            x,
            y,
            size,
            speedX,
            speedY,
            opacity,
            baseOpacity: opacity,
            pulseSpeed,
            pulseOffset,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: this.random(-0.02, 0.02)
        };
    }

    /**
     * Get random number between min and max
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Update particle position and properties
     */
    updateParticle(particle) {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Pulse effect
        particle.opacity = particle.baseOpacity + Math.sin(Date.now() * particle.pulseSpeed + particle.pulseOffset) * 0.2;
        particle.opacity = Math.max(0.1, Math.min(1, particle.opacity));

        // Rotation
        particle.rotation += particle.rotationSpeed;

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = this.canvas.width + particle.size;
        if (particle.x > this.canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = this.canvas.height + particle.size;
        if (particle.y > this.canvas.height + particle.size) particle.y = -particle.size;
    }

    /**
     * Draw a single particle
     */
    drawParticle(particle) {
        this.ctx.save();
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);

        // Create gradient for golden glow effect
        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        gradient.addColorStop(0, `rgba(212, 175, 55, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(212, 175, 55, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(212, 175, 55, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Add glow effect
        this.ctx.shadowBlur = particle.size * 2;
        this.ctx.shadowColor = this.config.color;
        this.ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity * 0.3})`;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    /**
     * Draw connections between nearby particles
     */
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * 0.2;
                    this.ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.config.enabled) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        // Draw connections
        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Start animation
     */
    start() {
        if (!this.animationId) {
            this.config.enabled = true;
            this.animate();
        }
    }

    /**
     * Stop animation
     */
    stop() {
        this.config.enabled = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Reset particles
     */
    reset() {
        this.init();
    }

    /**
     * Add particle at specific position
     */
    addParticle(x, y) {
        const particle = this.createParticle();
        particle.x = x;
        particle.y = y;
        this.particles.push(particle);
    }

    /**
     * Remove particle
     */
    removeParticle() {
        if (this.particles.length > 0) {
            this.particles.pop();
        }
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };

        // Adjust particle count if needed
        while (this.particles.length < this.config.particleCount) {
            this.particles.push(this.createParticle());
        }
        while (this.particles.length > this.config.particleCount) {
            this.particles.pop();
        }
    }

    /**
     * Handle window resize
     */
    onResize() {
        this.resize();
        this.reset();
    }

    /**
     * Destroy particles instance
     */
    destroy() {
        this.stop();
        this.particles = [];
        window.removeEventListener('resize', this.handleResize);
    }
}

// Initialize particles when DOM is ready
let particlesInstance;

function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    if (!canvas) return;

    particlesInstance = new GoldParticles(canvas, {
        particleCount: window.innerWidth < 768 ? 30 : 50,
        minSize: 2,
        maxSize: 5,
        minSpeed: 0.3,
        maxSpeed: 0.7,
        connectionDistance: 120
    });

    particlesInstance.start();

    // Handle resize
    const handleResize = Utils.debounce(() => {
        particlesInstance.onResize();
    }, 200);

    window.addEventListener('resize', handleResize);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
} else {
    initParticles();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoldParticles;
}
