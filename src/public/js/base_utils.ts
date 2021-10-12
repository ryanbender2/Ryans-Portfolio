// utils file for the base js

/**
 * Colors.
 */
const Color: { [key: string]: string } = {
    BLACK: 'rgb(0, 0, 0)',
    RED: 'rgb(255, 0, 0)',
    WHITE: 'rgb(255, 255, 255)'
}

/**
 * Move statuses.
 */
enum MoveStatus {
    GOOD = 'GOOD',
    HITS_SELF = 'HITS_SELF',
    OUT_OF_BOUNDS = 'OUT_OF_BOUNDS',
}

/**
 * Represents a box node.
 */
class BoxNode {
    tile: Tile
    next: this
    x: number
    y: number

    constructor(tile: Tile) {
        this.tile = tile
        this.next = null
        this.x = tile.x
        this.y = tile.y
    }
}

/**
 * Represents a tile.
 */
class Tile {
    ele: JQuery<HTMLElement>
    x: number
    y: number
    constructor(ele: JQuery<HTMLElement>, x: number, y: number) {
        this.ele = ele
        this.x = x
        this.y = y
    }
    setBlack(): void {
        this.setColor(Color.BLACK)
    }
    setRed(): void {
        this.setColor(Color.RED)
    }
    setWhite(): void {
        this.setColor(Color.WHITE)
    }
    /**
     * Change color of tile.
     * @param {Color} color color enum value
     */
    setColor(color: string): void {
        this.ele.css("background-color", color)
    }
    getColor(): string {
        var keys = Object.keys(Color).filter(x => Color[x] == this.ele.css("background-color"))
        return keys.length > 0 ? keys[0] : ''
    }
}

/**
 * Sleep for a given amount of time.
 * 
 * @param ms time to sleep in ms
 * @returns Nothing, await this
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class GameUtils {
    /**
     * Get a random int.
     * 0 inclusive and max exclusive.
     * Example: rng(3) -> returns either 0, 1, or 2
     * @param {number} max
     * @returns {number} random number
     */
    static rng(max: number): number {
        return Math.floor(Math.random() * max);
    }

    /**
     * Get a random number inbetween min and max.
     * 
     * @param min min
     * @param max max
     * @returns random number
     */
    static rngRange(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Pick a random item in list.
     * @param {Array} arr
     */
    static rngChoice(arr: Array<any>): any {
        var len = arr.length;
        return arr[this.rng(len)];
    }

    /**
     * Wipe the game board clean.
     *
     * @param {Tile[][]} board board
     * @param {number} speed speed of wipe in ms
     * @param {number} numTilesToWipe wiper size
     */
    static async boardWipe(board: Tile[][], speed: number, numTilesToWipe: number) {
        var backSide = -numTilesToWipe;
        for (var i = 0; i < board[0].length + numTilesToWipe * 2 + 2; i++) {
            var tempBack = backSide;
            var tempFront = i;
            for (var row = 0; row < board.length; row++) {
                this.setRowSectionWhite(board, row, tempBack, tempFront);
                tempBack--;
                tempFront--;
            }
            backSide++;
            await sleep(speed);
        }
    }

    /**
     * Paint a row on the board white.
     *
     * @param {Tile[][]} board the board
     * @param {number} row which row
     * @param {number} start start of painting white
     * @param {number} end end of painting white
     */
    static setRowSectionWhite(board: Tile[][], row: number, start: number, end: number) {
        var gameRow = board[row];
        if (end > gameRow.length) end = gameRow.length;
        for (var i = 0; i < end; i++) {
            if (i < start) gameRow[i].setBlack();
            else if (i >= start) gameRow[i].setWhite();
        }
    }
}
