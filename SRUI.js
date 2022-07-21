SMALL_TIME_INCREMENT = 0

/* Following function is by kigiri and Redoman. Source: https://stackoverflow.com/a/25873123 */
function generateColor() {
    return 'hsla(' + Math.floor(Math.random()*360) + ', 100%, 70%, 1)'
}

class Component {
    constructor(...args) {
        /* Get the tagName */
        if (args.length !== 0 && args[0][0] === 'tagName') {
            var tagName = args[0][1]
            args.shift()
        } else {
            var tagName = this.defaultTagName()
        }
        /* Construct a corresponding HTML element, or else use the document.body element */
        if (tagName !== 'body') {
            this.HTML_element = document.createElement(tagName)
        } else {
            this.HTML_element = document.body
            window.SRUI_bodyComponent = this // Set up a global variable for the end-user of the library
            addEventListener('resize',
                this.renderDescendants.bind(this)
            )
            setTimeout(
                () => this.renderDescendants(),
            SMALL_TIME_INCREMENT)
        }
        /* Initialize variables */
        this.children = new Set()
        this.onAppend = new Set()
        this.setInnerWidth(0, Number.POSITIVE_INFINITY)
        this.setInnerHeightMinimum(0)
        this.setAlignment(0) // Determines how it sits inside the parent element
        this.setPadding(12)
        this.setGapBetweenChildren(12)
        this.applyStyle({background: generateColor()})
        /* Execute each argument as if it were a function */
        this.SRUI_do(...args)
    }
    /* Basic methods */
    JS_do(f) {
        f.bind(this)()
    }
    SRUI_do(...args) {
        args.forEach((argument) => {
            // console.log(argument)
            if (argument === undefined) {
                throw "UndefinedValueError: You're probably missing a comma somewhere. The regex \\][\\n\\r\\s]+\\[ may help you find the problem."
            }
            else if (argument instanceof Component) {
                this.append(argument)
            } else if (typeof argument === 'string') {
                this.setInnerHTML(argument)
            } else {
                try {
                    /* If it's an instruction, execute it */
                    var opname = argument[0]
                    let remaining_params = argument.slice(1)
                    this[opname](...remaining_params)
                } catch {
                    console.log(`Problem with [${opname}, ${argument}] on ${this}`)
                }
            }
        })
    }
    JS_forEachChild(f) {
        this.onAppend.add(f)
        this.children.forEach(f)
    }
    SRUI_forEachChild(...args) {
        let f = (child) => {child.SRUI_do(...args)}
        this.onAppend.add(f)
        this.children.forEach(f)
    }
    append(child) {
        this.HTML_element.append(child.HTML_element)
        child.parent = this
        this.children.add(child)
        this.onAppend.forEach((handler) => {
            handler(child)
        })
    }

    addEventListener(eventName, handler) {
        this.HTML_element.addEventListener(eventName, handler)
    }
    /* Methods for adjusting instance variables */
    setInnerWidthMinimum(w) {
        this.innerWidthMinimum = w
    }
    setInnerWidthDesired(w) {
        this.innerWidthDesired = w
    }
    setInnerWidth(w0, w1) {
        if (w1 === undefined) {
            w1 = w0
        }
        this.innerWidthMinimum = w0
        this.innerWidthDesired = w1
    }
    setInnerHeightMinimum(h) {
        this.innerHeightMinimum = h
    }
    setAlignment(alignment) {
        this.alignment = alignment
    }
    setPadding(padding) {
        this.paddingTop    = padding
        this.paddingBottom = padding
        this.paddingLeft   = padding
        this.paddingRight  = padding
        this.HTML_element.style.padding = `${padding}px` // Mainly useful for leaf nodes
    }
    setPaddingTop(padding) {
        this.paddingTop = padding
        this.HTML_element.style.paddingTop = `${padding}px` // Mainly useful for leaf nodes
    }
    setPaddingLeft(padding) {
        this.paddingLeft = padding
        this.HTML_element.style.paddingLeft = `${padding}px` // Mainly useful for leaf nodes
    }
    setPaddingRight(padding) {
        this.paddingRight = padding
        this.HTML_element.style.paddingRight = `${padding}px` // Mainly useful for leaf nodes
    }
    setPaddingBottom(padding) {
        this.paddingBottom = padding
        this.HTML_element.style.paddingBottom = `${padding}px` // Mainly useful for leaf nodes
    }
    setGapBetweenChildren(gap) {
        this.gapBetweenChildren = gap
    }
    applyStyle(obj) {
        Object.entries(obj).forEach(([key, value]) => {
            this.HTML_element.style[key] = value
        })
        return this
    }
    toggleClass = (...classNames) => {
        classNames.forEach((className) => {
            this.HTML_element.classList.toggle(className)
        })
    }
    setInnerHTML(msg) {
        this.HTML_element.innerHTML = msg + '&nbsp;' // Prevents selections at the end of one paragraph from bleeding over into the next paragraph
    }
    /* Private methods */
    renderDescendants() {
        this.computeWidths()
        setTimeout(() => {
            this.computeEverythingElse()
        }, SMALL_TIME_INCREMENT)
    }
    computeEverythingElse() {
        this.children.forEach((child) => {
            child.computeEverythingElse()
        })
        this.render() // Provided by the component type
    }
    outerize(innerWidth) {return innerWidth + this.paddingLeft + this.paddingRight}
    innerize(outerWidth) {return outerWidth - this.paddingLeft - this.paddingRight}
    /* Compute widths */
    computeWidths() { // innerWidthActualComputation
        this.setInnerWidthDesired(this.innerize(window.innerWidth)) // this.HTML_element.clientWidth
        this.computeWidths_initialize()
        this.innerWidthActual = this.innerWidthMaximum
        this.computeWidths_widenChildrenRecursively()
    }
    computeWidths_initialize() {
        this.children.forEach((child) => child.computeWidths_initialize())
        this.innerWidthActual  = Math.max(this.innerWidthMinimum, this.widthConsumedByChildren()) // set innerWidthActual to its smallest possible value
        this.innerWidthMaximum = Math.max(this.innerWidthActual,  this.innerWidthDesired)    
    }
    computeWidths_widenChildrenRecursively() {
        // Start off by implementing the width that has already been computed for this node
        this.HTML_element.style.width = `${this.outerize(this.innerWidthActual)}px`
        // Now widen each of its children
        this.widenChildren()
        // Now call this method on each child
        this.children.forEach((child) => child.computeWidths_widenChildrenRecursively())
    }
    render() {
        let h = Math.max(this.innerHeightMinimum, this.HTML_element.offsetHeight)
        this.HTML_element.style.height = `${h}px`
    }
}

