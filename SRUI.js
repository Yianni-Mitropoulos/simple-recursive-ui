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
        /* Construct a corresponding HTML element */
        if (tagName === 'body') {
            this.HTML_element = document.body
            window.SRUI_body = this
            addEventListener('resize',
                this.renderDescendants.bind(this)
            )
            setTimeout(
                () => this.renderDescendants(),
            SMALL_TIME_INCREMENT)
        } else {
            this.HTML_element = document.createElement(tagName)
        }
        /* Initialize variables */
        this.children = []
        // this.onAppend = []
        this.alignment = 0 // Determines how it sits inside larger element
        this.outerWidthTarget  = Infinity // Determines target size
        this.outerWidthMax     = Infinity // Determines maximum size
        this.outerWidthMin     = 0 // Determines maximum size
        this.setPadding(12)
        this.setGapBetweenChildren(12)
        this.applyStyle({background: generateColor()})
        /* Execute each argument as if it were a function */
        args.forEach((argument) => {
            console.log(argument)
            if (argument instanceof Component) {
                this.append(argument)
            } else {
                try {
                    /* If it's an instruction, execute it */
                    var opname     = argument[0]
                    var inputValue = argument[1]
                    this[opname](inputValue)
                } catch {
                    console.log(`Problem with [${opname}, ${inputValue}] on ${this}`)
                }
            }
        })
    }
    append(child) {
        this.HTML_element.append(child.HTML_element)
        this.children.push(child)
        child.parent = this
        /*
        this.onAppend.forEach((handler) => {
            handler(child)
        })
        */
    }
    addEventListener(eventName, handler) {
        this.HTML_element.addEventListener(eventName, handler)
    }
    setPadding(padding) {
        this.paddingTop    = padding
        this.paddingBottom = padding
        this.paddingLeft   = padding
        this.paddingRight  = padding
        this.HTML_element.style.padding = `${padding}px` // Mainly useful for leaf nodes
    }
    setGapBetweenChildren(gap) {
        this.gapBetweenChildren = gap
    }
    setOuterWidthTarget(target) {
        this.outerWidthTarget = target
    }
    setOuterWidthMax(max) {
        this.outerWidthMax = max
    }
    setOuterWidthMin(min) {
        this.outerWidthMin = min
    }
    setOuterWidth(value) {
        this.outerWidthTarget = value
        this.outerWidthMax    = value
    }
    setInnerHTML(msg) {
        this.HTML_element.innerHTML = msg + '&nbsp;' // Prevents selections at the end of one paragraph from bleeding over into the next paragraph
    }
    setAlignment(alignment) {
        this.alignment = alignment
    }
    applyStyle(obj) {
        Object.entries(obj).forEach(([key, value]) => {
            this.HTML_element.style[key] = value
        })
        return this
    }
    /* Private methods */
    renderDescendants() {
        console.log("Rendering...")
        this.renderPart1()
        setTimeout(() => {
            this.renderPart2()
        }, SMALL_TIME_INCREMENT)
    }        
    renderPart1() {
        this.outerWidthAvailable = Math.max(
            this.outerWidthMin,
            document.documentElement.clientWidth,
        )
        this.innerWidthAvailable = this.outerWidthAvailable - this.paddingLeft - this.paddingRight
        this.beginInitialWidthComputation()
        this.beginFinalWidthComputation()
    }
    beginInitialWidthComputation() {
        this.children.forEach((child) => {
            child.outerWidthAvailable = Math.max(
                child.outerWidthMin,
                Math.min(
                    child.parent.innerWidthAvailable,
                    child.outerWidthMax
                ),
            )
            child.innerWidthAvailable = child.outerWidthAvailable - child.paddingLeft - child.paddingRight
            child.beginInitialWidthComputation()
        })
    }        
    beginFinalWidthComputation() {
        this.children.forEach((child) => {
            child.beginFinalWidthComputation()
        })
        let L = this.children.map((child) => {
            return Math.min(
                child.outerWidthAvailable,
                child.outerWidthTarget,
            )
        })
        this.innerWidth = Math.max(...L,
            // this.outerWidthMin - this.paddingLeft - this.paddingRight,
            Math.min(
                this.innerWidthAvailable,
                this.outerWidthTarget - this.paddingLeft - this.paddingRight
            )
        )
        this.outerWidth = this.innerWidth + this.paddingLeft + this.paddingRight
        this.HTML_element.style.width = `${this.outerWidth}px` // Communicate with web browser via CSS
    }
    renderPart2() {
        this.children.forEach((child) => {
            child.renderPart2()
        })
        this.rend() // Provided by the component type
    }
}

class VerticalList extends Component {
    defaultTagName() {return 'div'}
    rend() {
        /* Align child nodes appropriately */
        this.children.forEach((child) => {
            let x = this.paddingLeft + (this.innerWidth - child.outerWidth)*child.alignment
            child.HTML_element.style.left = `${x}px`
        })
        let height = this.paddingTop
        let flag = false
        this.children.forEach((child) => {
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
    }
}

class HorizontalList extends Component {
    defaultTagName() {return 'span'}
    rend() {
        /* Set x values of children */
        let innerHeight = 0
        let x = this.paddingLeft
        let flag = false
        this.children.forEach((child) => {
            if (flag) {
                x += this.gapBetweenChildren
            } else {
                flag = true
            }
            innerHeight = Math.max(innerHeight, child.HTML_element.offsetHeight) // This is a bug waiting to happen, don't use child.offsetHeight here
            child.HTML_element.style.left = `${x}px`
            x += child.HTML_element.offsetWidth
        })
        /* Set height of the current element */
        let outerHeight = innerHeight + this.paddingTop + this.paddingBottom
        this.HTML_element.style.height = `${outerHeight}px`
        /* Set y values of children */
        this.children.forEach((child) => {
            let y = this.paddingTop + (innerHeight - child.HTML_element.offsetHeight)*child.alignment
            child.HTML_element.style.top = `${y}px`
        })
    }
}

class Paragraph extends Component {
    defaultTagName() {return 'p'}
    rend() {}
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