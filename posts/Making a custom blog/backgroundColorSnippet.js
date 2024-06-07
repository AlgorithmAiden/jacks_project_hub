{
    const span = document.createElement('span')
    span.textContent = 'It can do that.'
    span.style.cursor = 'pointer'
    span.style.color = '#0f0'
    span.style.transition = 'color .25s ease-in-out'
    span.onmouseover = () => span.style.color = '#fff'
    span.onmouseout = () => span.style.color = '#0f0'
    const post = document.getElementById('post')
    const originalColor = post.style.backgroundColor
    let canClick = true
    let handle
    span.onclick = () => {
        if (canClick) {
            canClick = false
            post.style.transition = 'all .5s ease-in-out'
            post.style.backgroundColor = '#0000'
            handle = setTimeout(() => {
                post.style.backgroundColor = originalColor
                canClick = true
            }, 10000)
        }
        else {
            clearTimeout(handle)
            post.style.backgroundColor = originalColor
            canClick = true
        }
    }
    document.currentScript.insertAdjacentElement('afterend', span)
}