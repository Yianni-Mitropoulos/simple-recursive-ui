/* Define a combined TEXT_NODE and SLIDER component such that the text displays the current value of the slider */

function PARAGRAPH_SLIDER(obj) {
    return DIV(obj,
        ...SIDE_BY_SIDE(
            PARAGRAPH({},
                TEXT_NODE({text: "0", SRUI_name: "displayForSliderValue"})
            ),
            SLIDER({
                min: obj["min"],
                value: obj["value"],
                max: obj["max"],
                style: {marginTop: '17px'},
                oninput: function () {
                    let slider_value = this.value
                    let nearest_display_area = this.SRUI_getNearestNode('displayForSliderValue')
                    nearest_display_area.nodeValue = slider_value.toString()
                },
            }),  
        )
    )
}

/* Explain how we want table cells to be styled */

cell_style = {
    verticalAlign: 'top',
    padding: '1em',
    backgroundColor: 'Green'
}

/* Create the page */

body = BODY({},
    PARAGRAPH({style: {}}, TEXT_NODE({text: "Here's some sliders for you: "})),
    PARAGRAPH_SLIDER({min: -5, value: 0, max: 5, style: {width: "160px"}}),
    PARAGRAPH_SLIDER({min: -5, value: 0, max: 5, style: {width: "160px"}}),
    PARAGRAPH({}, TEXT_NODE({text: "And here's a button: "})),
    DIV({},
        BUTTON({
            text: "I'm a button",
            onclick: function() {
                let output_field = this.SRUI_getNearestNode('outputField')
                console.log(output_field)
                output_field.SRUI_appendChild(
                    TEXT_NODE({text: "You clicked the button!"}), BREAK({})
                )
            }
        }),
        PARAGRAPH({SRUI_name: 'outputField'})
    ),
    PARAGRAPH({}, TEXT_NODE({text: "Finally, a table for you. Try clicking on the elements!"})),
    TABLE({
            style: {textAlign: "center"},
            forEachGrandchild: (cell) => {
                SRUI_applyStyle(cell, cell_style)
                cell.onclick = function() {
                    this.SRUI_remove()
                }
            }
        },
        TABLE_ROW({},
            TABLE_DATA_CELL({}, TEXT_NODE({"text": "1"})),
            TABLE_DATA_CELL({}, TEXT_NODE({"text": "2"})),
            TABLE_DATA_CELL({}, TEXT_NODE({"text": "3"})),
        ),
        TABLE_ROW({},
            TABLE_DATA_CELL({}, TEXT_NODE({"text": "4"})),
            TABLE_DATA_CELL({}, TEXT_NODE({"text": "5"})),
            TABLE_DATA_CELL({}, TEXT_NODE({"text": "6"})),
        ),
    ),
)