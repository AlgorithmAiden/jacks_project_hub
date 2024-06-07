const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let orderedLines, lastFile, currentFile, fontWidth, lineToWrite, charsToWait
let writtenLines = []
let currentLine = ''
let lineNumber = 0
let hasWrittenFileName = false
let biggestLineCount = 0

function stringToNumberHash(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const maxInt32 = Math.pow(2, 31) - 1
    return (hash & maxInt32) / maxInt32
}

function wrapInComment(fileName) {
    const map = {
        js: ['/**', '*/'],
        css: ['/*', '*/'],
        html: ['<!--', '-->'],
        txt: ['---', '---']
    }
    return `${map[fileName.split('.')[1]][0]} ${fileName} ${map[fileName.split('.')[1]][1]}`
}

fetch('../../mem.json')
    .then(response => response.json())
    .then(data => {
        orderedLines = data.orderedLines
        currentFile = Object.keys(orderedLines)[Math.floor(Math.random() * Object.keys(orderedLines).length)]
        hasWrittenFileName = false
        lineToWrite = wrapInComment(currentFile)
        Object.keys(orderedLines).forEach(file => biggestLineCount = Math.max(biggestLineCount, orderedLines[file].length))
    })
    .catch(error => {
        console.error('Error fetching mem for stats:', error)
    })

function typeChar(ctx, canvas, skip) {
    const lineOffset = String(biggestLineCount).length * fontWidth
    if (skip || currentLine == lineToWrite || (currentLine.length * fontWidth >= width && Math.random() < .25)) {
        if (!skip) {
            if (hasWrittenFileName) {
                currentLine = '|' + currentLine
                writtenLines.unshift([lineNumber + 1, currentLine])
            } else
                writtenLines.unshift([0, currentLine])
            writtenLines.splice(Math.ceil(height / fontSize))
            currentLine = ''
            if (hasWrittenFileName) lineNumber++
            else hasWrittenFileName = true
            if (lineNumber == orderedLines[currentFile].length) {
                charsToWait = 3 * 10 + 1
                lineNumber = 0
                lastFile = currentFile
                while (lastFile == currentFile)
                    currentFile = Object.keys(orderedLines)[Math.floor(Math.random() * Object.keys(orderedLines).length)]
                hasWrittenFileName = false
                lineToWrite = wrapInComment(currentFile)
            } else
                lineToWrite = orderedLines[currentFile][lineNumber]
        }
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        writtenLines.forEach((line, y) => {
            const textY = (Math.floor(height / fontSize - 1) - y - 1) * fontSize
            ctx.fillStyle = `rgb(0,${stringToNumberHash(line[1]) * 205 + 50},0)`
            if (line[0] - 1 > -1)
                ctx.fillText(line[0], (lineOffset - String(line[0]).length * fontWidth) / 2, textY)
            line[1].split('').forEach((char, x) => {
                ctx.fillText(char, (lineOffset * (line[0] - 1 > -1)) + x * fontWidth, textY)
            })
        })
        if (hasWrittenFileName) {
            ctx.fillStyle = `rgb(0,${stringToNumberHash('|' + lineToWrite) * 205 + 50},0)`
            ctx.fillText(lineNumber + 1, (lineOffset - String(lineNumber + 1).length * fontWidth) / 2, Math.floor(height / fontSize - 1) * fontSize)
            ctx.fillText('|', lineOffset, Math.floor(height / fontSize - 1) * fontSize)
        }
    } else {
        currentLine += lineToWrite.charAt(currentLine.length)
        if (currentLine.charAt(currentLine.length - 1) == ' ') typeChar(ctx, canvas)
        ctx.fillStyle = `rgb(0,${stringToNumberHash('|' + lineToWrite) * 205 + 50},0)`
        if (hasWrittenFileName)
            ctx.fillText(currentLine.charAt(currentLine.length - 1), lineOffset + (currentLine.length) * fontWidth, Math.floor(height / fontSize - 1) * fontSize)
        else
            ctx.fillText(currentLine.charAt(currentLine.length - 1), (currentLine.length - 1) * fontWidth, Math.floor(height / fontSize - 1) * fontSize)

    }

}

const charsPerSec = { min: 5, max: 50 }
let currentSpeed = (charsPerSec.min + charsPerSec.max) / 2
let lastTypeTime = 0

export function update(canvas, ctx) {
    if (orderedLines != undefined) {
        if (lastWidth != window.innerWidth || lastHeight != innerHeight) {
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }
        lastWidth = window.innerWidth
        lastHeight = window.innerHeight

        ctx.font = `${fontSize}px 'Fira Code'`
        ctx.textBaseline = 'top'

        if (lastTypeTime === 0)
            for (let i = 0; i < 1500; i++) typeChar(ctx, canvas)

        if (Date.now() - lastTypeTime >= 1000 / currentSpeed) {
            lastTypeTime = Date.now()
            if (Math.random() < .25) currentSpeed = Math.min(charsPerSec.max, Math.max(charsPerSec.min, currentSpeed + (Math.random() * 2 - 1) * (charsPerSec.max - charsPerSec.min) / 4))
            if (charsToWait > 0) {
                charsToWait--
                if (charsToWait % 10 == 0) {
                    writtenLines.unshift(['', ''])
                    typeChar(ctx, canvas, true)
                }
            }
            else typeChar(ctx, canvas)
        }
    }
}

export function start(canvas, ctx) {
    ctx.font = `${fontSize}px 'Fira Code'`
    fontWidth = ctx.measureText('0').width

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (orderedLines != undefined) {
        lineNumber = 0
        hasWrittenFileName = false
        lineToWrite = wrapInComment(currentFile)
        currentLine = ''
        writtenLines = []
    }
}

//includeInHomeBackgrounds