var gameBoard = null;
var boardMaxX = NaN
var boardMaxY = NaN

$(document).ready(() => {
    const hamburger = $(".hamburger-menu");

    hamburger.on("click", () => {
        hamburger.toggleClass("active")
    });

    var numOfColumns = 17;
    var numOfRows = 6;
    gameBoard = createGrid($('#snake-game'), numOfColumns, numOfRows)
    boardMaxX = gameBoard.length
    boardMaxY = gameBoard[0].length
    playGame()
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const colorNames = {
    'rgb(0, 0, 0)': 'BLACK',
    'rgb(255, 255, 255)': 'WHITE',
    'rgb(255, 0, 0)': 'RED'
}

const MoveStatus = {
    GOOD: 'GOOD',
    HITS_SELF: 'HITS_SELF',
    OUT_OF_BOUNDS: 'OUT_OF_BOUNDS'
}

class BoxNode {
    constructor(ele, x, y) {
        this.ele = ele
        this.next = null
        this.x = x
        this.y = y
    }
    setBlack() {
        this.ele.css('background-color', 'black')
    }
    setRed() {
        this.ele.css('background-color', 'red')
    }
    setWhite() {
        this.ele.css('background-color', 'white')
    }
    getColor() {
        return colorNames[this.ele.css('background-color')]
    }
}

class Snake {
    head = null
    constructor(x, y) {
        this.setCurrent(x, y)
    }
    setCurrent(row, col) {
        this.head = new BoxNode(gameBoard[row][col], row, col)
        this.head.setWhite()

        this.head.next = new BoxNode(gameBoard[row - 1][col], row - 1, col)
        this.head.next.setWhite()
    }
    checkSafeMove(x, y) {
        if (x < 0 || x >= boardMaxX)
            return MoveStatus.OUT_OF_BOUNDS
        if (y < 0 || y >= boardMaxY)
            return MoveStatus.OUT_OF_BOUNDS
        var n = this.head.next
        while (n != null) {
            if (n.x == x && n.y == y)
                return MoveStatus.HITS_SELF
            n = n.next
        }
        return MoveStatus.GOOD
    }
    doNotEat() {
        var first = this.head
        var second = this.head.next
        while (second.next != null) {
            first = second
            second = second.next
        }
        second.setBlack()
        first.next = null
    }
    moveUp() {
        var moveStatus = this.checkSafeMove(this.head.x - 1, this.head.y)
        if (moveStatus != MoveStatus.GOOD)
            return moveStatus
        var temp = this.head
        this.head = new BoxNode(gameBoard[temp.x - 1][temp.y], temp.x - 1, temp.y)
        this.head.next = temp
        this.head.setWhite()
        return moveStatus
    }
    moveDown() {
        var moveStatus = this.checkSafeMove(this.head.x + 1, this.head.y)
        if (moveStatus != MoveStatus.GOOD)
            return moveStatus
        var temp = this.head
        this.head = new BoxNode(gameBoard[temp.x + 1][temp.y], temp.x + 1, temp.y)
        this.head.next = temp
        this.head.setWhite()
        return moveStatus
    }
    moveLeft() {
        var moveStatus = this.checkSafeMove(this.head.x, this.head.y - 1)
        if (moveStatus != MoveStatus.GOOD)
            return moveStatus
        var temp = this.head
        this.head = new BoxNode(gameBoard[temp.x][temp.y - 1], temp.x, temp.y - 1)
        this.head.next = temp
        this.head.setWhite()
        return moveStatus
    }
    moveRight() {
        var moveStatus = this.checkSafeMove(this.head.x, this.head.y + 1)
        if (moveStatus != MoveStatus.GOOD)
            return moveStatus
        var temp = this.head
        this.head = new BoxNode(gameBoard[temp.x][temp.y + 1], temp.x, temp.y + 1)
        this.head.next = temp
        this.head.setWhite()
        return moveStatus
    }
}

function createGrid(gameDiv, columns, rows) {
    var blockSize = '10px '

    // set column and row css values
    gameDiv.css('grid-template-columns', blockSize.repeat(columns).trim())
    gameDiv.css('grid-template-rows', blockSize.repeat(rows).trim())
    
    var rowsArr = []
    for (var i = 0; i < rows; i++) {
        var cols = []
        for (var j = 0; j < columns; j++) {
            var box = $('<div></div>')
            //new BoxNode(box, i, j)
            cols.push(box)
            gameDiv.append(box)
        }
        rowsArr.push(cols)
    }
    return rowsArr
}

function setBoxColor(row, column, color) {
    gameBoard[row][column].css('background-color', color)
}

function getColor(row, column) {
    var color = gameBoard[row][column].css('background-color')
    return colorNames[color]
}

function resetBoard() {
    for (var i = 0; i < gameBoard.length; i++)
        for (var j = 0; j < gameBoard[i].length; j++)
            gameBoard[i][j].reset()
}

async function playGame() {
    // board size 6 by 17
    var snake = new Snake(2, 4)
    
}