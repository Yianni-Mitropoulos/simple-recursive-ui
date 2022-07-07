function SRUI_applyStyle(component, style) {
    if (style !== undefined) {
        Object.entries(style).forEach(([key, value]) => {
            component.style[key] = value
        })
    }
}

function SRUI_toggleClasses(component, classes) {
    if (classes !== undefined) {
        classes.forEach((class_name) => {
            component.classList.toggle(class_name)
        })
    }
}

function SRUI_new_component(f) {
    function constructor(obj, ...children) {
        /* Create the component */
        let component = f(obj)

        /* Maintain the underlying double-linked tree structure and append the children as HTML elements */
        component.SRUI_namedUndernodes = {}
        component.SRUI_children = children
        children.forEach((child) => {
            child.SRUI_parent = component
            component.append(child)
            /* Add the child node, if named */
            let child_name = child.SRUI_name
            if (child_name !== undefined) {
                let undernodeList = component.SRUI_namedUndernodes[child_name];
                if (undernodeList === undefined) {
                    undernodeList = []
                    component.SRUI_namedUndernodes[child_name] = undernodeList
                }
                undernodeList.push(child)
            }
            /* Add its children (if named), too */
            Object.entries(child.SRUI_namedUndernodes).forEach(([key, value]) => {
                let undernodeList = component.SRUI_namedUndernodes[key];
                if (undernodeList === undefined) {
                    undernodeList = []
                    component.SRUI_namedUndernodes[key] = undernodeList
                }
                undernodeList.push(...value)
            })
        })

        /* Store name */
        let SRUI_name = obj["SRUI_name"]
        if (SRUI_name !== undefined) {
            component.SRUI_name = SRUI_name
        }

        /* Apply the relevant style and toggle the relevant classes */
        SRUI_applyStyle(component, obj["style"])
        SRUI_toggleClasses(component, obj["classes"])

        /* Apply event handlers */
        /* Note: the code below should really throw an error if an arrow function was used for the event handler. */
        /* But I don't know how to efficiently test for being an arrow function, so right now it fails silently. */
        Object.entries(obj).forEach(([key, value]) => {
            if (key.slice(0, 2) === "on") {
                component.addEventListener(key.slice(2), value.bind(component))
            }
        })

        /* Define the 'SRUI_getNearestNodes' method (note the pluralization) */
        component.SRUI_getNearestNodes = (SRUI_name) => {
            let node = component;
            while (true) {
                try {
                    let namedUndernodes = node.SRUI_namedUndernodes
                    var undernodeList = namedUndernodes[SRUI_name]
                    node = node.SRUI_parent
                } catch(error) {
                    return []
                }
                if (undernodeList !== undefined) {
                    return undernodeList
                }
            }
        }

        /* Define the 'SRUI_getNearestNode' method (note the lack of pluralization) */
        component.SRUI_getNearestNode = (SRUI_name) => {
            let undernodeList = component.SRUI_getNearestNodes(SRUI_name)
            if (undernodeList.length > 1) {
                throw `Too many nodes called ${SRUI_name}. There needs to be exactly one such node encountered for this method to succeed.`
            }
            return undernodeList[0]
        }

        /* Define the 'SRUI_remove' method */
        component.SRUI_remove = () => {
            /* Remove it from the DOM */
            component.remove()
            /* Remove it from the parent element's list of children */
            let arr = component.SRUI_parent.SRUI_children
            let index = arr.indexOf(component)
            arr.splice(index, 1)
            /* Remove it from all relevant undernode lists */
            if (component.SRUI_name !== undefined) {
                let node = component.SRUI_parent
                while (node !== undefined) {
                    let arr = SRUI_namedUndernodes[component.SRUI_name]
                    let index = arr.indexOf(component)
                    arr.splice(index, 1)
                }
            }
        }

        /* Define the SRUI_forEach methods */
        component.SRUI_forEachChild = (f) => {
            component.SRUI_children.forEach(f)
        }

        component.SRUI_forEachGrandchild = (f) => {
            component.SRUI_forEachChild((child) => {
                child.SRUI_forEachChild(f)
            })
        }

        /* Call the SRUI_forEach methods if appropriate */
        let forEachChild = obj["forEachChild"]
        if (forEachChild !== undefined) {
            component.SRUI_forEachChild(forEachChild)
        }

        let forEachGrandchild = obj["forEachGrandchild"]
        if (forEachGrandchild !== undefined) {
            component.SRUI_forEachGrandchild(forEachGrandchild)
        }

        /* Return the component instance that we just constructed */
        return component
    }

    return constructor
}

/* Basic components */

BODY = SRUI_new_component((obj) => {
    return document.body
})

BREAK = SRUI_new_component((obj) => {
    return document.createElement('br')
})

TEXT_NODE = SRUI_new_component((obj) => {
    return document.createTextNode(obj["text"])
})

PARAGRAPH = SRUI_new_component((obj) => {
    return document.createElement('p')
})

DIV = SRUI_new_component((obj) => {
    return document.createElement('div')
})

CLEAR_FLOATS = SRUI_new_component((obj) => {
    div = document.createElement('div')
    div.style.clear = "both"
    return div
})

/* Slider */

SLIDER = SRUI_new_component((obj) => {
    let slider = document.createElement('input')
    slider.setAttribute("type", "range")
    slider.setAttribute("min",   obj["min"])
    slider.setAttribute("value", obj["value"])
    slider.setAttribute("max",   obj["max"]) 
    return slider
})

/* Button */

BUTTON = SRUI_new_component((obj) => {
    let btn = document.createElement('button')
    btn.textContent = obj["text"]
    return btn
})

/* Tables */

TABLE_DATA_CELL = SRUI_new_component((obj) => {
    let td = document.createElement('td')
    td.setAttribute("colspan", obj["colspan"])
    return td
})

TABLE_ROW = SRUI_new_component((obj) => {
    return document.createElement('tr')
})

TABLE = SRUI_new_component((obj) => {
    return document.createElement('table')
})

LEFT_RIGHT_CLEAR = (left, right) => {
    left.style.float  = "left"
    right.style.float = "right"
    return [
        left,
        right,
        CLEAR_FLOATS({})
    ]
}