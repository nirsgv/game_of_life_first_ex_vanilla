let game = (function () {

    let board = {
        rows: 5,
        columns: 5,
        boolData: [],
        stopButton: document.getElementById('stop'),
        startButton: document.getElementById('start'),
        ths: document.getElementsByTagName('th'),
        intervalHolder: null,

        getMySpatialPosition: function (target) {
            const parent = target.parentNode;
            const parentParent = parent.parentNode;
            const myColumnIndex = Array.prototype.indexOf.call(parent.children, target);
            const myRowIndex = Array.prototype.indexOf.call(parentParent.children, parent);
            console.log(myColumnIndex,myRowIndex);
            this.flipCell(myColumnIndex,myRowIndex);
            //return alert(this.boolData);
        },
        flipCell: function (myColumnIndex,myRowIndex) {
            let next = Array.from(this.boolData);
            let curCellValue = this.boolData[myRowIndex][myColumnIndex];
            let nextCellValue = curCellValue===1 ? 0 : 1;
            next[myRowIndex][myColumnIndex] = nextCellValue;

            console.log(curCellValue);
            console.log(nextCellValue);
            console.log(this.checkForNeighbours(myRowIndex,myColumnIndex));
            this.boolData = next;
            this.render(next);
        },
        init: function () {
            let tmp = [];
            for (let i = 0; i < this.rows; i++) {
                let rowTmp = [];
                for (let j = 0; j < this.columns; j++) {
                    let columnTmp = this.getRandom();
                    rowTmp.push(columnTmp);
                }
                tmp.push(rowTmp);
            }
            this.boolData = Array.from(tmp);

            this.stopButton.addEventListener('click',() => {this.closeMoving()});
            this.startButton.addEventListener('click',() => {this.moveRepeatedly()});
            document.addEventListener('click', function(e){
                if(e.target.tagName=="TH"){
                    console.log(this);
                    this.getMySpatialPosition(e.target);
                }
            }.bind(this))
        },
        getRandom: function () {
            return +(Math.random() > 0.001);
        },
        checkForNeighbours: function (boardRow, boardColumn) {
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
                        curRow = this.boolData.length - 1
                    }
                    if (curRow === this.boolData.length) {
                        curRow = 0
                    }
                    if (curColumn === -1) {
                        curColumn = this.boolData[curRow].length - 1
                    }
                    if (curColumn === this.boolData.length) {
                        curColumn = 0
                    }
                    if (this.boolData[curRow][curColumn] === 1) {
                        liveNeighbours++;
                    }
                }
            }
            return liveNeighbours;
        },
        moveOnce: function (incomeArr) {
            var next = this.boolData.slice();

                for (let i = 0; i < this.boolData.length; i++) {
                let currentRow = this.boolData[i].slice();
                for (let j = 0; j < currentRow.length; j++) {
                    let currentCell = currentRow[j];
                    let liveNeighbours = this.checkForNeighbours(i, j);

                    if (currentCell === 0) {
                        if (liveNeighbours === 3) {
                            next[i][j] = 1; // reproduction
                        }
                        else {
                            next[i][j] = 0; // stasis
                        }
                    } else if (currentCell === 1) {
                        if (liveNeighbours < 2) {
                            next[i][j] = 0; // loneliness
                        } else if (liveNeighbours > 3){
                            next[i][j] = 0; // over reproduction
                        }
                        else {
                            next[i][j] = 1; // stasis
                        }
                    }
                }
               console.log(this.boolData);
               console.log(next);
               //console.assert(this.boolData===next, 'not equal');
                //this.boolData = next;
            }

            this.render(next);
        },
        moveRepeatedly: function (chosenAction) {
             intervalHolder = setInterval(this.moveOnce.bind(this), 400);

        },
        closeMoving: function () {
            clearInterval(intervalHolder);

        },
        render: function (next) {
            console.log(next);
            console.log(this.boolData);
            const target = document.getElementById('visual');
            const built = document.createElement('table');
            for (let i = 0; i < next.length; i++) {
                let tabRow = document.createElement('tr');
                for (let j = 0; j < next[i].length; j++) {
                    let tabColumn = document.createElement('th');
                    if(next[i][j]===1){tabColumn.classList.add('on')}
                    tabRow.appendChild(tabColumn);
                }
                built.appendChild(tabRow);
            }
            target.innerHTML = '';
            target.appendChild(built);
        }
    };
    return board;

})();
game.init();
game.moveRepeatedly();

