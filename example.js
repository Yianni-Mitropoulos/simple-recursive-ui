new Body()
.append(
    new VerticalList(500, 500) // width=500, padding=10, gap=10
    .append(
        new Paragraph(200, 200, "Hello world!")
        .style({background: 'Blue'})
        .setAlignment(0)
        .setPadding(20)
    )
    .style({background: 'Green'})
    .setAlignment(1/2)
    .setPadding(20)
)
.style({background: 'Red'})
.setPadding(20)
.finish()

    /*
    .append(
        new $paragraph("Hello world! This is some text.")
        .style({background: 'Purple'})
    )
    .append(
        new $verticalList() // width=500, padding=10, gap=10
        .append(
            new $paragraph("Hello world!")
            .style({background: 'Blue'})
        )
        .append(
            new $paragraph("Hello world! This is some text.")
            .style({background: 'Purple'})
        )
        .style({background: 'LightGreen'})
    )*/