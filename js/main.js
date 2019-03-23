let game = (function () {

    let board = {
        rows: 40,
        columns: 40,
        currentBoard: [],
        nextBoard: [],
        stopButton: document.getElementById('stop'),
        startButton: document.getElementById('start'),
        ths: document.getElementsByTagName('th'),
        intervalHolder: null,
    };
    board.stopButton.addEventListener('click',() => {closeMoving()});
    board.startButton.addEventListener('click',() => {startMoving()});
    document.addEventListener('click', function(e){
        if(e.target.tagName=="TH"){
            console.log(this);
            getMySpatialPosition(e.target);
        }
    }.bind(this));

    const getMySpatialPosition = (target) => {
        const parent = target.parentNode;
        const grandfather = parent.parentNode;
        const columnIndex = Array.prototype.indexOf.call(parent.children, target);
        const rowIndex = Array.prototype.indexOf.call(grandfather.children, parent);
        flipCell(columnIndex,rowIndex);
    };

    const flipCell = (columnIndex,rowIndex) => {
        let next = Array.from(board.currentBoard);
        let curCellValue = board.currentBoard[rowIndex][columnIndex];
        let nextCellValue = curCellValue ? 0 : 1;
        next[rowIndex][columnIndex] = nextCellValue;
        board.currentBoard = next;
        render(next);
    };

    const generateRandomBoard = () => {
        let tmp = [];
        for (let i = 0; i < board.rows; i++) {
            let row = [];
            for (let j = 0; j < board.columns; j++) {
                let cell = Math.round((Math.random() * 1));
                row.push(cell);
            }
            tmp.push(row);
        }
        return tmp;
    };

    const init = () => {
        board.currentBoard = generateRandomBoard();
        render(board.currentBoard);
    };

    const startMoving = () => {
        board.intervalHolder = animate();
    };

    const closeMoving = () => {
        clearInterval(board.intervalHolder);
    };

    const animate = () => {
        console.log(board.currentBoard);
        return setInterval(function(){
            board.currentBoard = createNextBoard(board.currentBoard);
            render(board.currentBoard);
        },100);
    };

    const countLiveNeighbours = (boardRow, boardColumn) => {
        let liveNeighbours = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                let curRow, curColumn;
                curRow = boardRow + i;
                curColumn = boardColumn + j;
                if (curRow === -1) {
                    curRow = board.currentBoard.length - 1
                }
                if (curRow === board.currentBoard.length) {
                    curRow = 0
                }
                if (curColumn === -1) {
                    curColumn = board.currentBoard[curRow].length - 1
                }
                if (curColumn === board.currentBoard.length) {
                    curColumn = 0
                }
                if (board.currentBoard[curRow][curColumn] === 1) {
                    liveNeighbours++;
                }
            }
        }
        return liveNeighbours;
    };

    const createNextBoard = (incomeBoard) => {
        const createdNextBoard = incomeBoard.map((row, rowIndex, board) => {
            return row.map((cell, columnIndex, row) => {
                let countedLiveNeighbours = countLiveNeighbours(rowIndex,columnIndex);
                return cell
                    ? (countedLiveNeighbours < 2 || countedLiveNeighbours > 3) ? 0 : 1
                    : (countedLiveNeighbours === 3) ? 1 : 0;
            })
        });
        return createdNextBoard;
    };

    const render = (board) => {
        const target = document.getElementById('visual');
        const built = document.createElement('table');
        for (let i = 0; i < board.length; i++) {
            let tabRow = document.createElement('tr');
            for (let j = 0; j < board[i].length; j++) {
                let tabColumn = document.createElement('th');
                if(board[i][j]===1){tabColumn.classList.add('on')}
                tabRow.appendChild(tabColumn);
            }
            built.appendChild(tabRow);
        }
        target.innerHTML = '';
        target.appendChild(built);
    };

    return {
        init
    }

})();

game.init();

