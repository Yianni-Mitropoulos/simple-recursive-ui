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

/* Utiliy function for applying default margin and padding */

SRUI_pixelsPerEm = SRUI_getPixelsPerEm()
SRUI_default_padding   = SRUI_pixelsPerEm
SRUI_default_margin_tb = SRUI_pixelsPerEm/2

function SRUI_addDefaultPadding(html_element) {
    html_element.style.padding = `${SRUI_default_padding}px`
}

function SRUI_addDefaultMargin(html_element) {
    html_element.style.marginTop    = 0 // `${SRUI_default_margin_tb}px`
    html_element.style.marginBottom = 0 // `${SRUI_default_margin_tb}px`
    html_element.style.marginLeft   = 0
    html_element.style.marginRight  = 0
}

function SRUI_removePadding(html_element) {
    html_element.style.padding = 0
}

function SRUI_removeMargin(html_element) {
    html_element.style.margin = 0
}

/* Cludgy fix to address footer positioning that wouldn't be necessary if I actually understood CSS */
/* N.B. this dodgy solution has the effect of "clobbering" the finalize method on the BODY element */
/* obj["finalize"] = function() {
    let children = this.SRUI_children
    let last_node        = children[children.length - 1]
    let second_last_node = children[children.length - 2]
    if (last_node.style.position === 'fixed') {
        second_last_node.style.marginBottom = `${last_node.clientHeight + getSingleEmInPixels()}px`
    }
*/