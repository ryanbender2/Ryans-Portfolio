var gameBoard = null;
var boardMaxX = NaN
var boardMaxY = NaN

var mobileNavAnimating = false

$(document).ready(() => {
    setDesktopHeaderLookandFeel()
    setMobileHeader()

    // if ($('header').css('display') != 'none')
    //     fadeInPageDesktop()

    var numOfColumns = 17;
    var numOfRows = 6;
    gameBoard = createGrid($('#snake-game'), numOfColumns, numOfRows)
    boardMaxX = gameBoard.length
    boardMaxY = gameBoard[0].length
    // playGame()
})

async function setMobileHeader() {
    const hamburger = $("#hamburger-menu")
    hamburger.on("click", () => {
        if (mobileNavAnimating)
            return false
        mobileNavAnimating = true
        $(hamburger).toggleClass('hamburger-opened')
        if ($(hamburger).hasClass('hamburger-opened'))
            mobileNavToggleOn()
        else
            mobileNavToggleOff()
    });
}

async function mobileNavToggleOn() {
    $('.mobile-nav').css('display', 'block')
    $('.mobile-nav').animate({
        opacity: '1'
    }, 350, 'linear')

    await sleep(150)
    for (var i = 1; i < 4; i++) {
        $(`.mobile-nav ul li:nth-child(${i})`).toggle('slow', 'swing')
        await sleep(70)
    }

    await sleep(200)
    mobileNavAnimating = false
}

async function mobileNavToggleOff() {
    for (var i = 3; i > 0; i--) {
        $(`.mobile-nav ul li:nth-child(${i})`).toggle('slow', 'swing')
        await sleep(70)
    }
    
    while ($('.mobile-nav ul li:nth-child(1)').css('display') != 'none')
        await sleep(10)

    $('.mobile-nav').animate({
        opacity: '0'
    }, 200, 'linear', () => $('.mobile-nav').css('display', 'none'))
    
    await sleep(200)
    mobileNavAnimating = false
}

async function fadeInPageDesktop() {
    $('header').css('opacity', '0')
    $('.header-wrapper').css('opacity', '0')
    $('.footer-column').css('opacity', '0')
    $('#base-content-wrapper').css('opacity', '0')

    //:nth-last-of-type(2)
    $('.header-wrapper').fadeTo(1000, 1)
    $('header').fadeTo(2000, 1)
    await sleep(1000)
    $('#base-content-wrapper').fadeTo(3000, 1)
    await sleep(500)
    $('.footer-column:nth-last-of-type(2)').fadeTo(3000, 1)
    await sleep(500)
    $('.footer-column:nth-last-of-type(1)').fadeTo(1000, 1)
    $('.footer-column:nth-last-of-type(3)').fadeTo(2000, 1)
}

/**
 * Set the functionality for the desktop header.
 * 
 * 1. scroll behavior
 * 2. background blur behavior
 */
function setDesktopHeaderLookandFeel() {
    var headerBackground0 = $('.header-background0')
    var headerBackground1 = $('.header-background1')
    var alreadyLeft = false
    
    $(window).scroll(function() {
        if ($(this).scrollTop() == 0) {
            // returned to top of page
            alreadyLeft = false
    
            headerBackground1.css('opacity', '0')
            headerBackground0.css('opacity', '1')
        } else if ($(this).scrollTop() != 0 && !alreadyLeft) {
            // left top of page
            alreadyLeft = true
    
            headerBackground1.css('opacity', '1')
            headerBackground0.css('opacity', '0')
        }
    })
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
            cols.push(new Tile(box, i, j))
            gameDiv.append(box)
        }
        rowsArr.push(cols)
    }
    return rowsArr
}

