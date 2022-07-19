beginInitialWidthComputation(innerWidthAvailable) {
    this.children.forEach((child) => {
        child.outerWidthAvailable = Math.min(
            child.parent.innerWidthAvailable,
            child.outerWidthMax,
            child.outerWidthTarget
        )
        child.HTML_element.style.width = this.outerWidth // Communicate with web browser via CSS
        child.innerWidthAvailable = child.outerWidthAvailable - child.paddingLeft - child.paddingRight
        child.beginInitialWidthComputation(beginWidthAvailableComputation)
    })
}

beginFinalWidthComputation() {
    this.children.forEach((child) => {
        child.beginFinalWidthComputation()
    })
    this.innerWidth = Math.max(
        ...this.children.map((child) => {
            return Math.min(
                child.outerWidthAvailable,
                child.outerWidthTarget,
                child.outerWidthMax
            )
        })
    )
    this.outerWidth = this.innerWidth + this.paddingLeft + this.paddingRight
    this.HTML_element.style.width = this.outerWidth // Communicate with web browser via CSS
}

beginHeightComputation() {

}