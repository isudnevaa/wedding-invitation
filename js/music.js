/**
 * Background Music Controller
 * Handles background music playback with fade in/out and user preferences
 */

class MusicController {
    constructor(options = {}) {
        this.audio = options.audio || document.getElementById('bgMusic');
        this.button = options.button || document.getElementById('musicBtn');
        this.config = {
            fadeInDuration: options.fadeInDuration || 2000,
            fadeOutDuration: options.fadeOutDuration || 1000,
            volume: options.volume || 0.4,
            autoPlay: options.autoPlay !== false
        };

        this.isPlaying = false;
        this.isFadeInProgress = false;
        this.currentVolume = this.config.volume;
        this.initialVolume = this.audio.volume;

        this.init();
    }

    /**
     * Initialize music controller
     */
    init() {
        if (!this.audio || !this.button) {
            console.warn('Music elements not found');
            return;
        }

        // Set initial volume
        this.audio.volume = 0;

        // Check user preferences
        const musicPaused = localStorage.getItem('musicPaused');
        const shouldAutoPlay = this.config.autoPlay && musicPaused !== 'true';

        if (shouldAutoPlay) {
            // Try to autoplay (might be blocked by browsers)
            this.play(true);
        } else {
            this.updateButtonState();
        }

        // Bind events
        this.bindEvents();
    }

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Button click
        this.button.addEventListener('click', () => this.toggle());

        // Audio events
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateButtonState();
        });

        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateButtonState();
        });

        this.audio.addEventListener('pause', () => {
            if (!this.isFadeInProgress) {
                this.isPlaying = false;
                this.updateButtonState();
            }
        });

        // Handle visibility change (pause when tab hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isPlaying) {
                this.fadeOut().then(() => {
                    this.audio.pause();
                    this.currentVolume = this.config.volume;
                    this.audio.volume = 0;
                });
            }
        });

        // Handle page unload
        window.addEventListener('beforeunload', () => {
            if (this.isPlaying) {
                localStorage.setItem('musicPaused', 'false');
            } else {
                localStorage.setItem('musicPaused', 'true');
            }
        });
    }

    /**
     * Play music with fade in
     */
    async play(silent = false) {
        if (this.isPlaying) return;

        try {
            // Reset volume
            this.audio.volume = 0;

            // Attempt to play
            await this.audio.play();

            if (!silent) {
                // Fade in
                await this.fadeIn();
            } else {
                this.audio.volume = this.config.volume;
            }

            this.isPlaying = true;
            localStorage.setItem('musicPaused', 'false');
            this.updateButtonState();

        } catch (err) {
            console.log('Autoplay prevented:', err);

            // Show button if autoplay blocked
            if (!silent) {
                this.button.style.display = 'flex';
                this.button.classList.add('pulse');
                setTimeout(() => {
                    this.button.classList.remove('pulse');
                }, 3000);
            }
        }
    }

    /**
     * Pause music with fade out
     */
    async pause() {
        if (!this.isPlaying) return;

        await this.fadeOut();
        this.audio.pause();
        this.isPlaying = false;
        localStorage.setItem('musicPaused', 'true');
        this.updateButtonState();
    }

    /**
     * Toggle play/pause
     */
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Fade in audio
     */
    async fadeIn() {
        if (this.isFadeInProgress) return;

        this.isFadeInProgress = true;
        const duration = this.config.fadeInDuration;
        const steps = 30;
        const increment = this.config.volume / steps;
        const delay = duration / steps;

        return new Promise((resolve) => {
            let currentStep = 0;

            const fade = () => {
                currentStep++;
                this.audio.volume = Math.min(this.audio.volume + increment, this.config.volume);

                if (currentStep < steps) {
                    setTimeout(fade, delay);
                } else {
                    this.audio.volume = this.config.volume;
                    this.isFadeInProgress = false;
                    resolve();
                }
            };

            fade();
        });
    }

    /**
     * Fade out audio
     */
    async fadeOut() {
        if (this.isFadeInProgress) return;

        this.isFadeInProgress = true;
        const duration = this.config.fadeOutDuration;
        const steps = 30;
        const decrement = this.audio.volume / steps;
        const delay = duration / steps;

        return new Promise((resolve) => {
            let currentStep = 0;

            const fade = () => {
                currentStep++;
                this.audio.volume = Math.max(this.audio.volume - decrement, 0);

                if (currentStep < steps) {
                    setTimeout(fade, delay);
                } else {
                    this.audio.volume = 0;
                    this.isFadeInProgress = false;
                    resolve();
                }
            };

            fade();
        });
    }

    /**
     * Set volume
     */
    setVolume(volume) {
        this.config.volume = Math.max(0, Math.min(1, volume));

        if (this.isPlaying) {
            this.audio.volume = this.config.volume;
        }

        localStorage.setItem('musicVolume', this.config.volume.toString());
    }

    /**
     * Update button visual state
     */
    updateButtonState() {
        if (this.isPlaying) {
            this.button.classList.add('playing');
            this.button.setAttribute('aria-label', 'Пауза');
        } else {
            this.button.classList.remove('playing');
            this.button.setAttribute('aria-label', 'Играть');
        }
    }

    /**
     * Check if music is playing
     */
    isMusicPlaying() {
        return this.isPlaying;
    }

    /**
     * Get current volume
     */
    getVolume() {
        return this.config.volume;
    }

    /**
     * Stop music completely
     */
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.volume = 0;
        this.isPlaying = false;
        this.isFadeInProgress = false;
        localStorage.setItem('musicPaused', 'true');
        this.updateButtonState();
    }

    /**
     * Restart music from beginning
     */
    restart() {
        this.audio.currentTime = 0;
        if (!this.isPlaying) {
            this.play();
        }
    }

    /**
     * Get audio duration
     */
    getDuration() {
        return this.audio.duration;
    }

    /**
     * Get current playback position
     */
    getCurrentTime() {
        return this.audio.currentTime;
    }

    /**
     * Seek to specific time
     */
    seek(time) {
        this.audio.currentTime = time;
    }

    /**
     * Get playback progress percentage
     */
    getProgress() {
        if (this.audio.duration) {
            return (this.audio.currentTime / this.audio.duration) * 100;
        }
        return 0;
    }

    /**
     * Destroy music controller
     */
    destroy() {
        this.stop();
        if (this.button) {
            this.button.removeEventListener('click', this.toggle);
        }
    }
}

