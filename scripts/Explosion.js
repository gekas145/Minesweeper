import Particle from './Particle.js';


export default class Explosion {
    constructor(centerX, centerY, tileId, canvas){
        this.particles = [];
        for (let i = 0; i <= 150; i++) {
            let particle = new Particle(centerX, centerY, canvas);
            this.particles.push(particle);
        }
        this.tileId = tileId;
    }

    explode() {
        this.particles.forEach(particle => {
                if (particle.alpha > 0) {
                    particle.update();
                }
            });
    }

    finish() {
        document.getElementById(this.tileId).style.background = "red";
    }

    isFinished() {
        return this.particles[0].alpha <= 0;
    }
}