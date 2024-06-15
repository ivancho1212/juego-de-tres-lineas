import TicTacToeModel from './model.js';
import TicTacToeView from './view.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('loading');
    const gameElement = document.getElementById('game');
    const newGameButton = document.getElementById('new-game-button');
    const modalCancelButton = document.getElementById('modal-cancel-button');
    const modalNewGameButton = document.getElementById('modal-new-game-button'); // Añadido
    let playerSymbol;
    let model;
    let view;

    function showModal(message, showNewGameButton = false) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;
        const modalOkButton = document.getElementById('modal-ok-button'); // Añadido
        const modalCancelButton = document.getElementById('modal-cancel-button'); // Añadido
        modalOkButton.style.display = 'none'; // Ocultar botón OK
        modalCancelButton.style.display = 'none'; // Ocultar botón Cancelar
        modalNewGameButton.style.display = showNewGameButton ? 'inline-block' : 'none';
        modal.style.display = 'block';
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
    }

    document.querySelector('.close-button').addEventListener('click', closeModal);
    document.getElementById('modal-ok-button').addEventListener('click', closeModal);
    modalCancelButton.addEventListener('click', closeModal);
    modalNewGameButton.addEventListener('click', async () => {
        closeModal();
        showIdModal(); // Mostrar modal para ingresar ID del juego al iniciar nueva partida
    });
    
    // Función para inicializar el juego
    async function initializeGame(gameId) {
        loadingElement.style.display = 'flex';
        gameElement.style.display = 'none';

        model = new TicTacToeModel(gameId);
        const existingGameData = await model.getGameData();

        if (existingGameData) {
            if (existingGameData.player1 && !existingGameData.player2) {
                playerSymbol = existingGameData.player1 === 'X' ? 'O' : 'X';
                await model.setPlayerSymbol(playerSymbol, 'player2');
                showModal(`Tú eres el jugador ${playerSymbol}`);
            } else if (existingGameData.player1 && existingGameData.player2) {
                showModal("Este juego ya ha comenzado y tiene dos jugadores.");
                loadingElement.style.display = 'none';
                return;
            }
        } else {
            playerSymbol = 'X';
            await model.setPlayerSymbol(playerSymbol, 'player1');
            showModal(`Tú eres el jugador ${playerSymbol}`);
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
                }
            } else {
                showModal("Es el turno del otro jugador.");
            }
        });

        model.listenToBoardChanges((data) => {
            view.updateBoard(data);
            const winner = model.checkWinner(data);
            if (winner || model.isBoardFull(data)) {
                if (winner) {
                    showModal(`¡${winner} ha ganado!`, true);
                } else {
                    showModal("¡Es un empate!", true);
                }
            }
        });
    

        newGameButton.style.display = 'none'; // Ocultar el botón de nueva partida al iniciar una nueva partida
    }

    // Mostrar modal para ingresar el ID del juego
    function showIdModal() {
        const idModal = document.getElementById('id-modal');
        idModal.style.display = 'block';
    }

    // Cerrar modal de ingresar ID del juego
    function closeIdModal() {
        const idModal = document.getElementById('id-modal');
        idModal.style.display = 'none';
    }

    document.querySelector('.close-button').addEventListener('click', closeIdModal);
    document.getElementById('id-modal-ok-button').addEventListener('click', async () => {
        const gameIdInput = document.getElementById('game-id-input');
        const gameId = gameIdInput.value;
        if (gameId) {
            closeIdModal();
            await initializeGame(gameId);
        }
    });
    
    window.addEventListener('click', (event) => {
        const idModal = document.getElementById('id-modal');
        if (event.target === idModal) {
            closeIdModal();
        }
    });

    // Mostrar modal para ingresar ID del juego al cargar la página
    showIdModal();
});
