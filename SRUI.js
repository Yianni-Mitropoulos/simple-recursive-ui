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

        /* Apply the relevant style and toggle the relevant classes */
        SRUI_applyStyle(component, obj["style"])
        SRUI_toggleClasses(component, obj["classes"])

        /* Store the name of the component we're creating (if it has one) on the component itself */
        let SRUI_name = obj["SRUI_name"]
        if (SRUI_name !== undefined) {
            component.SRUI_name = SRUI_name
        }

        /* Set the parent to "undefined" for emphasis (N.B. this step isn't strictly necessary) */
        component.SRUI_parent = undefined

        /* Attach a method for traversing the ancestors of the component we're creating */
        component.SRUI_forEachAncestor = (f) => {
            let ancestor = component
            while (ancestor !== undefined) {
                f(ancestor)
                ancestor = ancestor.SRUI_parent
            }
        }

        /* Attach a method for traversing the proper ancestors of the component we're creating */
        component.SRUI_forEachProperAncestor = (f) => {
            let ancestor = component.SRUI_parent
            while (ancestor !== undefined) {
                f(ancestor)
                ancestor = ancestor.SRUI_parent
            }
        }

        /* Initialize the list of children of the component we're creating */ 
        component.SRUI_children = []

        /* Attach a method for traversing the child nodes of the component we're creating */
        component.SRUI_forEachChild = (f) => {
            component.SRUI_children.forEach(f)
        }

        /* Attach a method for traversing the grandchild nodes of the component we're creating */
        component.SRUI_forEachGrandchild = (f) => {
            component.SRUI_forEachChild((child) => {
                child.SRUI_forEachChild(f)
            })
        }        
        
        /* Initialize the dictionary of undernodes of the component we're creating */
        component.SRUI_properUndernodes = {}

        /* Attach a method for attaching new (proper) undernodes */
        component.SRUI_attachUndernode = (newUndernode) => {
            let undernodeList = component.SRUI_properUndernodes[newUndernode.SRUI_name];
            if (undernodeList === undefined) {
                undernodeList = []
                component.SRUI_properUndernodes[newUndernode.SRUI_name] = undernodeList
            }
            undernodeList.push(newUndernode)
        }

        /* Attach a method for iterating over undernodes */
        component.SRUI_forEachUndernode = (f) => {
            Object.values(component.SRUI_properUndernodes).forEach((value) => {
                value.forEach((undernode) => {
                    f(undernode)
                })
            })
            if (component.SRUI_name !== undefined) {
                f(component)
            }
        }

        /* Attach a method for appending child nodes */
        component.SRUI_appendChild = (...args) => {
            args.forEach((child) => {
                /* Assign the component we're building as the the child's parent */
                child.SRUI_parent = component
                /* Register the child's undernodes (including the child element itself) so that they're also undernodes of the component and all its ancestors */
                component.SRUI_forEachAncestor((ancestor) => {
                    child.SRUI_forEachUndernode((undernode) => {
                        ancestor.SRUI_attachUndernode(undernode)
                    })
                })
                component.SRUI_children.push(child)
                component.append(child)
            })
        }

        /* Attach a method for prepending child nodes */
        component.SRUI_prependChild = (...args) => {
            args.forEach((child) => {
                /* Assign the component we're building as the the child's parent */
                child.SRUI_parent = component
                /* Register the child's undernodes (including the child element itself) so that they're also undernodes of the component and all its ancestors */
                component.SRUI_forEachAncestor((ancestor) => {
                    child.SRUI_forEachUndernode((undernode) => {
                        ancestor.SRUI_attachUndernode(undernode)
                    })
                })
                component.SRUI_children.unshift(child)
                component.prepend(child)
            })
        }

        /* Attach a method for removing the component we're constructing */
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

        /* Append the children passed that were passed in */
        children.forEach((child) => {
            component.SRUI_appendChild(child)
        })

        /* Define the 'SRUI_getNearestNode' method */
        component.SRUI_getNearestNode = (SRUI_name) => {
            let retval = undefined;
            component.SRUI_forEachAncestor((ancestor) => {
                if (retval !== undefined) {
                    return
                }
                let undernodeList = ancestor.SRUI_properUndernodes[SRUI_name]
                if (undernodeList !== undefined && undernodeList.length !== 0) {
                    if (undernodeList.length == 1) {
                        retval = undernodeList[0]
                    } else {
                        throw "There's more than one undernode with that name!"
                    }
                }
            })
            return retval
        }

        /* Attach event handlers */
        /* NOTE: The code below should really throw an error if an arrow function was used for the event handler. */
        /* But I don't know how to efficiently test for being an arrow function, so right now it fails silently.  */
        Object.entries(obj).forEach(([key, value]) => {
            if (key.slice(0, 2) === "on") {
                component.addEventListener(key.slice(2), value.bind(component))
            }
        })

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

/* Side by side functionality */

SIDE_BY_SIDE = (left, right) => {
    left.style.float  = "left"
    right.style.float = "right"
    return [
        left,
        right,
        CLEAR_FLOATS({})
    ]
}

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