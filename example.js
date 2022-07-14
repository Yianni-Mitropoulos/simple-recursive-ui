/* Define a combined TEXT and SLIDER component such that the text displays the current value of the slider */

function PARAGRAPH_SLIDER(obj) {
    let width = obj["width"] // Why is it that these can be the same
    let sliderWidth = width  // and things still look reasonable?
                             // CSS is so weird...
    return SPAN_BLOCK(

        /* Slider text */
        SPAN_INLINE(
            PARAGRAPH(
                TEXT(obj["value"])
                .SRUI_setName("displayForSliderValue")
            )
        )
        .SRUI_applyStyle({float: "left"}),

        /* The slider itself */
        SPAN_INLINE(
            SLIDER({
                min: obj["min"],
                value: obj["value"],
                max: obj["max"]
            })
            .SRUI_applyStyle({
                width: `${sliderWidth}em`,
            })
            .SRUI_addEventListener("input", function () {
                let slider_value = this.value
                let nearest_display_area = this.SRUI_getNearestNode('displayForSliderValue')
                nearest_display_area.nodeValue = slider_value.toString()
            }),
        )
        .SRUI_applyStyle({float: "right"}),

        /* Clear the floats */
        CLEAR_BOTH()

    )
    .SRUI_applyStyle({
        width: `${width}em`
    })
}

/* Define our styles as variables */

stdPadding = "1em"
stdMargination = "0.7em"

tableCell = CSS_CLASS({
        verticalAlign: "top",
        backgroundColor: "Green",
        padding: stdPadding,
        transition: "0.16s"
    }, {
        hover: {
            backgroundColor: "Yellow"
        }
    }
)

paragraphSliderWidth = 14; // em

/* Create the page */

BODY(
    HEADER(
        TEXT("Simple Recursive User Interface (SRUI)")
    )
    .SRUI_applyStyle({
        position: "sticky",
        padding: stdPadding,
        backgroundColor: "Blue",
    }),
    DIV(
        PARAGRAPH(TEXT("Welcome, traveller!")),
        PARAGRAPH(TEXT("Here's some sliders for you: ")),
        PARAGRAPH_SLIDER({
            min: -5,
            value: 0,
            max: 5,
            width: paragraphSliderWidth,
        }),
        PARAGRAPH_SLIDER({
            min: -5,
            value: 0,
            max: 5,
            width: paragraphSliderWidth,
        }),
        DIV(
            PARAGRAPH(TEXT("And here's a button: ")),
            BUTTON(TEXT("I'm a button"))
                .SRUI_addEventListener('click', function() {
                    let outputField = this.SRUI_getNearestNode('outputField')
                    outputField.SRUI_appendChild(
                        PARAGRAPH(
                            TEXT(`You've clicked the button! Count is ${outputField.SRUI_variables['count']}. `),
                            BUTTON(TEXT('Delete Line'))
                            .SRUI_addEventListener('click', function() {
                                this.SRUI_parent.remove()
                            })
                        )
                    )
                    outputField.SRUI_variables['count'] += 1
                }),
            BREAK(),
        )
        .SRUI_setName('outputField')
        .SRUI_setMargination(stdMargination)
        .SRUI_setVariable('count', 0),
        DIV(
            PARAGRAPH(TEXT("Finally, a table for you. Try clicking on the elements!")),
            TABLE(
                TABLE_ROW(
                    TABLE_DATA_CELL(TEXT("1")),
                    TABLE_DATA_CELL(TEXT("2")),
                    TABLE_DATA_CELL(TEXT("3")),
                ),
                TABLE_ROW(
                    TABLE_DATA_CELL(TEXT("4")),
                    TABLE_DATA_CELL(TEXT("5")),
                    TABLE_DATA_CELL(TEXT("6")),
                ),
            )
            .SRUI_applyStyle({textAlign: "center"})
            .SRUI_forEachGrandchildForever((cell) => {
                cell.SRUI_toggleClasses([tableCell])
                cell.onclick = function() {
                    this.SRUI_remove()
                }
            })
        )
    )
    .SRUI_setMargination(stdMargination)
    .SRUI_applyStyle({
        padding: stdPadding,
    }),
    FOOTER(
        TEXT("This is a footer")
    )
    .SRUI_applyStyle({
        position: "fixed",
        padding: stdPadding,
        backgroundColor: "Red"
    })
)
.SRUI_applyStyle({
    backgroundColor: "LightBlue"
})