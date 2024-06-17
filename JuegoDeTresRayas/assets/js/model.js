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
    }

    switchPlayer(player) {
        return player === 'X' ? 'O' : 'X';
    }

    async isPlayerTurn(player) {
        const gameData = await this.getGameData();
        return gameData.currentPlayer === player;
    }

    async getGameData() {
        const gameRef = doc(db, 'games', this.gameId);
        const gameSnapshot = await getDoc(gameRef);
        return gameSnapshot.exists() ? gameSnapshot.data() : null;
    }

    listenToBoardChanges(callback) {
        const gameRef = doc(db, 'games', this.gameId);
        onSnapshot(gameRef, (docSnapshot) => {
            callback(docSnapshot.data());
        });
    }

    async setPlayerSymbol(playerSymbol, playerField) {
        const gameRef = doc(db, 'games', this.gameId);
        const updateData = {};
        updateData[playerField] = playerSymbol;
        updateData.currentPlayer = 'X';  // Set the current player to 'X' initially
        await setDoc(gameRef, updateData, { merge: true });
    }

    isBoardFull(cells) {
        return Array.from(cells).every(cell => cell.textContent !== '');
    }
}

export default TicTacToeModel;
