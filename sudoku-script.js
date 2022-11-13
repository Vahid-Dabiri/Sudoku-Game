
$('document').ready(
    function () {
        setGame();
        restartGame();
        newGame();
        dificultyModeFunc();
        showTimer();
    }

)

let completeBoards = [
    [
        "387491625",
        "241568379",
        "569327418",
        "758619234",
        "123784596",
        "496253187",
        "934176852",
        "675832941",
        "812945763"
    ],
    [
        "642815937",
        "139762854",
        "785943621",
        "398251476",
        "526478193",
        "417639582",
        "864527319",
        "973186245",
        "251394768"
    ],
    [
        "489135627",
        "712896345",
        "356724891",
        "871942536",
        "923567184",
        "564381972",
        "197258463",
        "248613759",
        "635479218"
    ],
    [
        "263749581",
        "489513726",
        "751268439",
        "812975643",
        "345682197",
        "976431258",
        "697354812",
        "538127964",
        "124896375"
    ],
    [
        "869152734",
        "251437869",
        "734968251",
        "523689147",
        "478521693",
        "196374582",
        "912845376",
        "345716928",
        "687293415"
    ]
];

let solution = [];
let selectedNum = null;
let mistakes = 0;
let digitCounter = [];
let alarmContainer = $("#alarm-container");
let alarmText = $("#alarm-text h2");
let timer = $("#timer");
let seconds = $("#seconds");
let minutes = $("#minutes");
let menu = $("#menu");
let pauseGame = $("#pause-game");
let autoComplete = $("#auto-complete");
let resumeBtn = $(".resume");
let easyMode = $("#easy");
let mediumMode = $("#medium");
let hardMode = $("#hard");
let dificultyModeBtn = $("#dificulty-mode");
let dificultyContainer = $("#dificulity-container");
let dificulty;
let noBtn = $("#no");
let exitAlarmContainer = $("#exit-alarm-container");

// ////////////////make random solution
function makeSolution() {
    let solutionNum = Math.floor(Math.random() * (completeBoards.length));
    return solution = completeBoards[solutionNum];
}

// //////////make random board

let boardNums = [];

function menuShowSet() {
    removeGameSet();
    restartTimer();
    makeBoard();
    setGame();
    showTimer();
}

function dificultyModeFunc() {

    easyMode.click(function () {
        dificultyContainer.removeClass("show-dificulty");
        dificulty = "easy";
        dificultyModeBtn[0].innerText = "Easy";
        menuShowSet();
    })

    mediumMode.click(function () {
        dificultyContainer.removeClass("show-dificulty");
        dificulty = "medium";
        dificultyModeBtn[0].innerText = "Medium";
        menuShowSet();
    })

    hardMode.click(function () {
        dificultyContainer.removeClass("show-dificulty");
        dificulty = "hard";
        dificultyModeBtn[0].innerText = "Hard";
        menuShowSet();
    })
}

function makeBoard() {
    dificultyModeBtn.click(selectDificulty);
    makeSolution();

    for (let i = 0; i < solution.length; i++) {
        let dashNum;
        if (dificulty == "easy") {
            do {
                dashNum = Math.floor(Math.random() * 9);
            } while (dashNum > 5)
        } else if (dificulty == "hard") {
            do {
                dashNum = Math.floor(Math.random() * 9);
            } while (dashNum < 5)
        } else {
            do {
                dashNum = Math.floor(Math.random() * 9);
            } while (dashNum < 3 && dashNum > 6)
        }


        let separateNums = solution[i].split('');
        for (let j = 0; j <= dashNum; j++) {
            let deletNum = Math.floor(Math.random() * 9);
            separateNums[deletNum] = '-';
            boardNums[i] = separateNums.join('');
        }
    }
    return boardNums;
}
makeBoard();

// //////////////// header btns

function selectDificulty() {
    autoComplete.css("display", "none");
    dificultyContainer.addClass("show-dificulty");
    gameFilter();
    offClickBoard();
    clearInterval(timerInterval);
}

function pauseGameFunc() {
    alarmContainer.addClass("show-alarm");
    $("#alarm-text h2")[0].innerText = "Sudoku";
    clearInterval(timerInterval);
    gameFilter();
}

