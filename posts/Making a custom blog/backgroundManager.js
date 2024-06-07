document.addEventListener('DOMContentLoaded', async () => {
    const background = await import('./background.js')
    const canvas = document.getElementById('backgroundCanvas')
    const ctx = canvas.getContext('2d')
    if (background.start != undefined) await background.start(canvas, ctx)

    const maxUps = 60
    let lastUpdate = 0

    async function update() {
        lastUpdate = Date.now()
        const canvas = document.getElementById('backgroundCanvas')
        if (background.update != undefined) {
            await background.update(canvas, ctx)
            requestAnimationFrame(() => setTimeout(update, 1000 / maxUps - (Date.now() - lastUpdate)))
        }
    }
    update()
})