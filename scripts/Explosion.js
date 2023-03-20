import Particle from './Particle.js';


export default class Explosion {
    constructor(centerX, centerY, tileId, canvas){
        this.alpha = 1;
        this.particles = [];
        for (let i = 0; i <= 150; i++) {
            let particle = new Particle(centerX, centerY, canvas);
            this.particles.push(particle);
        }
        this.tileId = tileId;
    }

    explode() {
        this.particles.forEach(particle => {particle.update(this.alpha)});
        this.alpha -= 0.1;
    }

    finish() {
        // this.particles.forEach(particle => {
        //     let alpha = 0;
        //     if (Math.random() < 0.2) {
        //         alpha = 0.1;
        //     }
        //     particle.update(alpha)
        // });
        document.getElementById(this.tileId).style.background = "red";
    }

    isFinished() {
        return this.alpha <= 0;
    }
}