new VerticalList(
    ['tagName', 'body'],
    ['setOuterWidthMin', 600],
    new VerticalList(
        ['setOuterWidth', 800],
        // ['setOuterWidthMin', 600],
        new Paragraph(
            ['setInnerHTML', 'Hello, world!'],
        ),
        new Paragraph(
            ['setInnerHTML', 'How are you?'],
            ['setOuterWidth', 400],
            ['setAlignment',  1/2],
        )
    ),
    new HorizontalList(
        ['setOuterWidth', 800],
        // ['setOuterWidthMin', 600],
        ['setAlignment', 0.5],
        new Paragraph(
            ['setInnerHTML', 'Hello, world!'],
            ['setOuterWidth', 100]
        ),
        new Paragraph(
            ['setInnerHTML', 'How are you?'],
            ['setOuterWidth', 100],
            ['setAlignment', 1]
        )
    ),
)