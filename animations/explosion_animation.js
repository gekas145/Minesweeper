import ExplosionEngine from './ExplosionEngine.js';
import Explosion from './Explosion.js';

let canvas = document.getElementById("canvas");
canvas.addEventListener("click", canvasClicked);
var engine = new ExplosionEngine(canvas);


function canvasClicked(event){

    let coords = getCanvasRelativeCoords(event.clientX, event.clientY);

    engine.processExplosion(new Explosion(coords.x, coords.y, canvas));
}

function getCanvasRelativeCoords(x, y) {
    let canvas = document.getElementById("canvas");
    let rect = canvas.getBoundingClientRect();

    const canvasRelativeX = x * canvas.width / rect.width;
    const canvasRelativeY = y * canvas.height / rect.height;

    return {
        "x": canvasRelativeX,
        "y": canvasRelativeY
    };
}