function clickMenuBtn() {
    pauseGameFunc();
    offClickBoard();
}

function clickPauseBtn() {
    pauseGameFunc();
    offClickBoard();
    alarmText[0].innerText = "Game Paused";
}

// ////////////make boards

function setGame() {
    // ////////////make digits 1-9
    let digitNum = $("#digits");
    for (let i = 1; i <= 9; i++) {
        digitNum[0].insertAdjacentHTML("beforeend", `
        <div class="digits-container">
        <div id=${i} class="digit-number">${i}</div>
        <span class="digit-counter" id="counter-${i}"></span>
        </div>
        `)
    }

    let digitNumber = $(".digit-number");
    digitNumber.on('click', selectNumber);

    // ///////////// make board 9*9
    let board = $("#board");
    for (let g = 0; g < 9; g++) {
        for (let h = 0; h < 9; h++) {
            let tile = $("<div></div>");
            tile.attr('id', g.toString() + "-" + h.toString());
            if (boardNums[g][h] != "-") {
                tile[0].innerText = boardNums[g][h];
                tile.addClass("start-numbers");
            }
            if (g == 2 || g == 5) {
                tile.addClass("horizontal-line");
            }
            if (h == 2 || h == 5) {
                tile.addClass("vertical-line");
            }
            tile.on("click", selectTile);
            tile.addClass("tile");
            board.append(tile);
        }
    }

    menu.click(clickMenuBtn);
    pauseGame.click(clickPauseBtn);

    setDigitCounter();
    deleteDigits();
    exitGame();
    resumeGame();
    clickAutoComplete();
}

// ////////////set timer
let timerInterval;
function showTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        let newSeconds = Number(seconds[0].innerText);
        let newMinutes = Number(minutes[0].innerText);
        newSeconds++;
        if (newSeconds > 59) {
            newSeconds = 0;
            newMinutes++;
        }
        if (newSeconds < 10) {
            newSeconds = "0" + newSeconds;
        }
        if (newMinutes < 10) {
            minutes[0].innerText = "0" + newMinutes;
        } else {
            minutes[0].innerText = newMinutes;
        }
        seconds[0].innerText = newSeconds;
    }, 1000)
}

function restartTimer() {
    seconds[0].innerText = "00";
    minutes[0].innerText = "00";
    clearInterval(timerInterval);
}

function selectNumber() {
    if (selectedNum != null) {
        selectedNum.removeClass("selected-number");
    }
    selectedNum = $(this);
    selectedNum.addClass("selected-number");
    changeColor();
}

//  change existed number color

function changeColor() {
    let allTiles = $(".tile");
    allTiles.each(function () {
        if ($(this)[0].innerText == selectedNum[0].innerText) {
            $(this).addClass("exist-number");
        } else {
            $(this).removeClass("exist-number");
        }
    })

}

function setDigitCounter() {
    let allTiles = $(".tile");
    for (let i = 0; i < 9; i++) {
        digitCounter[i] = 0;
    }
    allTiles.each(function () {
        let counter = $(this)[0].innerText;

        for (let i = 1; i <= digitCounter.length; i++) {
            if (counter == i) {
                digitCounter[i - 1]++;
            }
            $(`#counter-${i}`)[0].innerText = 9 - digitCounter[i - 1];
        }
    })
}

function deleteDigits() {
    let digitCounterNum = $(".digit-counter");
    digitCounterNum.each(function () {
        if ($(this)[0].innerText <= 0) {
            let parentDigit = $(this).parent();
            parentDigit.css({
                "visibility": "hidden",
                "cursor": "default"
            });
            parentDigit.off('click', selectNumber);
        }
    })
}

// ////////////select tiles

