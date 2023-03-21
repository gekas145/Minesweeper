import Particle from './Particle.js';


export default class Explosion {
    constructor(tile, canvas){
        this.alpha = 1;
        this.particles = [];
        for (let i = 0; i <= 150; i++) {
            let particle = new Particle(canvas);
            this.particles.push(particle);
        }
        this.tile = tile;
        this.canvas = canvas;
    }

    getCanvasRelativeCoords(x, y) {
        let rect = this.canvas.getBoundingClientRect();
    
        const canvasRelativeX = x * canvas.width / rect.width;
        const canvasRelativeY = y * canvas.height / rect.height;
    
        return {
            "x": canvasRelativeX,
            "y": canvasRelativeY
        };
    }

    explode() {
        let rect = this.tile.getBoundingClientRect();
        let coords = this.getCanvasRelativeCoords(rect.left + rect.width/2,
                                                  rect.top + rect.height/2);
        this.particles.forEach(particle => {particle.update(coords.x, coords.y, this.alpha)});
        this.alpha -= 0.1;
    }

    finish() {
        this.tile.style.background = "red";
    }

    isFinished() {
        return this.alpha <= 0;
    }
}