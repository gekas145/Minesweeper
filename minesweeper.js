window.onload = function() {

    field = document.getElementById("main");

    gameOverFlague = false;

    btnSurroundings = [1, 0, -1];

    firstClick = true;

    timer = document.getElementById("timer");

    isSigning = document.getElementById("sign");

    var k  = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
        var btn = document.createElement("BUTTON");
        btn.setAttribute("id", String(k));
        btn.setAttribute("class", "btn");
        btn.style.position = "absolute";
        btn.style.top = i*5+"em";
        btn.style.left = j*5+"em";
        btn.onclick = clickBtn;

        field.appendChild(btn);
        k += 1;
        }
      }
    isBombArray = new Array(64).fill(false);
    clickedBtn = new Array(64).fill(false);
    minesweeperMap = new Array(64).fill(0);
    bombsNumber = 10;
    bombsMarked = 0;
    bombPositions = [];
    while(bombPositions.length < bombsNumber){
        var r = Math.floor(Math.random() * 63);
        if(bombPositions.indexOf(r) === -1) bombPositions.push(r);
    }

    for (let i = 0; i < bombsNumber; i++) {
        isBombArray[bombPositions[i]] = true;
    }

    btnNumbers = [];
    for (let i = 0; i < 64; i++) {
        let a = Math.floor(i / 8);
        let b = i % 8;

        let number = 0;
        
        if (isBombArray[i]) {
            number = -1;
        } else {
            for (let j = 0; j < btnSurroundings.length; j++) {
                for (let k = 0; k < btnSurroundings.length; k++) {
                    if (a + btnSurroundings[j] >= 0 && a + btnSurroundings[j] < 8 && b + btnSurroundings[k] >= 0 && b + btnSurroundings[k] < 8) {
                        number += isBombArray[8*(a + btnSurroundings[j]) + b + btnSurroundings[k]];
                    }
                }
            }
        }


        btnNumbers.push(number);
    }

}

function clickBtn() {
    if (isSigning.checked && !gameOverFlague && !clickedBtn[this.id]) {
        if (this.innerHTML === "B") {
            this.innerHTML = "";
            bombsMarked -= isBombArray[this.id];
        } else {
            this.innerHTML = "B";
            bombsMarked += isBombArray[this.id];
        }
        checkForVictory();
        return;
    }
    if (!clickedBtn[this.id] && !gameOverFlague) {
        click(this.id, false);
        if (gameOverFlague) {
            document.getElementById("game-over").style.display = "block";
            showAllBombs();
        }
        if (firstClick){
            firstClick = false;
            startTimer(5 * 60, timer);    
        }
    }
    checkForVictory();
}

function click(id, isRecurrent) {
    if (isBombArray[id] && !isRecurrent) {
        var color = "red";
        document.getElementById(id).style.background = color;
        gameOverFlague = true;
        clickedBtn[id] = true;
    } else {
        if (!isBombArray[id]) {
            console.log("Hi");
            if (!clickedBtn[id]) {
                var color = "green";
                document.getElementById(id).innerHTML = btnNumbers[id];
                document.getElementById(id).style.background = color;
                clickedBtn[id] = true;
            }
        }
    }
    if (btnNumbers[id] === 0) {
        let a = Math.floor(id / 8);
        let b = id % 8;
        for (let j = 0; j < btnSurroundings.length; j++) {
            for (let k = 0; k < btnSurroundings.length; k++) {
                if (a + btnSurroundings[j] >= 0 && a + btnSurroundings[j] < 8 && b + btnSurroundings[k] >= 0 && b + btnSurroundings[k] < 8) {
                    if (!clickedBtn[8*(a + btnSurroundings[j]) + b + btnSurroundings[k]]) {
                        click(8*(a + btnSurroundings[j]) + b + btnSurroundings[k], false);
                    }
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
    for (let i = 0; i < bombPositions.length; i++) {
        document.getElementById(bombPositions[i]).style.background = "red";
    }
}

function checkIfAllSafeTilesAreClicked() {
    for (let i = 0; i < isBombArray.length; i++) {
        if (!isBombArray[i] && !clickedBtn[i]) {
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








