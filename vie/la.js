document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    renderGame();

    document.addEventListener("keydown", (event) => {
        if (game.state !== "playing") return;
        const key = event.key.toUpperCase();
        processInput(key);
        renderGame();
    });

    restartBtn.addEventListener("click", () => {
        restartGame();
        renderGame();
    });
});
