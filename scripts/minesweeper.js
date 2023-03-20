import ExplosionEngine from "./ExplosionEngine.js";
import Explosion from "./Explosion.js";


var field = document.getElementById("main");
var fieldTileDim = 8;

drawGrid();

var engine = new ExplosionEngine(document.getElementById("canvas"));

var gameOverFlague = false;

var btnSurroundings = [1, 0, -1];

var firstClick = true;
var clickedBombId = null;

var timer = document.getElementById("timer");

var bombArray = new Array(fieldTileDim**2).fill(0);
var tileClicked = new Array(fieldTileDim**2).fill(false);
var bombsNumber = 10;
var bombsMarked = 0;
var tileTextColors = {"0": "#00AB41",
                      "1": "#043199",
                      "2": "#0542CC",
                      "3": "#FFDF00",
                      "4": "#FFA700",
                      "5": "#FFA500",
                      "6": "#990000",
                      "7": "#800000",
                      "8": "black"};

window.oncontextmenu = function (){
    return false; // cancel context menu appearence on right mouse button click
}

function drawGrid(){
    var k = 0;
    var tileEdgeLength = field.clientWidth/fieldTileDim;
    for (let i = 0; i < fieldTileDim; i++) {
        for (let j = 0; j < fieldTileDim; j++) {
            var tile = document.createElement("div");
            tile.setAttribute("id", String(k));
            tile.setAttribute("class", "tile");
            tile.style.position = "absolute";
            tile.style.top = i*tileEdgeLength + "px";
            tile.style.left = j*tileEdgeLength + "px";
            tile.style.width = tileEdgeLength + "px";
            tile.style.height = tileEdgeLength + "px";
            tile.onmousedown = clickTile;
            tile.appendChild(document.createElement("span"));

            field.appendChild(tile);
            k += 1;
        }
      }
}

function generateBombs(firstClickedTileId){
    var bombPositions = [];
    while(bombPositions.length < bombsNumber){
        var r = Math.floor(Math.random() * (bombArray.length-1));
        if(bombPositions.indexOf(r) === -1 && firstClickedTileId !== r) bombPositions.push(r);
    }

    for (const bombIndex of bombPositions) {
        bombArray[bombIndex] = -1;
    }
}

function assignTileNumbers(){
    for (let i = 0; i < 64; i++) {
        let a = Math.floor(i / fieldTileDim);
        let b = i % fieldTileDim;

        let number = -1;
        
        if (bombArray[i] !== -1) {
            number = 0;
            for (let j = 0; j < btnSurroundings.length; j++) {
                for (let k = 0; k < btnSurroundings.length; k++) {
                    if (a + btnSurroundings[j] >= 0 && a + btnSurroundings[j] < fieldTileDim && b + btnSurroundings[k] >= 0 && b + btnSurroundings[k] < fieldTileDim) {
                        number += bombArray[fieldTileDim*(a + btnSurroundings[j]) + b + btnSurroundings[k]] === -1;
                    }
                }
            }
        }
        bombArray[i] = number;
    }
}


function clickTile(event) {
    if (event.button === 2 && !gameOverFlague && !tileClicked[this.id]) {
        if (this.firstElementChild.innerHTML === "B") {
            this.firstElementChild.innerHTML = "";
            bombsMarked -= bombArray[this.id] === -1;
        } else {
            this.firstElementChild.innerHTML = "B";
            bombsMarked += bombArray[this.id] === -1;
        }
        checkForVictory();
        return;
    }

    if (firstClick) {
        firstClick = false;
        startTimer(5 * 60, timer); 
        generateBombs(parseInt(this.id));  
        assignTileNumbers();
        }

    if (!tileClicked[this.id] && !gameOverFlague) {
        click(this.id);
    }
    checkForVictory();
}


function click(id) {

    if (tileClicked[id]) return;

    if (bombArray[id] === -1) {
        gameOverFlague = true;
        tileClicked[id] = true;
        clickedBombId = parseInt(id);
        return;
    }

    let tile = document.getElementById(id);
    tile.style.background = "#00AB41";
    tile.style.fontWeight = "bold";
    tile.firstElementChild.innerHTML = bombArray[id];
    tile.firstElementChild.style.color = tileTextColors[bombArray[id]];
    // document.getElementById(id).style.background = tileTextColors[bombArray[id]];
    tileClicked[id] = true;

    if (bombArray[id] === 0) {
        let a = Math.floor(id / fieldTileDim);
        let b = id % fieldTileDim;
        
        for (let j = 0; j < btnSurroundings.length; j++) {
            for (let k = 0; k < btnSurroundings.length; k++) {
                if (a + btnSurroundings[j] >= 0 && a + btnSurroundings[j] < fieldTileDim && b + btnSurroundings[k] >= 0 && b + btnSurroundings[k] < fieldTileDim) {
                    click(fieldTileDim*(a + btnSurroundings[j]) + b + btnSurroundings[k]);
                }
            }
        }
    } 
}


function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    var timerProcess = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (gameOverFlague || --timer < 0) {
            gameOverFlague = true;
            if (checkForVictory()) {
                document.getElementById("victory").style.display = "block";
            } else {
                document.getElementById("game-over").style.display = "block";
            }
            showAllBombs();
            clearInterval(timerProcess);
        }
    }, 1000);
}

function showAllBombs() {
    document.getElementById("canvas").style.zIndex = 1;

    if (clickedBombId !== null) {
        setTimeout(() => {delayedExplosion(clickedBombId)}, 100);
    }

    for (let i = 0; i < bombArray.length; i++) {
        if (bombArray[i] === -1) {
            if (i === clickedBombId) {
                continue;
            }
            if (clickedBombId !== null){
                setTimeout(() => {delayedExplosion(i)}, getRandomInt());
                continue;
            } else {
                document.getElementById(i).style.background = "red";
            }
        }
    }
}

function delayedExplosion(tileId) {
    let tile = document.getElementById(tileId);
    let rect = tile.getBoundingClientRect();
    let coords = getCanvasRelativeCoords(rect.left + rect.width/2,
                                         rect.top + rect.height/2);

    let explosion = new Explosion(coords.x, coords.y, tileId, document.getElementById("canvas"));
    engine.processExplosion(explosion);
}

function checkIfAllSafeTilesAreClicked() {
    for (let i = 0; i < bombArray.length; i++) {
        if (bombArray[i] !== -1 && !tileClicked[i]) {
            return false;
        }
    }
    return true;
}


function checkForVictory() {
    if (bombsMarked == bombsNumber && checkIfAllSafeTilesAreClicked()) {
        gameOverFlague = true;
        return true;
    }
    return false;
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

function getRandomInt(min=1000, max=3000) {
    return Math.floor(Math.random() * (max - min) + min);
  }