class VerticalComponent extends Component {
    widthConsumedByChildren() {
        let runningMax = 0
        this.children.forEach((child) => {
            runningMax = Math.max(runningMax, child.outerize(child.innerWidthActual))
        })
        return runningMax
    }
    widenChildren() {
        this.children.forEach((child) => {
            child.innerWidthActual = Math.max(
                child.innerWidthActual,
                Math.min(
                    child.innerize(this.innerWidthActual),
                    child.innerWidthDesired
                )
            )
        })
    }
}

class LeafComponent extends Component {
    widthConsumedByChildren() {return 0}
    widenChildren() {}
}

class HorizontalComponent extends Component {
    widthConsumedByChildren() {
        let runningSum = 0
        let flag = false
        this.children.forEach((child) => {
            runningSum += child.outerize(child.innerWidthActual)
            if (flag) {
                runningSum += this.gapBetweenChildren
            }
            flag = true
        })
        return runningSum
    }
    widenChildren() {
        let widthConsumedByChildren = this.widthConsumedByChildren()
        let widenableChildren = new Set(this.children)
        let flag = false
        while (!flag) {
            let dmin = Number.POSITIVE_INFINITY
            widenableChildren.forEach((child) => {
                let d = child.innerWidthMaximum - child.innerWidthActual
                if (d > 0) {
                    dmin = Math.min(dmin, d)
                } else {
                    widenableChildren.delete(child)
                }
            })
            if (widenableChildren.size === 0) {
                flag = true
            } else {
                let hypotheticalExtraWidth = dmin * widenableChildren.size
                let extraWidthAvailable = this.innerWidthActual - widthConsumedByChildren
                if (hypotheticalExtraWidth <= extraWidthAvailable) {
                    widenableChildren.forEach((child) => {
                        child.innerWidthActual += dmin
                    })
                    widthConsumedByChildren += hypotheticalExtraWidth
                } else {
                    flag = true
                    let reduced_dmin = Math.floor(extraWidthAvailable/widenableChildren.size)
                    widenableChildren.forEach((child) => {
                        child.innerWidthActual += reduced_dmin
                    })
                }    
            }
        }
    }
}

class VerticalList extends VerticalComponent {
    append(child) {
        if (this.listOfChildren === undefined) {
            this.listOfChildren = []
        }
        this.listOfChildren.push(child)
        super.append(child)
    }
    defaultTagName() {return 'div'}
    render() {
        /* Align child nodes appropriately */
        this.children.forEach((child) => {
            let x = this.paddingLeft + (this.innerWidthActual - child.outerize(child.innerWidthActual))*child.alignment
            child.HTML_element.style.left = `${x}px`
        })
        let height = this.paddingTop
        let flag = false
        this.listOfChildren.forEach((child) => {
            /* Height of parent element */
            if (flag) {
                height += this.gapBetweenChildren
            } else {
                flag = true
            }
            child.HTML_element.style.top = `${height}px`
            height += child.HTML_element.offsetHeight
        })
        /* Set the height of the current component */
        height += this.paddingBottom
        this.HTML_element.style.height = `${height}px`
        super.render() // Must be at end
    }
}

