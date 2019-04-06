let game = (function () {

    let board = {
        rows: 40,
        columns: 40,
        currentBoard: [],
        nextBoard: [],
        intervalHolder: null,
        chosenKind: 'stillLifes',
        chosenCreature: 'beehive',
    };
    const creatures = {
            block: {
                structure: [
                    [1,1],[1,1]
                ],
                kind: 'stillLifes',
                title: 'Block',
                value: 'block'
            },
            beehive: {
                structure: [
                    [0,1,1,0],[1,0,0,1],[0,1,1,0]
                ],
                kind: 'stillLifes',
                title: 'Beehive',
                value: 'beehive'
            },
            loaf: {
                structure: [
                    [0,1,1,0],[1,0,0,1],[0,1,0,1],[0,0,1,0]
                ],
                kind: 'stillLifes',
                title: 'Loaf',
                value: 'loaf'
            },
            boat: {
                structure: [
                    [1,1,0],[1,0,1],[0,1,0]
                ],
                kind: 'stillLifes',
                title: 'Boat',
                value: 'boat'
            },
            tub: {
                structure: [
                    [0,1,0],[1,0,1],[0,1,0]
                ],
                kind: 'stillLifes',
                title: 'Tub',
                value: 'tub'
            },
            blinker: {
                structure: [
                    [1,1,1]
                ],
                kind: 'oscillators',
                title: 'Blinker',
                value: 'blinker'
            },
            toad: {
                structure: [
                    [0,1,1,1],[1,1,1,0]
                ],
                kind: 'oscillators',
                title: 'Toad',
                value: 'toad'
            },
            beacon: {
                structure: [
                    [1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]
                ],
                kind: 'oscillators',
                title: 'Beacon',
                value: 'beacon'
            },
            pulsar: {
                structure: [
                    [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
                    [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [1,1,1,0,0,1,1,0,1,1,0,0,1,1,1],
                    [0,0,1,0,1,0,1,0,1,0,1,0,1,0,0],
                    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
                    [0,0,1,0,1,0,1,0,1,0,1,0,1,0,0],
                    [1,1,1,0,0,1,1,0,1,1,0,0,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],
                    [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
                    [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
                ],
                kind: 'oscillators',
                title: 'Pulsar',
                value: 'glider'
            },
            pentaDecathlon: {
                structure: [
                    [1,1,1],[1,0,1],[1,1,1],[1,1,1],[1,1,1],[1,1,1],[1,0,1],[1,1,1]
                ],
                kind: 'oscillators',
                title: 'Penta decathlon',
                value: 'pentaDecathlon'
            },
            glider: {
                structure: [
                    [0,1,0],[0,0,1],[1,1,1]
                ],
                kind: 'spaceShips',
                title: 'Glider',
                value: 'glider'
            },
            lightWeightSpaceShip: {
                structure: [
                    [1,0,0,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1]
                ],
                kind: 'spaceShips',
                title: 'Light weight spaceShip',
                value: 'lightWeightSpaceShip'
            },
            middleWeightSpaceShip: {
                structure: [
                    [0,1,1,0,0,0],[1,1,0,1,1,1],[0,1,1,1,1,1],[0,0,1,1,1,0]
                ],
                kind: 'spaceShips',
                title: 'Middle weight spaceShip',
                value: 'middleWeightSpaceShip'
            },
            heavyWeightSpaceShip: {
                structure: [
                    [0,1,1,0,0,0,0],[1,1,0,1,1,1,1],[0,1,1,1,1,1,1],[0,0,1,1,1,1,0]
                ],
                kind: 'spaceShips',
                title: 'Heavy weight spaceShip',
                value: 'heavyWeightSpaceShip'
            },
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
        multiSelect: document.getElementById('multiSelect'),
        creatureSelect: Array.from(document.querySelectorAll('[creatureSelect]')),
        kindControllers: Array.from(document.querySelectorAll('[data-kind]')),
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
    domELements.drag.addEventListener('dragend',(e) => {droppingElem(e)});

    document.addEventListener('click', function (event) {
        if (!event.target.matches('[data-kind]')) return;
        let incomeCat = event.target.dataset.kind;
        board.chosenKind = incomeCat;
        initSelectELems(incomeCat);
        for ( var i=0 ; i < domELements.kindControllers.length ; i++ ) {
            if ( domELements.kindControllers[i].dataset.kind === board.chosenKind ) {
                domELements.kindControllers[i].className = 'active';
            } else {
                domELements.kindControllers[i].className = '';
            }
            console.log(domELements.kindControllers[i].dataset.kind);
        }

    }, false);

    const initSelectELems = (incomeCat) => {
        var crsArray = [];
        for ( let item in creatures ) {
            creatures[item].kind === board.chosenKind && crsArray.push(creatures[item]);
        }
        const multiSelectDom = crsArray.map((item) => {

            return `<option value=${item.value}>${item.title}</option>`
        });
        domELements.multiSelect.innerHTML = multiSelectDom;
    };


    document.addEventListener('change', function (event) {
        if (!event.target.matches('[creatureSelect]')) return;
        board.chosenCreature = event.target.value;
    }, false);

    document.addEventListener('click', function (event) {
        if (!event.target.matches('.cell')) return;
        console.log(event.target);
    }, false);

    document.addEventListener('drop', function dragDrop (event) {
        event.preventDefault();

        if (!event.target.matches('.cell')) return;

        const SpatialPosition = getMySpatialPosition(event.target);
        console.log(SpatialPosition);
        console.log(event.target);
        paintCreature(SpatialPosition[0],SpatialPosition[1]);

        console.log(event.target);
    }, true);

    //document.addEventListener('dragenter', dragEnter);
    //document.addEventListener('dragleave', dragLeave);
    //document.addEventListener('drop', dragDrop);


    document.addEventListener('dragover',  function dragOver(event) {
        event.preventDefault();
        console.log(event.target.id);
        if (!event.target.matches('.cell')) return;
        const SpatialPosition = getMySpatialPosition(event.target);
        highlightCreature(SpatialPosition[0],SpatialPosition[1]);
    }, true);



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
        paint(next);
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
        const currentCreature = board.chosenCreature;
        const structure = creatures[currentCreature].structure;
        let curBoard = board.currentBoard;

        let rowWithEdgeCalculated;
        let columnWithEdgeCalculated;
        for ( var i=0 ; i<structure.length ; i++ ){
            for ( var j=0 ; j<structure[i].length ; j++ ){
                columnWithEdgeCalculated = checkHorizontalEdge(rowIndex + i,columnIndex + j,curBoard);
                rowWithEdgeCalculated = checkVerticalEdge(rowIndex + i,columnIndex + j,curBoard);
                if (clearedBoard && clearedBoard[ rowWithEdgeCalculated ][ columnWithEdgeCalculated ] && structure[i][j] ){
                    clearedBoard[ rowWithEdgeCalculated ][ columnWithEdgeCalculated ].cellHighlight = 1;
                }
            }
        }

        board.currentBoard = clearedBoard;
        paint(clearedBoard);
    };


    const paintCreature = ( columnIndex, rowIndex, shape ) => {
        let next = Array.from(board.currentBoard);
        const currentCreature = board.chosenCreature;
        const structure = creatures[currentCreature] && creatures[currentCreature].structure;
        let curBoard = board.currentBoard;

        let rowWithEdgeCalculated;
        let columnWithEdgeCalculated;

        for ( var i=0 ; i<structure.length ; i++ ){
            for ( var j=0 ; j<structure[i].length ; j++ ){
                columnWithEdgeCalculated = checkHorizontalEdge(rowIndex + i,columnIndex + j,curBoard);
                rowWithEdgeCalculated = checkVerticalEdge(rowIndex + i,columnIndex + j,curBoard);

                if (structure[i][j]) {
                    next[rowWithEdgeCalculated][columnWithEdgeCalculated] = {cellState: 1, cellHighlight: 0};
                }
            }
        }

        board.currentBoard = next;
        paint(next);
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
        paint(board.currentBoard);
    };

    const initSelect = () => {
        board.currentBoard = generateBoard('random');
        render(board.currentBoard);
        paint(board.currentBoard);
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
        paint(board.currentBoard);
    };

    const fillBoard = () => {
        board.currentBoard = generateBoard('full');
        paint(board.currentBoard);
    };

    const animate = () => {
        return setInterval(function(){
            board.currentBoard = createNextBoard(board.currentBoard);
            //render(board.currentBoard);
            paint(board.currentBoard);
        },100);
    };

    const checkHorizontalEdge = (curRow,curColumn,curBoard) => {
        if (curColumn === -1) {
            curColumn = curBoard[curRow].length - 1
        }
        if (curColumn >= curBoard[curRow].length) {
            curColumn = curColumn - curBoard[curRow].length;
        }
        return curColumn;
    };

    const checkVerticalEdge = (curRow,curColumn,curBoard) => {
        if (curRow === -1) {
            curRow = curBoard.length - 1;
        }
        if (curRow >= curBoard.length) {
            curRow = curRow - curBoard.length;
        }
        return curRow;
    };

    const countLiveNeighbours = (boardRow, boardColumn) => {
        let liveNeighbours = 0;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                    continue;
                }
                let curRow, curColumn, curBoard = board.currentBoard;

                curRow = boardRow + i;
                curColumn = boardColumn + j;

                curRow = checkVerticalEdge(curRow,curColumn,curBoard);
                curColumn = checkHorizontalEdge(curRow,curColumn,curBoard);

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
                tabRow.appendChild(tabColumn);
            }
            built.appendChild(tabRow);
        }
        domELements.target.innerHTML = '';
        domELements.target.appendChild(built);
    };

    const paint = (board) => {
        const cells = document.querySelectorAll('.cell');
        let cellIndex = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].cellHighlight===0 && board[i][j].cellState===1){cells[cellIndex].className = 'cell on'}
                else if (board[i][j].cellHighlight===1){cells[cellIndex].className = 'cell highlighted'}
                else {cells[cellIndex].className = 'cell'}
                cellIndex++;
            }
        }
    };

    return {
        init
    }

})();

game.init();