function selectTile() {
    if (selectedNum) {
        if ($(this)[0].innerText != "") {
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = $(this).attr('id').split("-"); //["0", "0"]
        let g = parseInt(coords[0]);
        let h = parseInt(coords[1]);
        if (solution[g][h] == selectedNum[0].innerText) {
            $(this)[0].innerText = selectedNum[0].innerText;
            changeColor();
            setDigitCounter();
            deleteDigits();
            winAlert();
        }
        else {
            mistakes++;
            $(".mistakeCircle")[mistakes - 1].style.backgroundColor = "red";
            if (mistakes >= 3) {
                alarmContainer.addClass("show-alarm");
                gameFilter();
                alarmText[0].innerText = "Defeat";
                clearInterval(timerInterval);
                resumeBtn.off("click");
            }
        }
    }
    showAutoCompleteBtn();
}

// enable-diable game parts

function offClickBoard() {
    $(".tile").off("click", selectTile);
    $(".digit-number").off('click', selectNumber);
    dificultyModeBtn.off("click", selectDificulty);
    menu.off("click" , clickMenuBtn);
    pauseGame.off("click" , clickPauseBtn);

}

function onClickBoard() {
    $(".tile").on("click", selectTile);
    $("#pause-game").on("click");
    dificultyModeBtn.on("click", selectDificulty);
    $(".digit-number").on('click', selectNumber);
    menu.on("click" , clickMenuBtn);
    pauseGame.on("click" , clickPauseBtn);
}

// ////////////////menu part

function exitGame() {
    let exitBtn = $("#exit");
    exitBtn.click(function () {
        exitAlarmContainer.addClass("show-exit");
        gameFilter();
    })
    noBtn.click(function () {
        exitAlarmContainer.removeClass("show-exit");
    })
}

function resumeGame() {
    resumeBtn.click(function () {
        alarmContainer.removeClass("show-alarm");
        dificultyContainer.removeClass("show-dificulty");
        showTimer();
        gameFilter();
        onClickBoard();
    })
}

function removeGameSet() {
    alarmContainer.removeClass("show-alarm");
    gameFilter();
    $("#board")[0].innerText = '';
    $("#digits")[0].innerText = '';
    $(".mistakeCircle").css("background-color", "lime");
    selectedNum = null;
    mistakes = 0;
    digitCounter = [];
}

function restartGame() {
    let restartBtn = $("#restart");
    restartBtn.click(function () {
        autoComplete.css("display", "none");
        removeGameSet();
        restartTimer();
        setGame();
        showTimer();
    })
}

function newGame() {
    let newGameBtn = $("#new-game");
    newGameBtn.click(function () {
        autoComplete.css("display", "none");
        dificultyContainer.addClass("show-dificulty");
    })
}

// ////////////win game

function winAlert() {
    let zeroCounter = 0;
    $(".digit-counter").each(function () {
        if ($(this)[0].innerText == 0) {
            zeroCounter++;
        }
        if (zeroCounter == 9) {
            alarmText[0].innerText = "Congratulation";
            alarmContainer.addClass("show-alarm");
            clearInterval(timerInterval);
            gameFilter();
            resumeBtn.off("click");
        }
    })
}

// blur game

function gameFilter() {
    if (alarmContainer.hasClass("show-alarm") || dificultyContainer.hasClass("show-dificulty")) {
        $("#game-container").addClass("filter-game");
        offClickBoard();
    } else {
        $("#game-container").removeClass("filter-game");
    }
}

// ////////////////auto complete
let emptyTileId;
function showAutoCompleteBtn() {
    let remainDigits = [];
    for (let i = 0; i < digitCounter.length; i++) {
        let remainDigit = 9 - digitCounter[i];
        remainDigits.push(remainDigit);
    }
    let sum = 0;
    for (let j = 0; j < remainDigits.length; j++) {
        sum = sum + remainDigits[j];
    }
    if (sum < 6) {
        autoComplete.css("display", "block");
    }
}

function autoCompleteFunc(params) {
    $(".tile").each(function () {
        if ($(this)[0].innerText == '') {
            let emptyTile = $(this);
            function fillTiles() {
                emptyTileId = emptyTile.attr("id").split("-");
                let x = Number(emptyTileId[0]);
                let y = Number(emptyTileId[1]);
                emptyTile[0].innerText = solution[x][y];
                emptyTile.css("background-color", "yellow");
                setDigitCounter();
                deleteDigits();
                setTimeout(function () {
                    winAlert();
                }, 2000);
            }
            setTimeout(fillTiles, 500);
        }
    })
}

function clickAutoComplete() {
    autoComplete.click(autoCompleteFunc);
}