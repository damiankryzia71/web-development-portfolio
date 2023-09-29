let gameStarted = false;
let buttons = ["green", "red", "yellow", "blue"];
let buttonSequence = [];
let playerSequence = [];
let level = 1;

$(document).on("keydown", () => {
    if (!gameStarted) {
        play();
    }
});

$("button").on("click", function() {
    indicateButton($(this).attr("class"));
    playerSequence.push(this.classList[0]);
    if (playerSequence[playerSequence.length - 1] === buttonSequence[playerSequence.length - 1]) {
        if (playerSequence.length === buttonSequence.length) {
            level++;
            play(); 
        }
    }
    else {
        gameOver();
    }
});

function play() {
    gameStarted = true;
    $("h1").text("Level " + level);
    playerSequence = [];
    setTimeout(() => { buttonSequence.push(pickNextButton()); }, 500)
}

function pickNextButton() {
    let nextButton = buttons[Math.floor(Math.random() * 4)];
    indicateButton(nextButton);
    return nextButton;
}

function gameOver() {
    let gameoverSound = new Audio("./sounds/wrong.mp3");

    level = 1;
    $("h1").text("Game Over. Press Any Key to Restart.");
    buttonSequence = [];
    gameoverSound.play();
    $("body").addClass("gameover-animation");
    setTimeout(() => { $("body").removeClass("gameover-animation"); }, 100);
    gameStarted = false;
}

function indicateButton(button) {
    let buttonSound = new Audio("./sounds/" + button + ".mp3");
    
    buttonSound.play();
    $("." + button).addClass("animate-button");
    setTimeout(() => { $("." + button).removeClass("animate-button"); }, 200);
}