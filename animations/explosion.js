class ExplosionEngine{
    constructor(){
        this.explosions = [];
        this.runId = null;

    }

    processExplosion(particles){
        this.explosions.push(particles);
        if (this.runId === null){
            this.runId = setInterval(() => {this.run()}, 100);
        }
    }

    run(){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.explosions.forEach((explosion, i) => {
                if (explosion.length === 0){
                    this.explosions.splice(i, 1);
                } else {explode(explosion);}
        })

        if (this.explosions.length === 0){
            clearInterval(this.runId);
            this.runId = null;
        }
    }
}




window.onload = function() {

    engine = new ExplosionEngine();

    let canvas = document.getElementById("canvas");
    canvas.addEventListener("click", canvasClicked);

}

function canvasClicked(event){

    let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();

    const elementRelativeX = event.clientX;
    const elementRelativeY = event.clientY;
    const canvasRelativeX = elementRelativeX * canvas.width / rect.width;
    const canvasRelativeY = elementRelativeY * canvas.height / rect.height;

    let particles = generateParticles(canvasRelativeX, canvasRelativeY);
    engine.processExplosion(particles);
}


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3;
        this.dx = (Math.random() - 0.5) * (Math.random() * 6);
        this.dy = (Math.random() - 0.5) * (Math.random() * 6);
        this.alpha = 1;
    }
    draw() {
        let ctx = document.getElementById("canvas").getContext("2d");
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'red';
          
        /* Begins or reset the path for 
           the arc created */
        ctx.beginPath();
          
        /* Some curve is created*/
        ctx.arc(this.x, this.y, this.radius, 
                0, Math.PI * 2, false);
  
        ctx.fill();
          
        /* Restore the recent canvas context*/
        ctx.restore();
    }
    update() {
        this.draw();
        this.alpha -= 0.1;
        this.x += this.dx;
        this.y += this.dy;
    }
}


function explode(particles) {
    let ctx = document.getElementById("canvas").getContext("2d");
    particles.forEach((particle, i) => {
            if (particle.alpha <= 0) {
                particles.splice(i, 1);
            } else particle.update()
        })
    // if (particles.length === 0) {
    //     return;
    // }
    //     /* Performs a animation after request*/
    // setTimeout(() => explode(particles), 100);
}


function generateParticles(x, y){
    let particles = [];
    for (let i = 0; i <= 150; i++) {
        let particle = new Particle(x, y);
        particles.push(particle);
    }
    return particles;
}

