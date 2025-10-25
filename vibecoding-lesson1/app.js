// Get canvas and context
const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');

// Animation state
let animationRunning = true;
let animationId;

// Sphere properties
class Sphere {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        
        // Physics properties
        this.vx = Math.random() * 8 - 4; // Random horizontal velocity
        this.vy = Math.random() * 2 + 1; // Initial upward velocity
        this.gravity = 0.5;
        this.friction = 0.98; // Energy loss factor
        this.bounce = 0.85; // Bounce damping factor
        
        // Trail properties
        this.trail = [];
        this.maxTrailLength = 20;
    }
    
    update() {
        // Apply gravity
        this.vy += this.gravity;
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        
        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Boundary collision detection and response
        
        // Left and right walls
        if (this.x - this.radius <= 0) {
            this.x = this.radius;
            this.vx = -this.vx * this.bounce;
        } else if (this.x + this.radius >= canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx = -this.vx * this.bounce;
        }
        
        // Top wall
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.vy = -this.vy * this.bounce;
        }
        
        // Floor collision with energy transfer
        if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy = -this.vy * this.bounce;
            
            // Add some horizontal movement when hitting floor
            if (Math.abs(this.vy) > 1) {
                this.vx += (Math.random() - 0.5) * 0.5;
            }
            
            // Create floor impact effect
            this.createImpactEffect();
        }
        
        // Apply air resistance
        this.vx *= this.friction;
        this.vy *= 0.999; // Slight air resistance on vertical movement
    }
    
    createImpactEffect() {
        // Create particles for impact effect
        for (let i = 0; i < 5; i++) {
            particles.push(new Particle(
                this.x + (Math.random() - 0.5) * this.radius,
                canvas.height,
                (Math.random() - 0.5) * 4,
                -Math.random() * 3,
                `hsl(${Math.random() * 60 + 10}, 100%, 60%)` // Orange to red particles
            ));
        }
    }
    
    draw() {
        // Draw trail
        this.drawTrail();
        
        // Draw sphere with gradient
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3, 
            this.y - this.radius * 0.3, 
            0, 
            this.x, 
            this.y, 
            this.radius
        );
        gradient.addColorStop(0, '#ff4757');
        gradient.addColorStop(0.7, '#ff3838');
        gradient.addColorStop(1, '#c44569');
        
        // Draw sphere shadow
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(this.x + 3, canvas.height - 5, this.radius * 0.8, this.radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Draw main sphere
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawTrail() {
        if (this.trail.length < 2) return;
        
        ctx.save();
        
        for (let i = 0; i < this.trail.length - 1; i++) {
            const alpha = (i + 1) / this.trail.length;
            const point = this.trail[i];
            const nextPoint = this.trail[i + 1];
            
            ctx.globalAlpha = alpha * 0.6;
            ctx.strokeStyle = `rgba(255, 71, 87, ${alpha})`;
            ctx.lineWidth = this.radius * alpha * 0.5;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.stroke();
        }
        
        ctx.restore();
    }
    
    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 4;
        this.vx = Math.random() * 8 - 4;
        this.vy = Math.random() * 2 + 1;
        this.trail = [];
    }
}

// Particle class for impact effects
class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = 1.0;
        this.decay = 0.02;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2; // Gravity on particles
        this.life -= this.decay;
    }
    
    draw() {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

// Create sphere and particles array
const sphere = new Sphere(canvas.width / 2, canvas.height / 4, 20, '#ff4757');
let particles = [];

// Animation loop
function animate() {
    // Clear canvas with fade effect for smoother trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw sphere
    sphere.update();
    sphere.draw();
    
    // Update and draw particles
    particles = particles.filter(particle => {
        particle.update();
        particle.draw();
        return !particle.isDead();
    });
    
    // Display physics info
    drawInfo();
    
    if (animationRunning) {
        animationId = requestAnimationFrame(animate);
    }
}

function drawInfo() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '12px Arial';
    ctx.fillText(`Velocity: ${Math.sqrt(sphere.vx * sphere.vx + sphere.vy * sphere.vy).toFixed(1)}`, 10, 20);
    ctx.fillText(`Position: (${sphere.x.toFixed(0)}, ${sphere.y.toFixed(0)})`, 10, 35);
    ctx.fillText(`Particles: ${particles.length}`, 10, 50);
}

// Control buttons
document.getElementById('resetBtn').addEventListener('click', () => {
    sphere.reset();
    particles = [];
});

document.getElementById('pauseBtn').addEventListener('click', () => {
    animationRunning = !animationRunning;
    if (animationRunning) {
        animate();
    }
});

// Start animation
animate();