class HorizontalList extends HorizontalComponent {
    append(child) {
        if (this.currentAppendSide === undefined) {
            this.leftChildren  = []
            this.rightChildren = []
            this.currentAppendSide = this.leftChildren
            this.otherAppendSide   = this.rightChildren
        }
        this.currentAppendSide.push(child)
        super.append(child)
    }
    toggleAppendSide() {
        if (this.currentAppendSide === undefined) {
            this.leftChildren  = []
            this.rightChildren = []
            this.currentAppendSide = this.leftChildren
            this.otherAppendSide   = this.rightChildren
        }
        let temp = this.currentAppendSide
        this.currentAppendSide = this.otherAppendSide
        this.otherAppendSide = temp
    }
    defaultTagName() {return 'span'}
    render() {
        /* Set x values of children */
        let innerHeight = 0
        let count = 0
        while (count < 2) {
            if (count === 0) {
                var listOfChildren = this.leftChildren
                var x = this.paddingLeft
            } else {
                var listOfChildren = this.rightChildren
                var x = this.paddingRight
            }
            let flag = false
            listOfChildren.forEach((child) => {
                if (flag) {
                    x += this.gapBetweenChildren
                } else {
                    flag = true
                }
                innerHeight = Math.max(innerHeight, child.HTML_element.offsetHeight) // This is a bug waiting to happen, don't use child.offsetHeight here
                console.log(count, x)
                if (count === 0) {
                    child.HTML_element.style.left = `${x}px`
                } else {
                    child.HTML_element.style.right = `${x}px`
                }
                x += child.HTML_element.offsetWidth
            })
            count += 1
        }
        /* Set height of the current element */
        let outerHeight = innerHeight + this.paddingTop + this.paddingBottom
        this.HTML_element.style.height = `${outerHeight}px`
        /* Set y values of children */
        this.children.forEach((child) => {
            let y = this.paddingTop + (innerHeight - child.HTML_element.offsetHeight)*child.alignment
            child.HTML_element.style.top = `${y}px`
        })
        super.render() // Must be at end
    }
}

class Text extends LeafComponent {
    defaultTagName() {return 'p'}
}

class Button extends LeafComponent {
    defaultTagName() {return 'btn'}
}

class Image extends LeafComponent {
    defaultTagName() {return 'img'}
    setImageSrc(src) {
        this.HTML_element.src = src
        this.HTML_element.addEventListener('load', () => {
            SRUI_bodyComponent.renderDescendants()
        })
        /*img.addEventListener('error', function() {
            alert('error')
        })*/
    }
}

/* Define CSS functionality */

function isCapital(char){
    return char.charCodeAt() >= 65 && char.charCodeAt() <= 90;
}

function deCapitalize(word) {
    return word.charAt(0).toLowerCase() + word.slice(1);
}

CSS_NAME_FROM_JS = (jsName) => {
    let cssName = ""; // Not sure why this semicolon is necessary... but it totally is
    [...jsName].forEach((char) => {
        if (isCapital(char)) {
            cssName += `-${char.toLowerCase()}`
        } else {
            cssName += char
        }
    })
    return cssName
}

CSS_NAME_TO_JS = (cssName) => {
    return cssName.split('-').map((word) => {
        if (flag) {
            return word[0].toUpperCase() + word.substring(1)
        } else {
            return word
        }
    }).join("")
}

CSS_FROM_OBJ = (obj) => {
    let text = ""
    Object.entries(obj).forEach(([key, value]) => {
        /* Build cssKey */
        let cssKey = CSS_NAME_FROM_JS(key)
        /* Build cssValue */
        let cssValue = value
        /* Append the key-value pair onto the text variable */
        text += `\n\t${cssKey}: ${cssValue};`
    })
    return `{${text}\n}`
}

CSS_FROM_PAIR = (text, obj) => {
    return `${text} ${CSS_FROM_OBJ(obj)}`
}

CSS_APPLY = (text) => {
    let style = document.createElement('style')
    style.textContent = text
    document.head.appendChild(style)
}

CSS_CLASS = (obj, pseudos) => {
    SRUI_cssClassCount += 1
    let className = `SRUI_${SRUI_cssClassCount}`
    let css_code = CSS_FROM_PAIR(`.${className}`, obj)
    if (pseudos !== undefined) {
        Object.entries(pseudos).forEach(([pseudo, obj]) => {
            css_code += CSS_FROM_PAIR(`\n.${className}:${pseudo}`, obj)
        })
    }
    console.log(css_code)
    CSS_APPLY(css_code)
    return className
}

CSS_DO = (L) => {
    let css_code = ""
    L.forEach(([text, obj]) => {
        css_code += CSS_FROM_PAIR(text, obj)
    })
    CSS_APPLY(css_code)
}

CSS_EVERYTHING = `*, *::before, *::after`

/* Initialize */

let SRUI_cssClassCount = 0

CSS_DO([
    [CSS_EVERYTHING, {
        position:  'absolute',
        boxSizing: 'border-box',
        margin:  '0',
        padding: '0',
        borderWidth: '0'
    }]
])