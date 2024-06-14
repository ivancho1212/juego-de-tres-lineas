import TicTacToeModel from './model.js';
import TicTacToeView from './view.js';

document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('loading');
    const gameElement = document.getElementById('game');
    let playerSymbol;

    try {
        const gameId = prompt("Ingrese el ID del juego:");
        loadingElement.style.display = 'flex';
        gameElement.style.display = 'none';

        // Obtener el estado actual del juego desde la base de datos
        const model = new TicTacToeModel(gameId);
        const existingGameData = await model.getGameData();

        if (existingGameData) {
            // Si el primer jugador ya ha elegido un símbolo
            if (existingGameData.player1 && !existingGameData.player2) {
                playerSymbol = existingGameData.player1 === 'X' ? 'O' : 'X';
                await model.setPlayerSymbol(playerSymbol, 'player2');
                alert(`Tú eres el jugador ${playerSymbol}`);
            } else if (existingGameData.player1 && existingGameData.player2) {
                alert("Este juego ya ha comenzado y tiene dos jugadores.");
                loadingElement.style.display = 'none';
                return;
            }
        } else {
            // Si no hay datos de juego, asignar "X" al primer jugador
            playerSymbol = 'X';
            await model.setPlayerSymbol(playerSymbol, 'player1');
            alert(`Tú eres el jugador ${playerSymbol}`);
        }

        const view = new TicTacToeView();
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
                alert("Es el turno del otro jugador.");
            }
        });

        model.listenToBoardChanges((data) => {
            view.updateBoard(data);
        });

    } catch (error) {
        console.error('Error:', error);
        loadingElement.style.display = 'none';
        gameElement.style.display = 'none';
    }
});
