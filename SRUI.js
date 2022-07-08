/* The following code was taken from here: https://stackoverflow.com/a/49510926 */
function getSingleEmInPixels() {
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
    console.log(`window em width = ${emWidth}, time elapsed =  ${(performance.now() - time)}ms`);
    return singleEmPx;
}

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

        /* Create space for arbitrary data that the user of library may want to store */
        component.SRUI_state = {}

        /* Set the parent to "undefined" for emphasis (N.B. this step isn't strictly necessary) */
        component.SRUI_parent = undefined

        /* Attach a method for traversing the ancestors of the component we're creating */
        component.SRUI_forEachAncestor = (f) => {
            let F = f.bind(component)
            let ancestor = component
            while (ancestor !== undefined) {
                F(ancestor)
                ancestor = ancestor.SRUI_parent
            }
        }

        /* Attach a method for traversing the proper ancestors of the component we're creating */
        component.SRUI_forEachProperAncestor = (f) => {
            let F = f.bind(component)
            let ancestor = component.SRUI_parent
            while (ancestor !== undefined) {
                F(ancestor)
                ancestor = ancestor.SRUI_parent
            }
        }

        /* Initialize the list of children of the component we're creating */ 
        component.SRUI_children = []

        /* Attach a method for traversing the child nodes of the component we're creating */
        component.SRUI_forEachChild = (f) => {
            let F = f.bind(component)
            component.SRUI_children.forEach(F)
        }

        /* Attach a method for traversing the grandchild nodes of the component we're creating */
        component.SRUI_forEachGrandchild = (f) => {
            let F = f.bind(component)
            component.SRUI_forEachChild((child) => {
                child.SRUI_forEachChild(F)
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
            let F = f.bind(component)
            Object.values(component.SRUI_properUndernodes).forEach((value) => {
                value.forEach((undernode) => {
                    F(undernode)
                })
            })
            if (component.SRUI_name !== undefined) {
                F(component)
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
        component.SRUI_appendChild(...children)

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
        Object.entries(obj).forEach(([key, f]) => {
            if (key.slice(0, 2) === "on") {
                let F = f.bind(component)
                component.addEventListener(key.slice(2), F)
            }
        })

        /* Execute code if appropriate */
        function doTheWork(f, g) {
            if (f !== undefined) {
                let F = f.bind(component)
                g(F)
            }
        }
        doTheWork(obj["initialize"],        (F) => {F()})
        doTheWork(obj["forEachChild"],      (F) => {component.SRUI_forEachChild(F)})
        doTheWork(obj["forEachGrandchild"], (F) => {component.SRUI_forEachGrandchild(F)})
        doTheWork(obj["finalize"],          (F) => {F()})

        /* Return the component instance that we just constructed */
        return component
    }

    return constructor
}

/* Basic components */

BODY = SRUI_new_component((obj) => {
    let body = document.body
    body.style.margin = "0"
    /* Cludgy fix to address footer positioning that wouldn't be necessary if I actually understood CSS */
    /* N.B. this dodgy solution has the effect of "clobbering" the finalize method on the BODY element */
    obj["finalize"] = function() {
        let children = this.SRUI_children
        let last_node        = children[children.length - 1]
        let second_last_node = children[children.length - 2]
        if (last_node.style.position === 'fixed') {
            second_last_node.style.marginBottom = `${last_node.clientHeight + getSingleEmInPixels()}px`
        }
    }
    return body
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

/* Headers and footers */

HEADER = SRUI_new_component((obj) => {
    let header = document.createElement('header')
    SRUI_applyStyle(header, {
        width: "100%",
        top: "0",
        marginTop: "0",
        marginBottom: "0"
    })
    return header
})

FOOTER = SRUI_new_component((obj) => {
    let footer = document.createElement('footer')
    SRUI_applyStyle(footer, {
        width: "100%",
        bottom: "0",
        marginTop: "0",
        marginBottom: "0"
    })
    return footer
})