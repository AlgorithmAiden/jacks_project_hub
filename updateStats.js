function addStat(parent, text) {
    let div = document.createElement('div')
    div.innerHTML = text
    parent.appendChild(div)
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('./mem.json')
        .then(response => response.json())
        .then(mem => {
            const div = document.getElementById('stats')
            addStat(div, `Last updated: <code>${Math.floor((Date.now() - mem.lastUpdate) / 86400000)}</code> days ago`)
            addStat(div, `Created out of <code>${mem.numberOfLines}</code> lines of code`)
            addStat(div, `Current hash: <code>${mem.outputHash}</code>`)
        })
        .catch(error => {
            console.error('Error fetching mem for stats:', error)
        })
})