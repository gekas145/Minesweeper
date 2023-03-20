
export default class Particle {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3;
        this.dx = (Math.random() - 0.5) * (Math.random() * 6);
        this.dy = (Math.random() - 0.5) * (Math.random() * 6);
        this.canvas = canvas;
    }
    draw(alpha) {
        let ctx = this.canvas.getContext("2d");
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "#33160F";
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
    }
    update(alpha) {
        this.draw(alpha);
        this.x += this.dx;
        this.y += this.dy;
    }
}