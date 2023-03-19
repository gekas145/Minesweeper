
export default class ExplosionEngine{
    constructor(canvas){
        this.canvas = canvas;
        this.explosions = [];
        this.runId = null;

    }

    processExplosion(explosion){
        this.explosions.push(explosion);
        if (this.runId === null){
            this.runId = setInterval(() => {this.run()}, 100);
        }
    }

    run(){
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.explosions.forEach(explosion => {explosion.explode()});
        this.explosions = this.explosions.filter(explosion => explosion.particles[0].alpha > 0);

        if (this.explosions.length === 0){
            clearInterval(this.runId);
            this.runId = null;
        }
    }
}