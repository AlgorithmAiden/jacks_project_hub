const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let grid = [[]]

function fillGrid(canvas, ctx) {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight

    grid = [...grid, ...new Array(Math.ceil(width / fontSize)).fill(0).map(() => [])].splice(0, Math.ceil(width / fontSize) + 1).map(colum => [...colum, ...new Array(Math.ceil(height / fontSize)).fill(0)].splice(0, Math.ceil(height / fontSize) + 1))

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    for (let x = 0; x < width / fontSize; x++)
        for (let y = 0; y < height / fontSize; y++) {
            ctx.fillStyle = 'rgb(0,50,0)'
            ctx.fillText('0', x * fontSize, y * fontSize)
        }
}

let fireworks = []
let lastFirework = 0

export function update(canvas, ctx) {
    if (lastWidth != window.innerWidth || lastHeight != innerHeight)
        fillGrid(canvas, ctx)
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight

    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    if (Date.now() - lastFirework >= 1000) {
        lastFirework = Date.now()
        fireworks.push({
            x: Math.floor(Math.random() * grid.length),
            y: Math.floor(Math.random() * grid[0].length),
            counter: 0,
            radius: 1,
            maxRadius: Math.ceil(Math.random() * 15 + 10),
            speed: Math.ceil(Math.random() * 10)
        })
    }

    fireworks.forEach((firework, index) => {
        for (let x = Math.max(firework.x - firework.radius, 0); x < Math.min(firework.x + firework.radius, grid.length); x++)
            for (let y = Math.max(firework.y - firework.radius, 0); y < Math.min(firework.y + firework.radius, grid[0].length); y++) {
                const distance = Math.abs(x - firework.x) + Math.abs(y - firework.y) + 1
                if (distance <= firework.radius) {
                    ctx.fillStyle = '#000'
                    ctx.fillRect(x * fontSize, y * fontSize, fontSize, fontSize)
                    ctx.fillStyle = `rgb(0,${255 - firework.radius * (205 / firework.maxRadius)},0)`
                    ctx.fillText(distance < firework.radius ? '0' : '1', x * fontSize, y * fontSize)
                }
            }
        if (firework.radius == firework.maxRadius) {
            for (let x = Math.max(firework.x - firework.radius, 0); x < Math.min(firework.x + firework.radius, grid.length); x++)
                for (let y = Math.max(firework.y - firework.radius, 0); y < Math.min(firework.y + firework.radius, grid[0].length); y++)
                    if (Math.abs(x - firework.x) + Math.abs(y - firework.y) <= firework.radius) {
                        ctx.fillStyle = '#000'
                        ctx.fillRect(x * fontSize, y * fontSize, fontSize, fontSize)
                        ctx.fillStyle = 'rgb(0,50,0)'
                        ctx.fillText('0', x * fontSize, y * fontSize)
                    }
            fireworks.splice(index, 1)
        } else if ((firework.counter = (firework.counter + 1) % firework.speed) == 0) firework.radius++
    })

}
export function start(canvas, ctx) {
    grid = [[]]
    fillGrid(canvas, ctx)
}