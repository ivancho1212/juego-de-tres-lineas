import TicTacToeModel from './model.js';
import TicTacToeView from './view.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('loading');
    const gameElement = document.getElementById('game');
    const modalCancelButton = document.getElementById('modal-cancel-button');
    const modalNewGameButton = document.getElementById('modal-new-game-button');
    const idModalOkButton = document.getElementById('id-modal-ok-button');
    let playerSymbol;
    let model;
    let view;

    function showModal(message, showNewGameButton = false) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.innerHTML = message; // Use innerHTML to support HTML content
        const modalOkButton = document.getElementById('modal-ok-button');
        modalOkButton.style.display = 'none';
        modalCancelButton.style.display = 'none';
        modalNewGameButton.style.display = showNewGameButton ? 'inline-block' : 'none';
        modal.style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', closeModal);
    });
    document.getElementById('modal-ok-button').addEventListener('click', closeModal);
    modalCancelButton.addEventListener('click', closeModal);
    modalNewGameButton.addEventListener('click', async () => {
        closeModal();
        showIdModal(); // Mostrar modal para ingresar ID del juego al iniciar nueva partida
    });

    function showWinMessage(winner) {
        setTimeout(() => {
            const winnerColor = winner === 'X' ? 'red' : 'blue';
            showModal(`¡<span style="color: ${winnerColor};">${winner}</span> ha ganado!`, true);
        }, 1500); // Espera 1.5 segundos para mostrar el mensaje del ganador
    }

    function showTieMessage() {
        setTimeout(() => {
            showModal("¡Es un empate!", true);
        }, 1500); // Espera 1.5 segundos para mostrar el mensaje del empate
    }

    function checkWin(cells) {
        const patterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        let winner = null;

        patterns.forEach(pattern => {
            const [a, b, c] = pattern;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                winner = cells[a].textContent;
                const line = document.createElement('div');
                line.classList.add('winning-line');
                line.style.backgroundColor = winner === 'X' ? 'red' : 'blue'; // Color según el ganador
                document.getElementById('board').appendChild(line);
                positionLine(line, pattern);
            }
        });

        return winner;
    }

    function positionLine(line, pattern) {
        const cells = document.querySelectorAll('.cell');
        const startCell = cells[pattern[0]].getBoundingClientRect();
        const endCell = cells[pattern[2]].getBoundingClientRect();
        const boardRect = document.getElementById('board').getBoundingClientRect();
        const topStart = startCell.top - boardRect.top + startCell.height / 2;
        const leftStart = startCell.left - boardRect.left + startCell.width / 2;
        const topEnd = endCell.top - boardRect.top + endCell.height / 2;
        const leftEnd = endCell.left - boardRect.left + endCell.width / 2;
        const angle = Math.atan2(topEnd - topStart, leftEnd - leftStart) * 180 / Math.PI;
        const length = Math.hypot(leftEnd - leftStart, topEnd - topStart);
        line.style.top = `${topStart}px`;
        line.style.left = `${leftStart}px`;
        line.style.width = `0`; // Empezar con un ancho de 0 para la animación
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = `0 0`; 

        // Animar el ancho de la línea
        setTimeout(() => {
            line.style.transition = 'width 1s ease';
            line.style.width = `${length}px`;
        }, 50); // Pequeño retardo para asegurarse de que el ancho inicial de 0 se aplica
    }

    async function initializeGame(gameId) {
        loadingElement.style.display = 'flex';
        gameElement.style.display = 'none';

        model = new TicTacToeModel(gameId);
        const existingGameData = await model.getGameData();

        if (existingGameData) {
            if (existingGameData.player1 && !existingGameData.player2) {
                playerSymbol = existingGameData.player1 === 'X' ? 'O' : 'X';
                await model.setPlayerSymbol(playerSymbol, 'player2');
                showModal(`Tú eres el jugador <span style="color: ${playerSymbol === 'X' ? 'red' : 'blue'};">${playerSymbol}</span>`);
            } else if (existingGameData.player1 && existingGameData.player2) {
                showModal("Este juego ya ha comenzado y tiene dos jugadores.");
                loadingElement.style.display = 'none';
                return;
            }
        } else {
            playerSymbol = 'X';
            await model.setPlayerSymbol(playerSymbol, 'player1');
            showModal(`Tú eres el jugador <span style="color: red;">${playerSymbol}</span>`);
        }

        view = new TicTacToeView();
        loadingElement.style.display = 'none';
        gameElement.style.display = 'block';

        view.setCellClickHandler(async (cellIndex) => {
            const isPlayerTurn = await model.isPlayerTurn(playerSymbol);
            if (isPlayerTurn) {
                const cellContent = view.getCellContent(cellIndex);
                if (!cellContent) {
                    await model.updateBoard(cellIndex, playerSymbol);
                    const cells = document.querySelectorAll('.cell');
                    const winner = checkWin(cells);
                    if (winner) {
                        showWinMessage(winner);
                    } else if (model.isBoardFull(cells)) {
                        showTieMessage();
                    }
                }
            } else {
                showModal("Es el turno del otro jugador.");
            }
        });

        model.listenToBoardChanges((data) => {
            view.updateBoard(data);
            const cells = document.querySelectorAll('.cell');
            const winner = checkWin(cells);
            if (winner) {
                showWinMessage(winner);
            } else if (model.isBoardFull(cells)) {
                showTieMessage();
            }
        });
    }

    // Botón para iniciar una nueva partida al hacer clic en el botón "Iniciar nueva partida" dentro del juego
    const gameNewGameButton = document.getElementById('new-game-button');
    if (gameNewGameButton) {
        gameNewGameButton.addEventListener('click', () => {
            showIdModal();
        });
    }

    function showIdModal() {
        const idModal = document.getElementById('id-modal');
        idModal.style.display = 'block';
        const gameIdInput = document.getElementById('game-id-input');
        gameIdInput.value = ''; // Limpiar el campo de entrada del ID
    }

    idModalOkButton.addEventListener('click', async () => {
        const gameIdInput = document.getElementById('game-id-input');
        const gameId = gameIdInput.value.trim();
        gameIdInput.value = ''; // Limpiar el campo de entrada
        if (gameId) {
            const idModal = document.getElementById('id-modal');
            idModal.style.display = 'none';
            await initializeGame(gameId);
        } else {
            alert('Por favor, ingrese un ID de juego válido.');
        }
    });

    // Mostrar modal para ingresar ID del juego al cargar la página
    showIdModal();
});
