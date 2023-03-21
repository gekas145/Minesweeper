
export default class Particle {
    constructor(canvas) {
        this.x = 0.0;
        this.y = 0.0;
        this.radius = Math.random() * 3;
        this.dx = (Math.random() - 0.5) * (Math.random() * 6);
        this.dy = (Math.random() - 0.5) * (Math.random() * 6);
        this.canvas = canvas;
    }
    draw(centerX, centerY, alpha) {
        let ctx = this.canvas.getContext("2d");
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#33160F";
        
        ctx.beginPath();
        ctx.arc(this.x + centerX, this.y + centerY, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }
    update(centerX, centerY, alpha) {
        this.draw(centerX, centerY, alpha);
        this.x += this.dx;
        this.y += this.dy;
    }
}