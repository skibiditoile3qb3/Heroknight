/**
 * PlayerSphere - Reusable player sphere renderer
 * Handles drawing and animating player spheres with cosmetics
 */
class PlayerSphere {
    constructor(canvasId, size = 80) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id "${canvasId}" not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.size = size;
        this.canvas.width = size;
        this.canvas.height = size;
        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = size * 0.375; // 75% of half size
        
        this.animationFrame = null;
        this.shouldAnimate = false;
    }
    
    /**
     * Draw the sphere with given cosmetics
     * @param {Object} cosmetics - { color, hat, face, effect }
     */
    draw(cosmetics = {}) {
        const { color = 'default', hat = 'none', face = 'none', effect = 'none' } = cosmetics;
        
        this.ctx.clearRect(0, 0, this.size, this.size);
        
        // Draw main sphere with gradient
        this.drawSphere(color);
        
        // Draw face
        this.drawFace(face);
        
        // Draw hat
        this.drawHat(hat);
        
        // Draw effect
        this.drawEffect(effect);
    }
    
    drawSphere(color) {
        const gradient = this.ctx.createRadialGradient(
            this.centerX - this.radius * 0.33,
            this.centerY - this.radius * 0.33,
            this.radius * 0.16,
            this.centerX,
            this.centerY,
            this.radius
        );
        
        switch(color) {
            case 'sunset':
                gradient.addColorStop(0, '#ff6b6b');
                gradient.addColorStop(1, '#ff9a3c');
                break;
            case 'ocean':
                gradient.addColorStop(0, '#4cc9f0');
                gradient.addColorStop(1, '#0077b6');
                break;
            case 'galaxy':
                gradient.addColorStop(0, '#c77dff');
                gradient.addColorStop(1, '#3c096c');
                break;
            default:
                gradient.addColorStop(0, '#888');
                gradient.addColorStop(1, '#333');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawFace(face) {
        const eyeSize = this.radius * 0.1;
        const eyeY = this.centerY - this.radius * 0.26;
        const eyeOffsetX = this.radius * 0.33;
        const mouthRadius = this.radius * 0.5;
        
        if (face === 'happy') {
            // Eyes
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX - eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.arc(this.centerX + eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Smile
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY, mouthRadius, 0, Math.PI);
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = this.radius * 0.066;
            this.ctx.stroke();
        } else if (face === 'evil') {
            // Eyes
            this.ctx.fillStyle = '#f00';
            this.ctx.beginPath();
            this.ctx.arc(this.centerX - eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.arc(this.centerX + eyeOffsetX, eyeY, eyeSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Frown
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY + this.radius * 0.33, mouthRadius, Math.PI, 0);
            this.ctx.strokeStyle = '#f00';
            this.ctx.lineWidth = this.radius * 0.066;
            this.ctx.stroke();
        }
    }
    
    drawHat(hat) {
        const scale = this.radius / 30; // Scale factor based on original 30px radius
        
        if (hat === 'crown') {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            
            const points = [
                [this.centerX - this.radius * 0.66, this.centerY - this.radius * 0.83],
                [this.centerX - this.radius * 0.5, this.centerY - this.radius * 1.06],
                [this.centerX - this.radius * 0.25, this.centerY - this.radius * 0.93],
                [this.centerX - this.radius * 0.033, this.centerY - this.radius * 1.13],
                [this.centerX, this.centerY - this.radius * 0.93],
                [this.centerX + this.radius * 0.17, this.centerY - this.radius * 1.06],
                [this.centerX + this.radius * 0.33, this.centerY - this.radius * 0.93],
                [this.centerX + this.radius * 0.5, this.centerY - this.radius * 1.06],
                [this.centerX + this.radius * 0.66, this.centerY - this.radius * 0.83]
            ];
            
            this.ctx.moveTo(points[0][0], points[0][1]);
            points.forEach(p => this.ctx.lineTo(p[0], p[1]));
            this.ctx.closePath();
            this.ctx.fill();
        } else if (hat === 'tophat') {
            this.ctx.fillStyle = '#1a1a1a';
            // Top part
            this.ctx.fillRect(
                this.centerX - this.radius * 0.5,
                this.centerY - this.radius * 1.16,
                this.radius,
                this.radius * 0.26
            );
            // Brim
            this.ctx.fillRect(
                this.centerX - this.radius * 0.66,
                this.centerY - this.radius * 0.9,
                this.radius * 1.33,
                this.radius * 0.16
            );
        } else if (hat === 'wizard') {
            this.ctx.fillStyle = '#6b46c1';
            this.ctx.beginPath();
            this.ctx.moveTo(this.centerX, this.centerY - this.radius * 1.16);
            this.ctx.lineTo(this.centerX - this.radius * 0.5, this.centerY - this.radius * 0.83);
            this.ctx.lineTo(this.centerX + this.radius * 0.5, this.centerY - this.radius * 0.83);
            this.ctx.closePath();
            this.ctx.fill();
        } else if (hat === 'halo') {
            this.ctx.strokeStyle = '#ffd700';
            this.ctx.lineWidth = this.radius * 0.1;
            this.ctx.beginPath();
            this.ctx.arc(this.centerX, this.centerY - this.radius * 1.06, this.radius * 0.4, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    drawEffect(effect) {
        if (effect === 'blackhole') {
            const time = Date.now() / 1000;
            const orbitRadius = this.radius * 1.5;
            const holeRadius = this.radius * 0.26;
            
            for (let i = 0; i < 3; i++) {
                const angle = time + (i * Math.PI * 2 / 3);
                const x = this.centerX + Math.cos(angle) * orbitRadius;
                const y = this.centerY + Math.sin(angle) * orbitRadius;
                
                const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, holeRadius);
                gradient.addColorStop(0, '#000');
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(x, y, holeRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
    
    /**
     * Start animation loop (for effects like black hole)
     * @param {Object} cosmetics - Cosmetics to render
     */
    startAnimation(cosmetics) {
        this.shouldAnimate = true;
        this.cosmetics = cosmetics;
        
        const animate = () => {
            if (!this.shouldAnimate) return;
            
            this.draw(this.cosmetics);
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Stop animation loop
     */
    stopAnimation() {
        this.shouldAnimate = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Update cosmetics and redraw
     * @param {Object} cosmetics - New cosmetics to apply
     */
    updateCosmetics(cosmetics) {
        this.cosmetics = cosmetics;
        this.draw(cosmetics);
    }
    
    /**
     * Cleanup resources
     */
    destroy() {
        this.stopAnimation();
        if (this.canvas) {
            this.ctx.clearRect(0, 0, this.size, this.size);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerSphere;
}
