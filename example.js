new VerticalList(
    ['tagName', 'body'],
    ['setInnerWidthMinimum', 900],
    new VerticalList(
        // ['setInnerWidth', 800],
        // ['setOuterWidthMin', 600],
        new Paragraph(
            ['setInnerHTML', 'Hello, world!'],
        ),
        new Paragraph(
            ['setInnerHTML', 'How are you?'],
            ['setInnerWidth', 400],
            ['setAlignment',  1/2],
        )
    ),
    new HorizontalList(
        ['setInnerWidth', 800],
        // ['setOuterWidthMin', 600],
        ['setAlignment', 0.5],
        new Paragraph(
            ['setInnerHTML', 'Hello, world!'],
            // ['setInnerWidth', 100]
        ),
        new Paragraph(
            ['setInnerHTML', 'How are you?'],
            // ['setInnerWidth', 100],
            ['setAlignment', 1]
        )
    ),
)