SMALL_TIME_INCREMENT = 0

/*
function is_component(possible_component) {
    return (
        possible_component !== undefined &&
        possible_component.SRUI_component === true
    )
}
let this.width = this.HTML_element.offsetWidth
*/

NewComponentType = (f, g) => {
    class Component {
        constructor(...args) {
            this.SRUI_component = true
            this.HTML_element = f(...args)
            this.children = []
            this.onAppend = []
            this.paddingTop = 0
            this.paddingBottom = 0
            this.paddingLeft = 0
            this.paddingRight = 0
            this.alignment = 0
            g(this, ...args)
        }
        setPadding(padding) {
            this.paddingTop    = padding
            this.paddingBottom = padding
            this.paddingLeft   = padding
            this.paddingRight  = padding
            this.setPixels('padding', padding)
            return this
        }
        setAlignment(alignment) {
            this.alignment = alignment
        }
        setPixels(key, value) {
            this[key] = value
            this.HTML_element.style[key] = `${value}px`
            return this
        }
        setPixelsIntended(key, value) {
            this[key] = value
            this[`${key}Intended`] = value
            this.HTML_element.style[key] = `${value}px`
            return this
        }
        getMinimumOuterWidth() {
            let computedInnerWidth = 0
            this.children.forEach((child) => {
                computedInnerWidth = Math.max(computedInnerWidth, child.getMinimumOuterWidth())
            })
            let computedOuterWidth = computedInnerWidth + this.paddingLeft + this.paddingRight
            return Math.max(computedOuterWidth, this.widthIntended)
        }
        propagate(width) {
            if (width === undefined) {
                width = window.innerWidth
            }
            if (this.widthIntended === undefined) {
                this.setPixels('width',  width)
            } else {
                width = this.getMinimumOuterWidth()
            }
            width -= this.paddingLeft + this.paddingRight
            this.children.forEach((child) => {
                child.propagate(width)
            })
        }
        render() {
            this.children.forEach((child) => {
                child.render()
            })
            this.width  = this.HTML_element.offsetWidth
            this.height = this.HTML_element.offsetHeight
            this.renderSpecial()
        }
        finish() {
            let onWindowResize = () => {
                this.propagate()
                setTimeout(() => {
                    this.render()
                }, SMALL_TIME_INCREMENT)    
            }
            addEventListener('resize', onWindowResize)
            onWindowResize()
        }
        append(child) {
            this.HTML_element.append(child.HTML_element)
            this.children.push(child)
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
    }
    return Component
}

/* Provide some basic component types */

$body = NewComponentType(
    () => {
        return document.body
    },
    (component) => {
        component.renderSpecial = () => {}
    },
)

/*
$horizontalList = NewComponentType(
    () => {
        return document.createElement('div')
    },
    (component, height) => {
        component.setHeight(height)
        component.renderSpecial = () => {

        }
    },
)
*/

$verticalList = NewComponentType(
    () => {
        return document.createElement('div')
    },
    (component, width, padding, gap) => {
        component.setPixelsIntended('width', width)
        component.setPadding(padding)
        component.gap = gap
        component.renderSpecial = () => {
            let height = component.paddingTop
            let flag = false
            component.children.forEach((child) => {
                /* Height of parent element */
                if (flag) {
                    height += component.gap
                } else {
                    flag = true
                }
                child.setPixels('top', height)
                height += child.height
            })
            /* Set the height of the current component */
            height += component.paddingBottom
            component.setPixels('height', height)
            /* If there's a minimum width, enforce it */
            if (component.widthIntended !== undefined) {
                component.setPixels('width', component.getMinimumOuterWidth())
            }
            /* Align child nodes */
            let innerWidth = component.width - component.paddingLeft - component.paddingRight
            component.children.forEach((child) => {
                if (child.widthIntended !== undefined) {
                    child.setPixels('left', component.paddingLeft + child.alignment*(innerWidth - child.width))
                }
            })
        }
    },
)

$paragraph = NewComponentType(
    (msg, width) => {
        // Create the paragraph and its text node
        let p = document.createElement('p')
        p.append(document.createTextNode(msg))
        return p
    },
    (component, msg, width) => {
        component.setPixelsIntended('width', width)
        component.renderSpecial = () => {}
    }
)

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