{
    const testText = document.createElement('span')
    testText.textContent = '0'
    document.currentScript.insertAdjacentElement('afterend', testText)
    const style = window.getComputedStyle(testText)
    const canvas = document.createElement('canvas')
    document.currentScript.insertAdjacentElement('afterend', canvas)
    canvas.style.verticalAlign = 'middle'
    const boundingBox = testText.getBoundingClientRect()
    boundingBox.width *= 3
    const ratio = window.devicePixelRatio
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
    ctx.fillStyle = '#fff'
    let numberOfPoints = 1
    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        numberOfPoints = (numberOfPoints) % 3 + 1
        for (let index = 0; index < numberOfPoints; index++)
            ctx.fillText('.', index * boundingBox.width / 5, boundingBox.height / 2)
    }
    update()
    setInterval(update,1000)
}