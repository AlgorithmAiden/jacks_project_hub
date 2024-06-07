const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let grid = [[]]

let snakes = []

function fillGrid(canvas, ctx) {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight

    grid = [...grid, ...new Array(Math.ceil(width / fontSize)).fill(0).map(() => [])].splice(0, Math.ceil(width / fontSize) + 1).map(colum => [...colum, ...new Array(Math.ceil(height / fontSize)).fill(50)].splice(0, Math.ceil(height / fontSize) + 1))

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    for (let x = 0; x < width / fontSize; x++)
        for (let y = 0; y < height / fontSize; y++) {
            ctx.fillStyle = `rgb(0,${grid[x][y]},0)`
            ctx.fillText('0', x * fontSize, y * fontSize)
        }
}

export function update(canvas, ctx) {
    if (lastWidth != window.innerWidth || lastHeight != innerHeight)
        fillGrid(canvas, ctx)
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight

    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    let snake = snakes[Math.floor(Math.random() * snakes.length)]
    let tailX = snake[snake.length - 1].x
    let tailY = snake[snake.length - 1].y
    grid[tailX][tailY] -= 25
    ctx.fillStyle = '#000'
    ctx.fillRect(tailX * fontSize, tailY * fontSize, fontSize, fontSize)
    ctx.fillStyle = `rgb(0,${grid[tailX][tailY]},0)`
    ctx.fillText('0', tailX * fontSize, tailY * fontSize)
    for (let index = snake.length - 1; index > 0; index--) {
        snake[index] = { ...snake[index - 1] }
    }
    let headX = snake[0].x
    let headY = snake[0].y
    let hasMoved = false
    let trys = 0
    while (!hasMoved) {
        trys++
        switch (Math.floor(Math.random() * 4)) {
            case 0:
                if (headX > 0 && (snake[2].x != headX - 1 || trys > 50)) {
                    snake[0].x--
                    hasMoved = true
                }
                break
            case 1:
                if (headY > 0 && (snake[2].y != headY - 1 || trys > 50)) {
                    snake[0].y--
                    hasMoved = true
                }
                break
            case 2:
                if (headX + 1 < grid.length && (snake[2].x != headX + 1 || trys > 50)) {
                    snake[0].x++
                    hasMoved = true
                }
                break
            case 3:
                if (headY + 1 < grid[0].length && (snake[2].y != headY + 1 || trys > 50)) {
                    snake[0].y++
                    hasMoved = true
                }
                break
        }
    }
    grid[snake[0].x][snake[0].y] += 50
    ctx.fillStyle = '#000'
    ctx.fillRect(headX * fontSize, headY * fontSize, fontSize, fontSize)
    ctx.fillStyle = `rgb(0,${grid[headX][headY]},0)`
    ctx.fillText('1', headX * fontSize, headY * fontSize)
}

export function start(canvas, ctx) {
    grid = [[]]
    fillGrid(canvas, ctx)

    snakes = new Array(3).fill(0).map(() => new Array(25).fill(0).map(() => ({ x: Math.floor(Math.random() * grid.length), y: Math.floor(Math.random() * grid[0].length) })))
}