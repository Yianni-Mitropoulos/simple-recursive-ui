SMALL_TIME_INCREMENT = 0

class Component {
    constructor(...args) {
        this.HTML_element = this.cons(...args)
        this.children = []
        this.onAppend = []
        /* Set up the default width */
        this.alignment = 0 // Determines how it sits inside larger element
        this.outerWidthTarget = Infinity // Determines target size
        this.outerWidthMax    = Infinity // Determines maximum size
        this.setPadding(0)               // Determines interior padding
        this.gapBetweenChildren = 0      // Determines interior margins
        /* Finish constructing the Component by calling the relevant initialization function */
        this.init(...args)
    }
    setPadding(padding) {
        this.paddingTop    = padding
        this.paddingBottom = padding
        this.paddingLeft   = padding
        this.paddingRight  = padding
        this.HTML_element.style.padding = `${padding}px` // Mainly useful for leaf nodes
        return this
    }
    setGapBetweenChildren(gap) {
        this.gapBetweenChildren = gap
        return this
    }
    setOuterWidthTarget(target) {
        this.outerWidthTarget = target
        return this
    }
    setOuterWidthMax(max) {
        this.outerWidthMax = max
        return this
    }
    rigidify() {
        this.outerWidthMax = this.outerWidthTarget
        return this
    }
    setAlignment(alignment) {
        this.alignment = alignment
        return this
    }
    append(child) {
        this.HTML_element.append(child.HTML_element)
        this.children.push(child)
        child.parent = this
        this.onAppend.forEach((handler) => {
            handler(child)
        })
        return this
    }
    style(obj) {
        Object.entries(obj).forEach(([key, value]) => {
            this.HTML_element.style[key] = value
        })
        return this
    }
    finish() {
        addEventListener('resize', this.render.bind(this))
        this.render()
    }
    /* Private methods */
    render() {
        this.renderPart1()
        setTimeout(() => {
            this.renderPart2()
        }, SMALL_TIME_INCREMENT)
    }        
    renderPart1() {
        this.outerWidthAvailable = window.innerWidth
        this.innerWidthAvailable = window.innerWidth - this.paddingLeft - this.paddingRight
        this.beginInitialWidthComputation()
        this.beginFinalWidthComputation()
    }
    beginInitialWidthComputation() {
        this.children.forEach((child) => {
            child.outerWidthAvailable = Math.min(
                child.parent.innerWidthAvailable,
                child.outerWidthMax
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
            Math.min(
                this.innerWidthAvailable,
                this.outerWidthTarget - this.paddingLeft - this.paddingRight
            )
        )
        this.outerWidth = this.innerWidth + this.paddingLeft + this.paddingRight
        // console.log(this)
        // console.log(this.outerWidthAvailable, this.innerWidthAvailable, this.innerWidth, this.outerWidth)
        // console.log(L)
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
    cons() {
        return document.createElement('div')
    }
    init(outerWidthTarget, gapBetweenChildren) {
        this.setOuterWidthTarget(outerWidthTarget)
        this.setGapBetweenChildren(gapBetweenChildren)
    }
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

class Body extends VerticalList {
    cons() {
        return document.body
    }
    init() {}
}

class Paragraph extends Component {
    cons(msg) {
        let p = document.createElement('p')
        p.append(document.createTextNode(msg))
        return p
    }
    init() {}
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