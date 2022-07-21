function BODY(...args) {
    return new VerticalList(
        ['tagName', 'body'],
        ['setInnerWidthMinimum', 800],
        ['setPadding', 0],
        ['setGapBetweenChildren', 0],
        ...args,
    )
}

function HERO_IMAGE() {
    return new VerticalList(
        new Image(
            ['setImageSrc', 'https://loremflickr.com/240/240'],
            ['setInnerWidthDesired', 240],
            ['setAlignment', 1/2],
            ['setInnerHeightMinimum', 240],
            ['applyStyle', {background: 'Green'}],
        ),
        ['setInnerHeightMinimum', 400],
        ['applyStyle', {background: 'Green'}],
    )
}

function NAVBAR(...args) {
    return new VerticalList(
        ['setPadding', 0],
        ['applyStyle', {background: 'Blue'}],
        new HorizontalList(
            ['toggleAppendSide'],
            ['setAlignment', 1/2],
            ['setInnerWidth', 700, 800],
            ['setPadding', 0],
            ['setGapBetweenChildren', 0],
            ['applyStyle', {background: 'Blue'}],
            ['SRUI_forEachChild',
                ['toggleClass', button_CSSC],
                ['addEventListener', 'click', () => {alert('foo')}],
                ['setInnerWidth', 80, 100],
            ],
            ...args,
        )
    )
}

function MAIN(...args) {
    return new VerticalList(
        ['setInnerWidth', 600, 700],
        ['setAlignment', 1/2],
        ['setPadding', 50],
        ['setGapBetweenChildren', 50],
        ...args,
    )
}

function FOOTER(...args) {
    return new HorizontalList(
        ['setInnerWidth', 600, 700],
        ['setAlignment', 1/2],
        ['setPadding', 50],
        ['setGapBetweenChildren', 50],
        ...args,
    )
}

button_CSSC = CSS_CLASS({
    cursor: 'pointer',
    textAlign: 'center',
})

BODY(
    HERO_IMAGE(),
    NAVBAR(
        new Button('B1'),
        new Button('B2'),
        new Button('B3'),
    ),
    MAIN(
        new Text(
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        ),
        new Text(
            `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.`
        ),
    ),
    FOOTER(
        new Text(
            "Left footer section",
        ),
        new Text(
            "Right footer section"
        ),
    )
)