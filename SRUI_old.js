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
                component.style[deCapitalize(key)] = value
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

        component.SRUI_applyMargination = (margination) => {
            if (margination === undefined) {
                margination = component.SRUI_getMargination()
            }
            let flag = false
            component.SRUI_forEachChild((child) => {
                if (child.SRUI_blockMargination !== true && child.SRUI_margination === undefined) {
                    child.SRUI_applyMargination(margination)
                }
                if (flag) {
                    child.style.marginTop = margination
                }
                flag = true
            })
        }

        /* Specify some starting values */
        component.SRUI_parent = undefined
        component.SRUI_children = []
        component.SRUI_properUndernodes = {}
        component.SRUI_name = undefined
        component.SRUI_margination = undefined
        component.SRUI_onNewChild      = (child) => {}
        component.SRUI_onNewGrandchild = (grandchild) => {}
        component.SRUI_variables = {} // This line create spaces for arbitrary data that the user of library may want to store

        /* If the component we're constructing is a leaf, we're done at this point */
        if (isLeaf) {
            let F = finalize.bind(component)
            F()
            return component
        }
        /* Otherwise... */

        /* Attach methods for altering margination */
        component.SRUI_setMargination = (margination) => {
            component.SRUI_margination = margination
            component.SRUI_applyMargination(margination)
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
                /* Call onNewChild and onNewGrandchild handlers */
                component.SRUI_onNewChild(child)
                if (component.SRUI_parent !== undefined) {
                    component.SRUI_parent.SRUI_onNewGrandchild(child)
                }
                /* Append the child to the relevant part of the DOM */
                component.append(child)
                console.log(child.offsetWidth)
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

PARAGRAPH = SRUI_new_component(true, (msg) => {
    let textNode = document.createTextNode(msg)
    let p = document.createElement('p')
    p.append(textNode)
    return [p, () => {}]
})

SLIDER = SRUI_new_component(true, (obj) => {
    return [
        document.createElement('input'),
        function() {
            this.SRUI_setAttributes(obj)
            this.setAttribute("type", "range")
        }
    ]
})

IMAGE = SRUI_new_component(true, (obj) => {
    return [
        document.createElement("img"),
        function() {
            this.SRUI_setAttributes(obj)
        }
    ]
})

/* Basic non-leaf components */

BODY = SRUI_new_component(false, () => {
    let body = document.body
    return [body, function() {}]
})

VERTICAL_LIST = SRUI_new_component(false, () => {
    let retval = document.createElement("div")
    return [retval, function() {
        this.SRUI_setGap = (gap) => {
            this.SRUI_gap = gap
            let i = 0
            this.SRUI_forEachChild((child) => {
                setTimeout(() => {
                    child.style.top = `${i}px`
                    i += child.offsetHeight + gap
                }, 0)
            })
            return this
        }
    }]
})

HORIZONTAL_LIST = SRUI_new_component(false, () => {
    let retval = document.createElement("div")
    return [retval, function() {
        let i = 0;
        this.SRUI_forEachChild((child) => {
            setTimeout(() => {
                child.style.left = `${i}px`
                i += child.offsetWidth
            }, 0)
        })
    }]
})