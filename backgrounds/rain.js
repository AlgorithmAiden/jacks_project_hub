const fontSize = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i).test(navigator.userAgent || navigator.vendor || window.opera) ? 50 : 25

let [width, height] = [0, 0]

let [lastWidth, lastHeight] = [0, 0]

let columns = []
let offsets = []

let words

let needWords = false

fetch('./mem.json')
    .then(response => response.json())
    .then(data => {
        const specialChars = '`~!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/1234567890'.split('')
        words = data.uniqueLines.join(' ')
        while (specialChars.some(char => words.includes(char)))
            specialChars.forEach(char =>
                words = words.split(char).join(' ')
            )
        words = words.split(' ').filter(word => word != '')

        if (needWords) {
            for (let i = 0; i < height * 2; i += fontSize)
                columns.forEach((colum, index) => drip(colum, index))
            needWords = false
        }
    })
    .catch(error => {
        console.error('Error fetching mem for stats:', error)
    })


function fillColumns() {
    columns = [...columns, ...new Array(Math.ceil(width / fontSize)).fill(0).map(() => [])].splice(0, Math.ceil(width / fontSize))
    offsets = [...offsets, ...new Array(Math.ceil(width / fontSize)).fill(0)].splice(0, Math.ceil(width / fontSize))
}

function drip(colum, index) {
    if (Math.random() < .1) {
        if (offsets[index] == 0) {
            const word = (words[Math.floor(Math.random() * words.length)] + '   ').split('')
            offsets[index] = word.length
            const color = `rgb(0,${Math.round(Math.random() * 205) + 50},0)`
            word.forEach((char, index) => colum.unshift([word[word.length - index - 1], color]))
        } else
            offsets[index]--
    } else if (offsets[index] > 0) offsets[index]--
    else colum.unshift([''])
    colum = colum.splice(Math.ceil(height / fontSize) + offsets[index])
}

export function update(canvas, ctx) {
    if (words == undefined) return

    if (lastWidth != window.innerWidth || lastHeight != innerHeight) {
        width = canvas.width = window.innerWidth
        height = canvas.height = window.innerHeight
        fillColumns()
    }
    lastWidth = window.innerWidth
    lastHeight = window.innerHeight

    ctx.font = `${fontSize}px 'Fira Code'`
    ctx.textBaseline = 'top'

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    columns.forEach((colum, x) => {
        colum.forEach((item, y) => {
            ctx.fillStyle = item[1]
            ctx.fillText(item[0], x * fontSize, (y - offsets[x]) * fontSize)
        })
    })

    columns.forEach((colum, index) => {
        if (Math.random() < .1) drip(colum, index)
    })
}

export function start(canvas) {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
    columns = []
    offsets = []
    fillColumns()
    if (words == undefined)
        needWords = true
    else
        for (let i = 0; i < height * 2; i += fontSize)
            columns.forEach((colum, index) => drip(colum, index))
}