class Snake {
    head = null
    constructor(x, y) {
        this.setCurrent(x, y)
    }
    setCurrent(row, col) {
        this.head = new BoxNode(gameBoard[row][col])
        this.head.tile.setWhite()
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
    checkUp() {
        return this.checkSafeMove(this.head.x - 1, this.head.y)
    }
    checkDown() {
        return this.checkSafeMove(this.head.x + 1, this.head.y)
    }
    checkLeft() {
        return this.checkSafeMove(this.head.x, this.head.y - 1)
    }
    checkRight() {
        return this.checkSafeMove(this.head.x, this.head.y + 1)
    }
    removeTail() {
        var first = this.head
        var second = this.head.next
        while (second.next != null) {
            first = second
            second = second.next
        }
        second.tile.setBlack()
        first.next = null
    }
    advance(direction) {
        var newX, newY;
        switch (direction) {
            case 'U':
                newX = this.head.x - 1
                newY = this.head.y
                break;
            case 'D':
                newX = this.head.x + 1
                newY = this.head.y
                break;
            case 'L':
                newX = this.head.x
                newY = this.head.y - 1
                break;
            case 'R':
                newX = this.head.x
                newY = this.head.y + 1
                break;
            default:
                break;
        }
        var temp = this.head
        this.head = new BoxNode(gameBoard[newX][newY])
        this.head.next = temp
        this.head.tile.setWhite()
    }
    advanceUp() {
        this.advance('U')
    }
    advanceDown() {
        this.advance('D')
    }
    advanceLeft() {
        this.advance('L')
    }
    advanceRight() {
        this.advance('R')
    }

    /**
     * Change the color of the entire snake.
     * @param {string} color color to change snake to
     */
    changeSnakeColor(color) {
        var n = this.head
        while (n != null) {
            n.tile.setColor(colorCodes[color])
            n = n.next
        }
    }
}

function resetBoard() {
    for (var i = 0; i < gameBoard.length; i++)
        for (var j = 0; j < gameBoard[i].length; j++)
            gameBoard[i][j].setBlack()
}

async function playGame() {
    await sleep(4000)
    // board size 6 by 17
    // you need to check if the move you do is safe
    // before you actually do the move
    await GameUtils.boardWipe(gameBoard, 100, 6)
    var snake = new Snake(2, 4)
    var moves = [0, 1, 2, 3]
    while (true) {
        while (true) {
            var tempMvs = [...moves]
            var moveDir = GameUtils.rngChoice(tempMvs)
            var nextMoveGood = checkMove(snake, moveDir)
            while (nextMoveGood != MoveStatus.GOOD) {
                if (tempMvs.length < 1)
                    break
                tempMvs.splice(tempMvs.indexOf(moveDir), 1)
                moveDir = GameUtils.rngChoice(tempMvs)
                nextMoveGood = checkMove(snake, moveDir)
            }
            if (tempMvs.length < 1)
                break
            doMove(snake, moveDir)

            var r = GameUtils.rng(7)
            if (r != 0)
                snake.removeTail()

            await sleep(900)
        }

        await sleep(1500)
        for (var i = 0; i < 2; i++) {
            snake.changeSnakeColor(color.RED)
            await sleep(500)
            snake.changeSnakeColor(color.WHITE)
            await sleep(500)
        }
        await GameUtils.boardWipe(gameBoard, 100, 8)
        snake = new Snake(GameUtils.rng(gameBoard.length), GameUtils.rng(gameBoard[0].length))
    }
}

/**
 * 
 * @param {Snake} snake 
 * @param {number} dir 
 */
function doMove(snake, dir) {
    switch (dir) {
        case 0:
            snake.advanceUp()
            break;
        case 1:
            snake.advanceDown()
            break;
        case 2:
            snake.advanceLeft()
            break;
        case 3:
            snake.advanceRight()
            break;
        default:
            break;
    }
}

/**
 * 
 * @param {Snake} snake 
 * @param {number} dir 
 * @returns 
 */
function checkMove(snake, dir) {
    switch (dir) {
        case 0:
            return snake.checkUp()
        case 1:
            return snake.checkDown()
        case 2:
            return snake.checkLeft()
        case 3:
            return snake.checkRight()
        default:
            return ''
    }
}