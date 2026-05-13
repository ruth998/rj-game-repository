document.addEventListener("DOMContentLoaded", () => {

const WORD_LIST = ["APPLE", "BERRY", "CHESS", "DRINK", "EAGLE", "FRUIT", "GRAPE", "HONEY"];

const game = {
    targetWord: "",
    currentRow: 0,
    currentCol: 0,
    guesses: ["", "", "", "", "", ""],
    feedback: [[], [], [], [], [], []],
    state: "playing"
};

const board = document.getElementById("game-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

function chooseRandomWord() {
    const index = Math.floor(Math.random() * WORD_LIST.length);
    return WORD_LIST[index];
}

function createBoard() {
    board.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.setAttribute("id", `tile-${i}-${j}`);
            board.appendChild(tile);
        }
    }
}

function renderGame() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 5; col++) {
            const tile = document.getElementById(`tile-${row}-${col}`);
            tile.textContent = game.guesses[row][col] || "";
            const feedback = game.feedback[row][col];
            tile.classList.remove("correct", "present", "absent");
            if (feedback) tile.classList.add(feedback);
        }
    }

    if (game.state === "win") {
        status.textContent = "Congratulations! You guessed the word!";
    } else if (game.state === "lose") {
        status.textContent = `Game Over! The word was ${game.targetWord}`;
    } else {
        status.textContent = "";
    }
}

function processInput(key) {
    if (key === "BACKSPACE") {
        if (game.currentCol > 0) {
            game.currentCol--;
            game.guesses[game.currentRow] =
                game.guesses[game.currentRow].slice(0, -1);
        }
    } else if (key === "ENTER") {
        if (game.guesses[game.currentRow].length === 5) {
            checkGuess();
        }
    } else if (/^[A-Z]$/.test(key)) {
        if (game.currentCol < 5) {
            game.guesses[game.currentRow] += key;
            game.currentCol++;
        }
    }
}

function checkGuess() {
    const guess = game.guesses[game.currentRow];
    const feedbackRow = [];

    const targetLetters = game.targetWord.split("");
    const guessLetters = guess.split("");

    // First pass: correct letters
    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            feedbackRow[i] = "correct";
            targetLetters[i] = null;
        }
    }

    // Second pass: present letters
    for (let i = 0; i < 5; i++) {
        if (!feedbackRow[i]) {
            const index = targetLetters.indexOf(guessLetters[i]);
            if (index !== -1) {
                feedbackRow[i] = "present";
                targetLetters[index] = null;
            } else {
                feedbackRow[i] = "absent";
            }
        }
    }

    game.feedback[game.currentRow] = feedbackRow;

    if (guess === game.targetWord) {
        game.state = "win";
    } else if (game.currentRow === 5) {
        game.state = "lose";
    } else {
        game.currentRow++;
        game.currentCol = 0;
    }
}

function restartGame() {
    game.targetWord = chooseRandomWord();
    game.currentRow = 0;
    game.currentCol = 0;
    game.guesses = ["", "", "", "", "", ""];
    game.feedback = [[], [], [], [], [], []];
    game.state = "playing";
    renderGame();
}

document.addEventListener("keydown", (event) => {
    if (game.state !== "playing") return;
    const key = event.key.toUpperCase();
    processInput(key);
    renderGame();
});

restartBtn.addEventListener("click", restartGame);

// Initial game setup
createBoard();
restartGame();

});
