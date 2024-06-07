const backgroundPaths = ["./posts/Making a custom blog/background.js","./backgrounds/fireworks.js","./backgrounds/hiddenSnakes.js","./backgrounds/pong.js","./backgrounds/rain.js","./backgrounds/randomSymbols.js","./backgrounds/uniqueCode.js"];
document.addEventListener('DOMContentLoaded', async () => {
    function mixPaths() {
        const lastPath = backgroundPaths[backgroundPaths.length - 1]
        do backgroundPaths.sort(() => Math.random() * 2 - 1)
        while (backgroundPaths.length > 1 && backgroundPaths[0] == lastPath)
    }
    mixPaths()

    let backgroundIndex = -1

    const minTimePerBackground = 1000 * 30
    const blurTime = 1000 * 1
    let backgroundStarted = 0

    let blurred = false

    let cycle = true

    let currentBackground = {}

    let loadedBackgrounds = []

    const maxUps = 60
    let lastUpdate = 0

    async function update() {
        lastUpdate = Date.now()

        const canvas = document.getElementById('backgroundCanvas')
        const ctx = canvas.getContext('2d')

        if (cycle && minTimePerBackground - (Date.now() - backgroundStarted) <= blurTime && !blurred) {
            canvas.classList.add('blur')
            blurred = true
        }

        if (cycle && Date.now() - backgroundStarted >= minTimePerBackground) {
            if (currentBackground.stop != undefined) await currentBackground.stop(canvas, ctx)
            backgroundIndex = (backgroundIndex + 1) % backgroundPaths.length
            if (backgroundIndex == 0) mixPaths()
            if (!loadedBackgrounds.includes(backgroundPaths[backgroundIndex])) await new Promise(r => {
                const script = document.createElement('script')
                script.type = 'module'
                script.src = backgroundPaths[backgroundIndex]
                script.onload = r
                document.head.appendChild(script)
                loadedBackgrounds.push(backgroundPaths[backgroundIndex])
            })
            currentBackground = await import(backgroundPaths[backgroundIndex])
            if (currentBackground.start != undefined) await currentBackground.start(canvas, ctx)
            canvas.classList.remove('blur')
            blurred = false
            backgroundStarted = Date.now()
        }
        if (currentBackground.update != undefined) await currentBackground.update(canvas, ctx)

        //has to be set after the first update so the first background will always get loaded
        cycle = (backgroundPaths.length > 1)

        requestAnimationFrame(() => setTimeout(update, 1000 / maxUps - (Date.now() - lastUpdate)))
    }
    update()
})