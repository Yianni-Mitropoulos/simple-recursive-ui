new $body()
.append(
    /* First part */
    new $verticalList(500, 10, 10) // width=500, padding=10, gap=10
    .append(
        new $paragraph("Hello world!", undefined)
        .style({background: 'Blue'})
    )
    .append(
        new $paragraph("Hello world! This is some text.", 150)
        .style({background: 'Purple'})
    )
    .style({background: 'Green'})
    /* Second part */
    .append(
        new $verticalList(undefined, 10, 10) // width=500, padding=10, gap=10
        .append(
            new $paragraph("Hello world!")
            .style({background: 'Blue'})
        )
        .append(
            new $paragraph("Hello world! This is some text.", 150)
            .style({background: 'Purple'})
        )
        .style({background: 'LightGreen'})
    )
)
.style({background: 'Red'})
.finish()