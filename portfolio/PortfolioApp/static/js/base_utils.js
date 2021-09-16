const colorNames = {
  "rgb(0, 0, 0)": "BLACK",
  "rgb(255, 255, 255)": "WHITE",
  "rgb(255, 0, 0)": "RED",
}

const color = {
    BLACK: 'BLACK',
    RED: 'RED',
    WHITE: 'WHITE'
}

const colorCodes = {
    'BLACK': 'rgb(0, 0, 0)',
    'RED': 'rgb(255, 0, 0)',
    'WHITE': 'rgb(255, 255, 255)'
}

const MoveStatus = {
  GOOD: "GOOD",
  HITS_SELF: "HITS_SELF",
  OUT_OF_BOUNDS: "OUT_OF_BOUNDS",
}

class BoxNode {
  constructor(tile) {
    this.tile = tile
    this.next = null
    this.x = tile.x
    this.y = tile.y
  }
}

class Tile {
  constructor(ele, x, y) {
    this.ele = ele
    this.x = x
    this.y = y
  }
  setBlack() {
    this.ele.css("background-color", "black")
  }
  setRed() {
    this.ele.css("background-color", "red")
  }
  setWhite() {
    this.ele.css("background-color", "white")
  }
  /**
   * Change color of tile.
   * @param {string} color rgb value (get from colorCodes)
   */
  setColor(color) {
    this.ele.css("background-color", color)
  }
  getColor() {
    return colorNames[this.ele.css("background-color")];
  }
}

function sleep(ms) {
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
  static rng(max) {
    return Math.floor(Math.random() * max);
  }
  /**
   * Pick a random item in list.
   * @param {Array} arr
   */
  static rngChoice(arr) {
    var len = arr.length;
    return arr[this.rng(len)];
  }

  /**
   * Wipe the game board clean.
   *
   * @param {array} board board
   * @param {number} speed speed of wipe in ms
   * @param {number} numTilesToWipe wiper size
   */
  static async boardWipe(board, speed, numTilesToWipe) {
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
   * @param {Array} board the board
   * @param {number} row which row
   * @param {number} start start of painting white
   * @param {number} end end of painting white
   */
  static setRowSectionWhite(board, row, start, end) {
    var gameRow = board[row];
    if (end > gameRow.length) end = gameRow.length;
    for (var i = 0; i < end; i++) {
      if (i < start) gameRow[i].setBlack();
      else if (i >= start) gameRow[i].setWhite();
    }
  }
}
