/* The guts of the library */

function SRUI_new_component(isLeaf, f) {

    function constructor(...args) {

        /* Create the component */
        if (isLeaf) {
            var [component, finalize] = f(...args)
        } else {
            var [component, finalize] = f()
        }

        /* Allow the user of the library to apply styles, classes, and attributes to the element */
        component.SRUI_applyStyle = (style) => {
            Object.entries(style).forEach(([key, value]) => {
                component.style[key] = value
            })
            return component
        }

        component.SRUI_toggleClasses = (classes) => {
            classes.forEach((class_name) => {
                component.classList.toggle(class_name)
            })
            return component
        }

        component.SRUI_setAttributes = (attributes) => {
            Object.entries(attributes).forEach(([key, value]) => {
                component.setAttribute(key, value)
            })
            return component
        }

        /* Allow the user of the library to change the SRUI name of the element */
        component.SRUI_setName = (name) => {
            component.SRUI_name = name
            return component
        }

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

        /* Define the 'SRUI_getNearestNode' method */
        component.SRUI_getNearestNode = (SRUI_name) => {
            let retval = undefined
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

        /* Attach a method for removing the component */
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

        /* Allow the user of the library to execute arbitrary code on this component */
        component.SRUI_do = (f) => {
            let F = f.bind(component)
            F()
            return component
        }

        /* Allow the specification of event handlers */
        component.SRUI_addEventListener = (eventName, f) => {
            let F = f.bind(component)
            component.addEventListener(eventName, F)
            return component
        }

        /* Methods for operating on child nodes */
        component.SRUI_forEachChild = (f) => {
            let F = f.bind(component)
            component.SRUI_children.forEach((child) => {
                F(child)
            })
            return component
        }

        component.SRUI_forEachChildHereafter = (f) => {
            let F = f.bind(component)
            component.SRUI_onNewChild = F
            return component
        }

        component.SRUI_forEachChildForever = (f) => {
            component.SRUI_forEachChild(f)
            component.SRUI_forEachChildHereafter(f)
            return component
        }

        /* Methods for operating on grandchildren */
        component.SRUI_forEachGrandchild = (f) => {
            let F = f.bind(component)
            component.SRUI_children.forEach((child) => {
                child.SRUI_children.forEach((grandchild) => {
                    F(grandchild)
                })
            })
            return component
        }

        component.SRUI_forEachGrandchildHereafter = (f) => {
            component.SRUI_onNewGrandchild = f
            return component
        }

        component.SRUI_forEachGrandchildForever = (f) => {
            component.SRUI_forEachGrandchild(f)
            component.SRUI_forEachGrandchildHereafter(f)
            return component
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
            return component
        }

        /* Allow the setting of state */
        component.SRUI_setVariable = (key, value) => {
            component.SRUI_variables[key] = value
            return component
        }

        /* Specify some starting values */
        component.SRUI_parent = undefined
        component.SRUI_children = []
        component.SRUI_properUndernodes = {}
        component.SRUI_name = undefined
        component.SRUI_margination = undefined
        component.SRUI_variables = {} // This line create spaces for arbitrary data that the user of library may want to store
        component.SRUI_onNewChild = (child) => {}
        component.SRUI_onNewGrandchild = (grandchild) => {}

        /* If the component we're constructing is a leaf, we're done at this point */
        if (isLeaf) {
            let F = finalize.bind(component)
            F()
            return component
        }
        /* Otherwise... */

        /* Attach a method for altering margination */
        component.SRUI_setMargination = (margination) => {
            component.SRUI_margination = margination
            let flag = false
            component.SRUI_forEachChild((child) => {
                if (child.SRUI_inheritMargination) {
                    child.SRUI_setMargination(margination)
                }
                if (flag) {
                    child.style.marginTop = margination
                }
                flag = true
            })
            return component
        }

        /* Attach a component for recursively getting margination */
        component.SRUI_getMargination = () => {
            let retval = undefined
            component.SRUI_forEachAncestor((ancestor) => {
                if (retval === undefined) {
                    if (ancestor.SRUI_margination !== undefined) {
                        retval = ancestor.SRUI_margination
                    }
                }
            })
            return retval
        }
                
        /* Attach a method for attaching new (proper) undernodes */
        component.SRUI_attachUndernode = (newUndernode) => {
            let undernodeList = component.SRUI_properUndernodes[newUndernode.SRUI_name]
            if (undernodeList === undefined) {
                undernodeList = []
                component.SRUI_properUndernodes[newUndernode.SRUI_name] = undernodeList
            }
            undernodeList.push(newUndernode)
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
                /* Append the child onto the internal SRUI children list */
                component.SRUI_children.push(child)
                /* If the length of the above list is 2 or more, give the child a topMargin */
                let margination = component.SRUI_getMargination()
                if (margination !== undefined) {
                    child.style.marginTop = margination
                }
                /* Call onNewChild and onNewGrandchild handlers */
                component.SRUI_onNewChild(child)
                if (component.SRUI_parent !== undefined) {
                    component.SRUI_parent.SRUI_onNewGrandchild(child)
                }
                /* Append the child to the relevant part of the DOM */
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
        
        /* Append the children passed that were passed in */
        component.SRUI_appendChild(...args)
        
        /* Return the component instance that we just constructed */
        let F = finalize.bind(component)
        F()
        return component
    }

    return constructor
}

/* Basic leaf components */

BREAK = SRUI_new_component(true, () => {
    return [document.createElement('br'), () => {}]
})

TEXT = SRUI_new_component(true, (msg) => {
    return [document.createTextNode(msg), () => {}]
})

SLIDER = SRUI_new_component(true, (obj) => {
    return [
        document.createElement('input'),
        function() {
            this.SRUI_setAttributes({
                "type": "range",
                "min": obj["min"],
                "value": obj["value"],
                "max": obj["max"],
            })
        }
    ]
})

BUTTON = SRUI_new_component(true, (msg) => {
    let btn = document.createElement('button')
    btn.textContent = msg
    return [btn, () => {}]
})

/* Basic components that can be styled */

BODY = SRUI_new_component(false, () => {
    let body = document.body
    return [body, function() {
        console.log(body.SRUI_children[body.SRUI_children.length - 1].style.position === 'fixed')
        if (body.SRUI_children.length !== 0) {
            let last_child = body.SRUI_children[body.SRUI_children.length - 1]
            if (last_child.style.position === 'fixed') {
                body.style.paddingBottom = `${last_child.clientHeight}px`
            }
        }
    }]
})

PARAGRAPH = SRUI_new_component(false, () => {
    let p = document.createElement('p')
    return [p, () => {}]
})

VERTICAL_DIV = SRUI_new_component(false, () => {
    let div = document.createElement('div')
    div.SRUI_inheritMargination = true
    return [div, () => {}]
})

HORIZONTAL_DIV = SRUI_new_component(false, () => {
    let div = document.createElement('div')
    div.SRUI_inheritMargination = false
    return [div, () => {}]
})

/* Tables */

TABLE_DATA_CELL = SRUI_new_component(false, () => {
    let td = document.createElement('td')
    return [td, () => {}]
})

TABLE_ROW = SRUI_new_component(false, () => {
    let tr = document.createElement('tr')
    return [tr, () => {}]
})

TABLE = SRUI_new_component(false, () => {
    let table = document.createElement('table')
    return [table, () => {}]
})

/* Headers and footers */

HEADER = SRUI_new_component(false, () => {
    let header = document.createElement('header')
    return [
        header,
        function() {
            this.SRUI_applyStyle({
                width: "100%",
                top: "0",
            })
        }
    ]
})

FOOTER = SRUI_new_component(false, () => {
    let footer = document.createElement('footer')
    return [
        footer,
        function() {
            this.SRUI_applyStyle({
                width: "100%",
                bottom: "0",
            })
        }
    ]
})

/* Side by side functionality */

CLEAR_FLOATS = SRUI_new_component(true, () => {
    let div = document.createElement('div')
    div.style.clear = "both"
    return [div, () => {}]
})

SIDE_BY_SIDE = (left, right) => {
    left.style.float  = "left"
    right.style.float = "right"
    return [
        left,
        right,
        CLEAR_FLOATS()
    ]
}