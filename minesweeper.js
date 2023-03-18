window.onload = function() {

    field = document.getElementById("main");
    fieldTileDim = 8;

    canvas = document.getElementById("canvas");

    drawGrid();

    gameOverFlague = false;

    btnSurroundings = [1, 0, -1];

    firstClick = true;

    timer = document.getElementById("timer");

    bombArray = new Array(fieldTileDim**2).fill(0);
    tileClicked = new Array(fieldTileDim**2).fill(false);
    bombsNumber = 10;
    bombsMarked = 0;

}

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
        if (this.innerHTML === "B") {
            this.innerHTML = "";
            bombsMarked -= bombArray[this.id] === -1;
        } else {
            this.innerHTML = "B";
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
        if (gameOverFlague) {
            document.getElementById("game-over").style.display = "block";
            showAllBombs();
            return;
        }
    }
    checkForVictory();
}


function click(id) {

    if (tileClicked[id]) return;

    if (bombArray[id] === -1) {
        var color = "red";
        document.getElementById(id).style.background = color;
        gameOverFlague = true;
        tileClicked[id] = true;
        return;
    }

    var color = "green";
    document.getElementById(id).innerHTML = bombArray[id];
    document.getElementById(id).style.background = color;
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
            showAllBombs();
            if (bombsMarked != bombsNumber) {
                document.getElementById("game-over").style.display = "block";
            }
            clearInterval(timerProcess);
        }
    }, 1000);
}

function showAllBombs() {
    for (let i = 0; i < bombArray.length; i++) {
        if (bombArray[i] === -1) {
        document.getElementById(i).style.background = "red";
        }
    }
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
        document.getElementById("victory").style.display = "block";
        gameOverFlague = true;
    }
}





