component, width, padding, gap) => {
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
