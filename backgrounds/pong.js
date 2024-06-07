const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let balls = new Array(fontSize == 50 ? 2 : 5).fill(0)
let paddles = [0, 0]

let paddleSize

function resetCanvas(canvas, ctx) {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    ctx.fillStyle = 'rgb(0,50,0)'
    for (let x = 0; x < width / fontSize; x++)
        for (let y = 0; y < height / fontSize; y++)
            ctx.fillText('0', x * fontSize, y * fontSize)
}

const dirs = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]

export function update(canvas, ctx) {
    if (lastWidth != window.innerWidth || lastHeight != innerHeight)
        resetCanvas(canvas, ctx)
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight

    for (let x of [0, Math.floor(width / fontSize - 1)]) {
        ctx.fillStyle = '#000'
        ctx.fillRect(x * fontSize, 0, fontSize, height)
        ctx.fillStyle = 'rgb(0,50,0)'
        for (let y = 0; y < height / fontSize; y++)
            ctx.fillText('0', x * fontSize, y * fontSize)
    }
    balls.forEach(ball =>
        dirs.forEach(dir => {
            ctx.fillStyle = '#000'
            ctx.fillRect((ball.lx + dir.x) * fontSize, (ball.ly + dir.y) * fontSize, fontSize, fontSize)

            ctx.fillStyle = 'rgb(0,50,0)'
            ctx.fillText('0', (ball.lx + dir.x) * fontSize, (ball.ly + dir.y) * fontSize)
        })
    )
    ctx.fillStyle = 'rgb(0,255,0)'
    balls.forEach(ball =>
        dirs.forEach(dir => {
            ctx.fillStyle = '#000'
            ctx.fillRect((ball.x + dir.x) * fontSize, (ball.y + dir.y) * fontSize, fontSize, fontSize)

            ctx.fillStyle = 'rgb(0,255,0)'
            ctx.fillText('1', (ball.x + dir.x) * fontSize, (ball.y + dir.y) * fontSize)
        })
    )

    ctx.fillStyle = 'rgb(0,255,0)'
    paddles.forEach((paddle, index) => {
        ctx.fillStyle = '#000'
        ctx.fillRect(index * Math.floor(width / fontSize - 1) * fontSize, paddle * fontSize, fontSize, paddleSize * fontSize)

        ctx.fillStyle = '#0f0'
        for (let i = 0; i < paddleSize; i++) {
            ctx.fillText('1', index * Math.floor(width / fontSize - 1) * fontSize, (paddle + i) * fontSize)
        }
    })
    balls.forEach(ball => {
        ball.lx = ball.x
        ball.ly = ball.y

        ball.x += ball.sx
        ball.y += ball.sy

        if (ball.x == 0) ball.sx = 1
        if (ball.y == 0) ball.sy = 1
        if (ball.x == Math.floor(width / fontSize) - 2) ball.sx = -1
        if (ball.y == Math.floor(height / fontSize) - 2) ball.sy = -1
    })

    balls.sort((a, b) => (a.sx * width + a.x) - (b.sx * width + b.x))
    paddles[0] -= Math.max(-3, Math.min(3, paddles[0] - (balls[0].y - (paddleSize - 1) / 2)))

    balls.unshift(balls.pop())
    paddles[1] -= Math.max(-3, Math.min(3, paddles[1] - (balls[0].y - (paddleSize - 1) / 2)))
}

export function start(canvas, ctx) {
    resetCanvas(canvas, ctx)
    for (let i = 0; i < balls.length; i++) {
        balls[i] = {}
        balls[i].sx = Math.floor(Math.random() * 2) * 2 - 1
        balls[i].sy = Math.floor(Math.random() * 2) * 2 - 1
        balls[i].x = Math.round(width / fontSize / 2) + Math.round((i - balls.length / 2 + .5) * width / fontSize / balls.length / 2)
        balls[i].y = Math.round(height / fontSize / 2) + Math.round((Math.random() * 2 - 1) * (height / fontSize / 3))
        balls[i].lx = balls[i].x
        balls[i].ly = balls[i].y
    }
    paddles.map(() => Math.round(height / fontSize / 2))
    paddleSize = Math.round(height / fontSize / 3 / 2) * 2 + 1
}