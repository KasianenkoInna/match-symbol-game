'use strict';

module['exports'] = class Game
{
    constructor(width, height)
    {
        this.cells = new Map();
        this.walkMap = new Map();
        this.currentSymbol = null;

        this._initializeTable(width, height);
    }

    _initializeTable(width, height)
    {
        for (let y = 0; y < height; y++) {
            let row = '';
            let delimiterRow = '';
            for (let x = 0; x < width; x++) {
                let cell = this._generateCellObject(x, y);
                this._addCell(cell);
                delimiterRow += '|-----|'
                row += `|  ${cell.symbol}  |`
            }
            console.log(delimiterRow);
            console.log(row);
            console.log(delimiterRow);
        }
    }

    _makeCellKey(x, y)
    {
        return `${x}_${y}`;
    }

    _generateCellObject(x, y)
    {
        return {'x': x, 'y': y, 'symbol': this._generateRandomSymbol()};
    }

    _generateRandomSymbol()
    {
        let symbols = ['\u2666', '\u2660', '\u2663', '\u2665'];
        let randomIndex = Math.floor(Math.random() * symbols.length);

        return symbols[randomIndex];
    }

    _addCell(cell)
    {
        this.cells.set(this._makeCellKey(cell.x, cell.y), cell);
    }

    _removeCell(cellKey)
    {
        return this.cells.delete(cellKey);
    }

    _saveWalkedCellSymbol(cell)
    {
        this.walkMap.set(this._makeCellKey(cell.x, cell.y), cell.symbol)
    }

    _isCellWalked(x, y)
    {
        return this.walkMap.has(this._makeCellKey(x, y));
    }

    onCellPressed(x, y)
    {
        if (0 !== this.walkMap.size) {
            throw new Error(`Trying to pressedOnCell: but walked map is dirty`);
        }

        let cellKey = this._makeCellKey(x, y);
        if(false === this.cells.has(cellKey)) {
            return console.log(`There is no cell with x:${x}, y:${y} in the table`);
        }

        let cell = this.cells.get(cellKey);
        this.currentSymbol = cell.symbol;

        this._saveWalkedCellSymbol(cell);
        this._searchConnectedCells(cell);

        this._afterSearchFinished();
    }

    _afterSearchFinished()
    {
        for (let [cellKey, symbol] of this.walkMap.entries()) {
            if (symbol === this.currentSymbol) {
                console.log(`removeing cell: ${cellKey} symbol: ${symbol}`);
                if (false === this._removeCell(cellKey)) {
                    throw new Error(`Trying to remove not existed cell with key: ${cellKey}`);
                }
            }
        }

        this.walkMap.clear();
    }

    _searchConnectedCells(cell)
    {
        this._move(cell.x + 1, cell.y);
        this._move(cell.x - 1, cell.y);
        this._move(cell.x, cell.y - 1);
        this._move(cell.x, cell.y + 1);
    }

    /**
    * @return {void}
    */
    _move(x, y)
    {
        let cellKey = this._makeCellKey(x, y);
        if (false === this.cells.has(cellKey) || this._isCellWalked(x, y)) {
            return;
        }

        let cell = this.cells.get(cellKey);
        this._saveWalkedCellSymbol(cell);

        if (cell.symbol === this.currentSymbol) {
            this._searchConnectedCells(cell)
        }
    }
}
