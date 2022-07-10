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