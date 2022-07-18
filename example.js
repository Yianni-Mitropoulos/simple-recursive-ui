new $body()
.append(
    new $verticalList(100, 10, 10) // width=500, padding=10, gap=10
    .append(
        new $paragraph("Hello world!")
        .style({background: 'Blue'})
    )
    .append(
        new $paragraph("Hello world! This is some text.")
        .style({background: 'Purple'})
    )
    .style({background: 'Green'})
    .setPadding(10)
)
.style({background: 'Red'})
.finish()