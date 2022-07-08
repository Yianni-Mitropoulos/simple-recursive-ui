/* Define a combined TEXT and SLIDER component such that the text displays the current value of the slider */

function PARAGRAPH_SLIDER(obj) {
    return DIVISION(...SIDE_BY_SIDE(
        PARAGRAPH(
            TEXT(obj["value"])
            .SRUI_setName("displayForSliderValue")
        ),
        SLIDER({
            min: obj["min"],
            value: obj["value"],
            max: obj["max"]
        })
        .SRUI_addEventListener("input", function () {
            let slider_value = this.value
            let nearest_display_area = this.SRUI_getNearestNode('displayForSliderValue')
            nearest_display_area.nodeValue = slider_value.toString()
        }),
    ))
}

/* Explain how we want table cells to be styled */

cell_style = {
    verticalAlign: 'top',
    backgroundColor: 'Green'
}

/* Create the page */

body = BODY(
    HEADER(
        TEXT("Simple Recursive User Interface (SRUI)")
    )
    .SRUI_applyStyle({
        backgroundColor: "Blue",
        position: "sticky"
    }),
    DIVISION(
        PARAGRAPH(TEXT("Welcome, traveller!")),
        PARAGRAPH(TEXT("Here's some sliders for you: ")),
        PARAGRAPH_SLIDER({
            min: -5,
            value: 0,
            max: 5
        })
        .SRUI_applyStyle({
            width: "160px"
        }),
        PARAGRAPH_SLIDER({
            min: -5,
            value: 0,
            max: 5
        })
        .SRUI_applyStyle({
            width: "160px"
        }),
        PARAGRAPH(TEXT("And here's a button: ")),
        PARAGRAPH(
            BUTTON("I'm a button")
                .SRUI_addEventListener('click', function() {
                    let output_field = this.SRUI_getNearestNode('outputField')
                    output_field.SRUI_appendChild(
                        TEXT("You clicked the button!"),
                        BREAK()
                    )
                }),
            BREAK()
        )
        .SRUI_setName('outputField'),
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
        .SRUI_forEachGrandchild((cell) => {
            cell.SRUI_applyStyle(cell_style)
            cell.onclick = function() {
                this.SRUI_remove()
            }
        })
    ),
    FOOTER(
        TEXT("This is a footer")
    )
    .SRUI_applyStyle({
        backgroundColor: "Red",
        position: "fixed"
    })
)
.SRUI_applyStyle({
    backgroundColor: "LightBlue"
})