// Music visualizer (optional enhancement)
class MusicVisualizer {
    constructor(audioElement, canvasId = 'audioVisualizer') {
        this.audio = audioElement;
        this.canvas = document.getElementById(canvasId);

        if (!this.canvas || !window.AudioContext) {
            console.warn('Visualizer not supported');
            return;
        }

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        this.source = this.ctx.createMediaElementSource(this.audio);
        this.canvasCtx = this.canvas.getContext('2d');

        this.setup();
    }

    setup() {
        this.source.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.analyser.fftSize = 256;

        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);

        this.draw();
    }

    draw() {
        requestAnimationFrame(() => this.draw());

        this.analyser.getByteFrequencyData(this.dataArray);

        const width = this.canvas.width;
        const height = this.canvas.height;

        this.canvasCtx.clearRect(0, 0, width, height);

        const barWidth = (width / this.dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            barHeight = this.dataArray[i] / 2;

            // Gold color gradient
            const gradient = this.canvasCtx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, '#D4AF37');
            gradient.addColorStop(1, '#F4E4BC');

            this.canvasCtx.fillStyle = gradient;
            this.canvasCtx.fillRect(x, height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
}

// Initialize music controller
let musicController;

function initMusic() {
    const audio = document.getElementById('bgMusic');
    const button = document.getElementById('musicBtn');

    if (!audio || !button) {
        console.warn('Music elements not found');
        return;
    }

    // Load saved volume preference
    const savedVolume = localStorage.getItem('musicVolume');
    const initialVolume = savedVolume ? parseFloat(savedVolume) : 0.4;

    musicController = new MusicController({
        audio: audio,
        button: button,
        volume: initialVolume,
        fadeInDuration: 2000,
        fadeOutDuration: 1000
    });

    console.log('Music controller initialized');
}

// Music controls for external use
function playMusic() {
    if (musicController) {
        musicController.play();
    }
}

function pauseMusic() {
    if (musicController) {
        musicController.pause();
    }
}

function toggleMusic() {
    if (musicController) {
        musicController.toggle();
    }
}

function stopMusic() {
    if (musicController) {
        musicController.stop();
    }
}

function setMusicVolume(volume) {
    if (musicController) {
        musicController.setVolume(volume);
    }
}

function isMusicPlaying() {
    return musicController ? musicController.isMusicPlaying() : false;
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
} else {
    initMusic();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MusicController, MusicVisualizer };
}
