/* The following code was taken from here: https://stackoverflow.com/a/49510926 */

function SRUI_getPixelsPerEm() {
    let low = 0;
    let high = 200;
    let emWidth = Math.round((high - low) / 2) + low;
    const time = performance.now();
    let iters = 0;
    const maxIters = 10;
    while (high - low > 1) {
        const match = window.matchMedia(`(min-width: ${emWidth}em)`).matches;
        iters += 1;
        if (match) {
            low = emWidth;
        } else {
            high = emWidth;
        }
        emWidth = Math.round((high - low) / 2) + low;
        if (iters > maxIters) {
            console.warn(`max iterations reached ${iters}`);
            break;
        }
    }
    const singleEmPx = Math.ceil(window.innerWidth / emWidth);
    console.log(`window em width = ${emWidth}, time elapsed = ${(performance.now() - time)}ms`);
    return singleEmPx;
}

CSS_PSEUDO = (className, pseudoClass, str) => {
    let text = `.${className}:${pseudoClass} {${str}}`
    let style = document.createElement('style')
    style.textContent = text
    document.head.appendChild(style)
}

/* From old project */

component.SRUI_setAttributes = (attributes) => {
    Object.entries(attributes).forEach(([key, value]) => {
        component.setAttribute(key, value)
    })
    return component
}

component.SRUI_remove = () => {
    /* Remove it from the DOM */
    component.remove()
    /* Remove it from the parent element's list of children */
    let arr = component.SRUI_parent.SRUI_children
    let index = arr.indexOf(component)
    arr.splice(index, 1)
    /* Remove it and all its named descendants from all ancestral undernode lists */
    component.SRUI_forEachProperAncestor((ancestor) => {
        component.SRUI_forEachUndernode((undernode) => {
            let properUndernodes = ancestor.SRUI_properUndernodes[undernode.SRUI_name]
            let index = properUndernodes.indexOf(undernode)
            properUndernodes.splice(index, 1)
        })
    })
}

component.SRUI_setVariable = (key, value) => {
    component.SRUI_variables[key] = value
    return component
}

component.SRUI_variables = {} // This line create spaces for arbitrary data that the user of library may want to store