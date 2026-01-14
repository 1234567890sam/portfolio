// Animated Particle Background
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 30; // Further reduced for better performance
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(0, 212, 255, 0.8)',   // Neon Blue
            'rgba(178, 75, 243, 0.8)',  // Neon Purple
            'rgba(0, 255, 136, 0.8)',   // Neon Green
            'rgba(0, 255, 245, 0.8)'    // Neon Cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();

        // Add glow effect
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) { // Reduced from 150 for better performance
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                particle.x -= dx * 0.01;
                particle.y -= dy * 0.01;
            }

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Keep particles in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();
        this.connectParticles();

        this.particles.forEach(particle => this.drawParticle(particle));

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
});
