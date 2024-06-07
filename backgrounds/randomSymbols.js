const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

const chars = '`~!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'.split('')

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let grid = [[]]

function fillGrid(canvas,ctx) {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight

    grid = [...grid, ...new Array(Math.ceil(width / fontSize)).fill(0).map(() => [])].splice(0, Math.ceil(width / fontSize) + 1).map(colum => [...colum, ...new Array(Math.ceil(height / fontSize)).fill(0).map(() => Math.floor(Math.random() * 255))].splice(0, Math.ceil(height / fontSize) + 1))

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    for (let x = 0; x < width / fontSize; x++)
        for (let y = 0; y < height / fontSize; y++) {
            ctx.fillStyle = `rgb(0,${grid[x][y]},0)`
            ctx.fillText(chars[grid[x][y] % chars.length], x * fontSize, y * fontSize)
        }
}

export function update(canvas,ctx) {
    if (lastWidth != window.innerWidth || lastHeight != innerHeight)
        fillGrid(canvas,ctx)
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight

    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    for (let i = 0; i < Math.random() * 25; i++) {
        const x = Math.floor(Math.random() * grid.length)
        const y = Math.floor(Math.random() * grid[0].length)
        grid[x][y] = Math.floor(Math.random() * 255)
        ctx.fillStyle = '#000'
        ctx.fillRect(x * fontSize, y * fontSize, fontSize, fontSize)
        ctx.fillStyle = `rgb(0,${grid[x][y]},0)`
        ctx.fillText(chars[grid[x][y] % chars.length], x * fontSize, y * fontSize)
    }
}

export function start(canvas,ctx) {
    fillGrid(canvas,ctx)
}

export function stop() {
    grid = [[]]
}