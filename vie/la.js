const game = {
    targetWord: "APPLE",
    currentRow: 0,
    currentCol: 0,
    guesses: ["", "", "", "", "", ""],
    feedback: [[], [], [], [], [], []],
    state: "playing"
};

const board = document.getElementById("game-board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");

function createBoard() {
    board.innerHTML = "";
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `tile-${r}-${c}`;
            board.appendChild(tile);
        }
    }
}

function renderGame() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            tile.textContent = game.guesses[r][c] || "";
            tile.classList.remove("correct", "present", "absent");
            if (game.feedback[r][c]) tile.classList.add(game.feedback[r][c]);
        }
    }
    if (game.state === "win") status.textContent = "Congratulations! You guessed the word!";
    else if (game.state === "lose") status.textContent = `Game Over! The word was ${game.targetWord}`;
    else status.textContent = "";
}

function processInput(key) {
    if (game.state !== "playing") return;
    if (key === "BACKSPACE") {
        if (game.currentCol > 0) {
            game.currentCol--;
            game.guesses[game.currentRow] = game.guesses[game.currentRow].slice(0, -1);
        }
    } else if (key === "ENTER") {
        if (game.guesses[game.currentRow].length === 5) checkGuess();
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

    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            feedbackRow[i] = "correct";
            targetLetters[i] = null;
        }
    }
    for (let i = 0; i < 5; i++) {
        if (!feedbackRow[i]) {
            const idx = targetLetters.indexOf(guessLetters[i]);
            feedbackRow[i] = idx !== -1 ? "present" : "absent";
            if (idx !== -1) targetLetters[idx] = null;
        }
    }
    game.feedback[game.currentRow] = feedbackRow;
    if (guess === game.targetWord) game.state = "win";
    else if (game.currentRow === 5) game.state = "lose";
    else {
        game.currentRow++;
        game.currentCol = 0;
    }
}

function restartGame() {
    game.targetWord = "APPLE";
    game.currentRow = 0;
    game.currentCol = 0;
    game.guesses = ["", "", "", "", "", ""];
    game.feedback = [[], [], [], [], [], []];
    game.state = "playing";
    renderGame();
}

document.addEventListener("keydown", (e) => {
    processInput(e.key.toUpperCase());
    renderGame();
});

restartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    restartGame();
});

createBoard();
renderGame();
window.focus();
