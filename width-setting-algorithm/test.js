class Widle {
    constructor(innerWidthMinimum, innerWidthDesired, children) {
        this.innerWidthMinimum = innerWidthMinimum
        this.innerWidthDesired = innerWidthDesired
        this.children = children
        children.forEach((child) => {
            child.parent = this
        })
    }
    outerize(innerWidth) {return innerWidth}
    innerize(outerWidth) {return outerWidth}
    computeWidths() { // innerWidthActualComputation
        this.computeWidths_initialize()
        this.innerWidthActual = this.innerWidthMaximum
        this.computeWidths_widenChildrenRecursively()
    }
    computeWidths_initialize() {
        this.children.forEach((child) => child.computeWidths_initialize())
        this.innerWidthActual  = Math.max(this.innerWidthMinimum, this.widthConsumedByChildren())
        this.innerWidthMaximum = Math.max(this.innerWidthActual,  this.innerWidthDesired)    
    }
    computeWidths_widenChildrenRecursively() {
        this.widenChildren()
        this.children.forEach((child) => child.computeWidths_widenChildrenRecursively())
    }
}

class Vert extends Widle {
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

class Hoz extends Widle {
    widthConsumedByChildren() {
        let runningSum = 0
        this.children.forEach((child) => {
            runningSum += child.outerize(child.innerWidthActual)
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
                if (widthConsumedByChildren + hypotheticalExtraWidth <= this.innerWidthMaximum) {
                    widenableChildren.forEach((child) => {
                        child.innerWidthActual += dmin
                    })
                    widthConsumedByChildren += hypotheticalExtraWidth
                } else {
                    flag = true
                    let reduced_dmin = Math.floor((this.innerWidthMaximum - widthConsumedByChildren)/widenableChildren.size)
                    widenableChildren.forEach((child) => {
                        child.innerWidthActual += reduced_dmin
                    })
                }    
            }
        }
    }
}

x = new Hoz(100, 150, [
    new Hoz(60, 70, []),
    new Hoz(60, 70, [])
])

x.computeWidths()
console.log(x)