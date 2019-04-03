let game = (function () {

    let board = {
        rows: 40,
        columns: 40,
        currentBoard: [],
        nextBoard: [],
        highlighted: [[1,1],[1,2]],
        intervalHolder: null,
    };
    const domELements = {
        startButton: document.getElementById('start'),
        stopButton: document.getElementById('stop'),
        clearButton: document.getElementById('clear'),
        fillButton: document.getElementById('fill'),
        ths: document.getElementsByTagName('th'),
        target: document.getElementById('visual'),
        numberRows: document.getElementById('numberRows'),
        numberColumns: document.getElementById('numberColumns'),
        drag: document.getElementById('drag'),
    };
    // set initial display value of inputs according to data
    domELements.numberRows.value = board.rows;
    domELements.numberColumns.value = board.columns;

    domELements.stopButton.addEventListener('click',() => {closeMoving()});
    domELements.startButton.addEventListener('click',() => {startMoving()});
    domELements.clearButton.addEventListener('click',() => {clearBoard()});
    domELements.fillButton.addEventListener('click',() => {fillBoard()});
    domELements.numberRows.addEventListener('input',(e) => {changeBoardSize(e)});
    domELements.numberColumns.addEventListener('input',(e) => {changeBoardSize(e)});
    domELements.drag.addEventListener('dragstart',(e) => {draggingElem(e)});
    domELements.drag.addEventListener('dragend',(e) => {droppingElem(e)});

    document.addEventListener('click', function (event) {
        if (!event.target.matches('.cell')) return;
        console.log(event.target);
    }, false);

    //document.addEventListener('dragenter', dragEnter);
    //document.addEventListener('dragleave', dragLeave);
    //document.addEventListener('drop', dragDrop);

    document.addEventListener('dragover', dragOver = (e) => {
        e.preventDefault();
        if (!event.target.matches('.cell')) return;
        console.log(getMySpatialPosition(event.target));
    }, false);

    document.addEventListener('drop', dragDrop = (e) => {
        e.stopPropagation();

        if (!event.target.matches('.cell')) return;
        const SpatialPosition = getMySpatialPosition(event.target);
        console.log(SpatialPosition);
        console.log(event.target);
        paintCreature(SpatialPosition[0],SpatialPosition[1]);

        console.log(e.target);
    }, false);

    const draggingElem = (e) => {
        console.log('draggingElemd');
    };

    const droppingElem = (e) => {
        console.log('droppingElem');
    };

    document.addEventListener('click', function(e){
        if(e.target.tagName=="TH"){
            var spatialPos = getMySpatialPosition(e.target);
            flipCell(spatialPos[0],spatialPos[1]);
        }
    }.bind(this));


    const changeBoardSize = (e) => {
        var rowsOrColumns = e.currentTarget.id === 'numberRows' ? 'rows' : 'columns';
        board[rowsOrColumns] = e.target.value;
        init();
    };


    const getMySpatialPosition = (target) => {
        const parent = target.parentNode;
        const grandfather = parent.parentNode;
        const columnIndex = Array.prototype.indexOf.call(parent.children, target);
        const rowIndex = Array.prototype.indexOf.call(grandfather.children, parent);
        return [columnIndex,rowIndex];
    };

    const flipCell = ( columnIndex, rowIndex ) => {
        let next = Array.from(board.currentBoard);
        let curCellValue = board.currentBoard[rowIndex][columnIndex];
        let nextCellValue = curCellValue ? 0 : 1;
        next[rowIndex][columnIndex] = nextCellValue;
        board.currentBoard = next;
        render(next);
    };

    const highlightCreature = ( columnIndex, rowIndex, shape ) => {
        let next = Array.from(board.currentBoard);
        next[rowIndex][columnIndex] = 1;
        next[rowIndex][columnIndex+1] = 1;
        next[rowIndex+1][columnIndex] = 1;
        next[rowIndex+1][columnIndex+1] = 1;
        board.currentBoard = next;
        render(next);
    };


    const paintCreature = ( columnIndex, rowIndex, shape ) => {
        let next = Array.from(board.currentBoard);
        next[rowIndex][columnIndex] = 1;
        next[rowIndex][columnIndex+1] = 1;
        next[rowIndex+1][columnIndex] = 1;
        next[rowIndex+1][columnIndex+1] = 1;
        board.currentBoard = next;
        render(next);
    };

    const generateBoard = (boardStartMode) => {
        let tmp = [];
        for (let i = 0; i < board.rows; i++) {
            let row = [];
            for (let j = 0; j < board.columns; j++) {
                let cell;

                switch(boardStartMode) {
                    case 'full':
                        cell = 1;
                        break;
                    case 'empty':
                        cell = 0;
                        break;
                    case 'random':
                        cell = Math.round((Math.random() * 1));
                        break;
                }
                row.push(cell);
            }
            tmp.push(row);
        }
        return tmp;
    };

    const init = () => {
        board.currentBoard = generateBoard('random');
        render(board.currentBoard);
    };

    const startMoving = () => {
        if(!board.intervalHolder){
            board.intervalHolder = animate();
        }
    };

    const closeMoving = () => {
        clearInterval(board.intervalHolder);
        board.intervalHolder = null;
    };

    const clearBoard = () => {
        board.currentBoard = generateBoard('empty');
        render(board.currentBoard);
    };

    const fillBoard = () => {
        board.currentBoard = generateBoard('full');
        render(board.currentBoard);
    };

    const animate = () => {
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
        const built = document.createElement('table');
        for (let i = 0; i < board.length; i++) {
            let tabRow = document.createElement('tr');
            for (let j = 0; j < board[i].length; j++) {
                let tabColumn = document.createElement('th');
                tabColumn.classList.add('cell');
                if(board[i][j]===1){tabColumn.classList.add('on')}
                tabRow.appendChild(tabColumn);
            }
            built.appendChild(tabRow);
        }
        domELements.target.innerHTML = '';
        domELements.target.appendChild(built);
    };

    return {
        init
    }

})();

game.init();

