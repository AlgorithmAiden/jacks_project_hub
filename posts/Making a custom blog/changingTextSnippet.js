{
    const text = 'maybe some changing text'
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
    console.log(ratio)
    canvas.width = boundingBox.width * ratio
    canvas.height = boundingBox.height * ratio
    canvas.style.width = boundingBox.width + 'px'
    canvas.style.height = boundingBox.height + 'px'
    const ctx = canvas.getContext('2d')
    ctx.scale(ratio, ratio)
    ctx.font = style.font
    testText.remove()
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    let mixedText
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        mixedText = (mixedText === text && Math.random() > .5) ? text : text.split(' ').sort(() => Math.random() * 2 - 1).join(' ')
        ctx.fillStyle = mixedText === text ? '#0f0' : '#fff'
        ctx.fillText(mixedText, 0, boundingBox.height / 2)
    }
    setInterval(update, 1000 / 5)
}