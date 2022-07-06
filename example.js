/* Define a combined TextNode and Slider component that displays the value of the slider */

function TEXT_BEFORE_SLIDER(obj) {
    min   = obj["min"]
    value = obj["value"]
    max   = obj["max"]
    return DIV({style: {width: "160px"}},
        PARAGRAPH({style: {float: 'left'}},
            TEXT_NODE({
                text: "0",
                SRUI_name: "displayForSliderValue"
            })
        ),
        SLIDER({
            min: min,
            value: value,
            max: max,
            style: {float: 'right', marginTop: '17px'},
            oninput: function () {
                let slider_value = this.value
                let nearest_display_area = this.SRUI_getNearestNode('displayForSliderValue')
                nearest_display_area.nodeValue = slider_value.toString()
            },
        }),
        CLEAR_FLOATS({})
    )
}

/* Create the page */

body = BODY({},
    PARAGRAPH({}, TEXT_NODE({text: "Here's some sliders for you: "})),
    TEXT_BEFORE_SLIDER({min: -5, value: 0, max: 5}),
    TEXT_BEFORE_SLIDER({min: -5, value: 0, max: 5}),
    PARAGRAPH({}, TEXT_NODE({text: "And here's a button: "})),
    DIV({},
        BUTTON({
            text: "I'm a button",
            onclick: function() {
                let output_field = this.SRUI_getNearestNode('outputField')
                output_field.append(
                    TEXT_NODE({text: "You clicked the button!"}), BREAK({})
                )
            }
        }),
        PARAGRAPH({SRUI_name: 'outputField'})
    ),
    PARAGRAPH({}, TEXT_NODE({text: "Finally, a table for you. Try clicking on the elements!"})),
    TABLE({style: {textAlign: "center"}, SRUI_name: "tableWithDeletionFunctionality"},
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
    )
)

/* Style the table and add event handlers to each of its cells */

cell_style = {
    verticalAlign: 'top',
    padding: '1em',
    backgroundColor: 'Green'
}

body.SRUI_namedUndernodes["tableWithDeletionFunctionality"].forEach((table) => {
    table.SRUI_forEach((row) => {
        row.SRUI_forEach((cell) => {
            SRUI_apply_style(cell, cell_style)
            cell.onclick = function() {
                this.SRUI_remove()
                console.log(body.SRUI_namedUndernodes)
            }
        })
    })
})