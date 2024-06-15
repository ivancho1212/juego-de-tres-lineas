import { db } from './firebase.js';
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

class TicTacToeModel {
    constructor(gameId) {
        this.gameId = gameId;
        this.currentPlayer = 'X';
    }

    showModal(message) {
        const modal = document.getElementById('modal');
        const modalMessage = document.getElementById('modal-message');
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    async updateBoard(cellIndex, player) {
        const gameRef = doc(db, 'games', this.gameId);
        const gameData = await this.getGameData();

        await setDoc(gameRef, {
            [cellIndex]: player,
            currentPlayer: this.switchPlayer(player)
        }, { merge: true });

        const updatedGameData = await this.getGameData();
        const winner = this.checkWinner(updatedGameData);
        if (winner) {
            this.showModal(`¡${winner} ha ganado!`);
            document.getElementById('new-game-button').style.display = 'block'; // Mostrar el botón al ganar
        } else if (this.isBoardFull(updatedGameData)) {
            this.showModal("¡Es un empate!");
            document.getElementById('new-game-button').style.display = 'block'; // Mostrar el botón en empate
        }
    }

    listenToBoardChanges(callback) {
        const gameRef = doc(db, 'games', this.gameId);
        onSnapshot(gameRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                callback(data);
                this.currentPlayer = data.currentPlayer;
            }
        });
    }

    switchPlayer(player) {
        return player === 'X' ? 'O' : 'X';
    }

    async getGameData() {
        const gameRef = doc(db, 'games', this.gameId);
        const gameDoc = await getDoc(gameRef);
        if (gameDoc.exists()) {
            return gameDoc.data();
        } else {
            return null;
        }
    }

    async setPlayerSymbol(symbol, player) {
        const gameRef = doc(db, 'games', this.gameId);
        if (player === 'player1') {
            await setDoc(gameRef, {
                player1: symbol,
                currentPlayer: symbol
            }, { merge: true });
        } else if (player === 'player2') {
            await setDoc(gameRef, {
                player2: symbol
            }, { merge: true });
        }
    }

    async isPlayerTurn(player) {
        const gameRef = doc(db, 'games', this.gameId);
        const gameDoc = await getDoc(gameRef);
        if (gameDoc.exists()) {
            const data = gameDoc.data();
            return data.currentPlayer === player;
        }
        return false;
    }

    checkWinner(gameData) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
            [0, 4, 8], [2, 4, 6]             // diagonal
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameData[a] && gameData[a] === gameData[b] && gameData[a] === gameData[c]) {
                return gameData[a];
            }
        }
        return null;
    }

    isBoardFull(gameData) {
        for (let i = 0; i < 9; i++) {
            if (!gameData[i]) {
                return false;
            }
        }
        return true;
    }
}

export default TicTacToeModel;
