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

    document.addEventListener('drop', function dragDrop (event) {
        event.stopPropagation();

        //if (!event.target.matches('.cell')) return;

        const SpatialPosition = getMySpatialPosition(event.target);
        console.log(SpatialPosition);
        console.log(event.target);
        paintCreature(SpatialPosition[0],SpatialPosition[1]);

        console.log(event.target);
    }, false);

    //document.addEventListener('dragenter', dragEnter);
    //document.addEventListener('dragleave', dragLeave);
    //document.addEventListener('drop', dragDrop);


    document.addEventListener('dragover',  _.throttle( function dragOver(event) {
        event.preventDefault();

        if (!event.target.matches('.cell')) return;
        const SpatialPosition = getMySpatialPosition(event.target);
        highlightCreature(SpatialPosition[0],SpatialPosition[1]);
    },60), false);



    const draggingElem = (event) => {
        console.log('draggingElemd');

    };

    const droppingElem = (event) => {
        event.stopPropagation();
        console.log('droppingElem');
        console.log('droppingElem: ', event);
    };


    // flip cell on click
    document.addEventListener('click', function(e){
        if(e.target.tagName=="TH"){
            var spatialPos = getMySpatialPosition(e.target);
            flipCell(spatialPos[0],spatialPos[1]);
        }
    }.bind(this));


    const changeBoardSize = (e) => {
        const rowsOrColumns = e.currentTarget.id === 'numberRows' ? 'rows' : 'columns';
        board[rowsOrColumns] = e.target.value;
        init();
    };


    const getMySpatialPosition = (target) => {
        const parent = target.parentNode,
              grandfather = parent.parentNode,
              columnIndex = Array.prototype.indexOf.call(parent.children, target),
              rowIndex = Array.prototype.indexOf.call(grandfather.children, parent);
        return [columnIndex,rowIndex];
    };

    const flipCell = ( columnIndex, rowIndex ) => {
        let next = Array.from(board.currentBoard);
        let curCellValue = board.currentBoard[rowIndex][columnIndex].cellState;
        let nextCellValue = curCellValue ? {cellState:0,cellHighlight:0} : {cellState:1,cellHighlight:0};
        next[rowIndex][columnIndex] = nextCellValue;
        board.currentBoard = next;
        render(next);
    };

    const clearBoardHighlights = (board) => {
        const createdNextBoard = board.map((row, rowIndex, board) => {
            return row.map((cell, columnIndex, row) => {
                cell.cellHighlight = 0;
                return cell
            })
        });
        return createdNextBoard;
    };


    const highlightCreature = ( columnIndex, rowIndex, shape ) => {
        let clearedBoard = clearBoardHighlights(Array.from(board.currentBoard));
        clearedBoard[rowIndex][columnIndex].cellHighlight = 1;
        clearedBoard[rowIndex][columnIndex+1].cellHighlight = 1;
        clearedBoard[rowIndex+1][columnIndex].cellHighlight = 1;
        clearedBoard[rowIndex+1][columnIndex+1].cellHighlight = 1;
        board.currentBoard = clearedBoard;
        render(clearedBoard);
    };


    const paintCreature = ( columnIndex, rowIndex, shape ) => {
        let next = Array.from(board.currentBoard);
        next[rowIndex][columnIndex] = {cellState:1,cellHighlight:0};
        next[rowIndex][columnIndex+1] = {cellState:1,cellHighlight:0};
        next[rowIndex+1][columnIndex] = {cellState:1,cellHighlight:0};
        next[rowIndex+1][columnIndex+1] = {cellState:1,cellHighlight:0};
        board.currentBoard = next;
        render(next);
    };

    const generateBoard = (boardStartMode) => {
        let tmp = [];
        for (let i = 0; i < board.rows; i++) {
            let row = [];
            for (let j = 0; j < board.columns; j++) {
                let cell = {};
                let cellState;
                let cellHighlight = 0;
                switch(boardStartMode) {
                    case 'full':
                        cellState = 1;
                        break;
                    case 'empty':
                        cellState = 0;
                        break;
                    case 'random':
                        cellState = Math.round((Math.random() * 1));
                        break;
                }
                cell.cellState = cellState;
                cell.cellHighlight = cellHighlight;
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
                if (board.currentBoard[curRow][curColumn] && board.currentBoard[curRow][curColumn].cellState === 1) {
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
                return cell.cellState
                    ? (countedLiveNeighbours < 2 || countedLiveNeighbours > 3) ? {cellState:0,cellHighlight:0} : {cellState:1,cellHighlight:0}
                    : (countedLiveNeighbours === 3) ? {cellState:1,cellHighlight:0} : {cellState:0,cellHighlight:0}
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
                if(board[i][j].cellState===1){tabColumn.classList.add('on')}
                if(board[i][j].cellHighlight===1){tabColumn.classList.add('highlighted')}
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

