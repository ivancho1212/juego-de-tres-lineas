class TicTacToeView {
    constructor() {
        this.boardElement = document.getElementById('board');
        this.initializeBoard();
    }

    initializeBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-cell-index', i);
            this.boardElement.appendChild(cell);
        }

        const lineHorizontal1 = document.createElement('div');
        lineHorizontal1.classList.add('line', 'horizontal');
        const lineHorizontal2 = document.createElement('div');
        lineHorizontal2.classList.add('line', 'horizontal2');
        const lineVertical1 = document.createElement('div');
        lineVertical1.classList.add('line', 'vertical');
        lineVertical1.style.left = 'calc(33.33% - 1.5px)';
        const lineVertical2 = document.createElement('div');
        lineVertical2.classList.add('line', 'vertical');
        lineVertical2.style.left = 'calc(66.66% - 1.5px)';

        this.boardElement.appendChild(lineHorizontal1);
        this.boardElement.appendChild(lineHorizontal2);
        this.boardElement.appendChild(lineVertical1);
        this.boardElement.appendChild(lineVertical2);
    }

    updateBoard(data) {
        for (const cellIndex in data) {
            const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
            if (cell) {
                cell.textContent = data[cellIndex];
            }
        }
    }

    setCellClickHandler(handler) {
        this.boardElement.addEventListener('click', (event) => {
            if (event.target.classList.contains('cell') && !event.target.textContent) {
                const cellIndex = event.target.getAttribute('data-cell-index');
                handler(cellIndex);
            }
        });
    }

    getCellContent(cellIndex) {
        const cell = document.querySelector(`[data-cell-index="${cellIndex}"]`);
        return cell ? cell.textContent : null;
    }
}

export default TicTacToeView;
