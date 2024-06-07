{
    const text = 'Live inline code execution.'
    const testText = document.createElement('span')
    testText.textContent = '0'
    document.currentScript.insertAdjacentElement('afterend', testText)
    const style = window.getComputedStyle(testText)
    const canvas = document.createElement('canvas')
    document.currentScript.insertAdjacentElement('afterend', canvas)
    canvas.style.verticalAlign = 'middle'
    const boundingBox = testText.getBoundingClientRect()
    boundingBox.width *= text.length
    const ratio = window.devicePixelRatio
    canvas.width = boundingBox.width * ratio
    canvas.height = boundingBox.height * ratio
    canvas.style.width = boundingBox.width + 'px'
    canvas.style.height = boundingBox.height + 'px'
    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.font = style.font
    ctx.fillStyle = '#0f0'
    testText.remove()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        text.split('').forEach((char, index) => {
            ctx.shadowBlur = (boundingBox.height / 2) * (charColors[index] / 255)
            ctx.shadowColor = ctx.fillStyle = `rgb(0,${charColors[index]},0)`
            ctx.fillText(char, index * (boundingBox.width / text.length), boundingBox.height / 2)
        })
    }
    const charColors = new Array(text.length).fill(255)
    const charsFlickering = new Array(text.length).fill(false)
    function update() {
        const index = Math.floor(Math.random() * text.length)
        if (Math.random() < .25 && !charsFlickering[index]) {
            charsFlickering[index] = true
            const flickerTime = Math.random() * 150 + 100
            const flickerCount = Math.ceil(Math.random() * 5)
            for (let flickerIndex = 0; flickerIndex < flickerCount; flickerIndex++)
                setTimeout(() => {
                    charColors[index] = 255
                    render()
                    setTimeout(() => {
                        charColors[index] = 0
                        render()
                    }, Math.random() * flickerTime)
                }, flickerIndex * flickerTime)
            setTimeout(() => {
                const handle = setInterval(() => {
                    charColors[index] += 5
                    render()
                    if (charColors[index] >= 255) {
                        clearInterval(handle)
                        charsFlickering[index] = false
                    }
                }, 1000 / 30)
            }, flickerCount * flickerTime + Math.random() * 1000 + 500)
        }
    }
    setInterval(update, 1000 / 10)
}