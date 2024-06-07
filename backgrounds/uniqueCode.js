const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let uniqueLines, lineColors, fontWidth, numberOfUniqueLines

function stringToNumberHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const maxInt32 = Math.pow(2, 31) - 1
    return (hash & maxInt32) / maxInt32
}


fetch('./mem.json')
    .then(response => response.json())
    .then(data => {
        uniqueLines = data.uniqueLines
        lineColors = data.uniqueLines.reduce((acc, line) => ({ ...acc, [line]: stringToNumberHash(line) * 205 + 50 }), {})
        numberOfUniqueLines = data.uniqueLines.length
    })
    .catch(error => {
        console.error('Error fetching mem for stats:', error)
    })

const linesPerSec = fontSize == 50 ? 5 : 10

export function update(canvas, ctx) {
    if (uniqueLines != undefined) {
        if (lastWidth != window.innerWidth || lastHeight != innerHeight) {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }
        lastWidth = window.innerWidth
        lastHeight = window.innerHeight

        ctx.font = `${fontSize}px 'Fira Code'`
        ctx.textBaseline = 'top'

        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const lineOffset = String(numberOfUniqueLines).length * fontWidth
        const offset = Date.now() / (1000 / linesPerSec)
        const lineLength = Math.ceil((width - lineOffset) / fontWidth)
        for (let y = -1; y < height / fontSize + 1; y++) {
            const lineNumber = numberOfUniqueLines - (Math.floor(offset) - y + numberOfUniqueLines) % numberOfUniqueLines
            const line = uniqueLines[lineNumber - 1]
            const textY = (y + offset % 1) * fontSize
            ctx.fillStyle = `rgb(0,${lineColors[line]},0)`
            ctx.fillText(lineNumber, (lineOffset - String(lineNumber).length * fontWidth) / 2, textY)
            ctx.fillText(('|' + line).slice(0, lineLength), lineOffset, textY)
        }
    }
}

export function start(canvas, ctx) {
    ctx.font = `${fontSize}px 'Fira Code'`
    fontWidth = ctx.measureText('0').width
}