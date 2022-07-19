new Body()
.append(
    new VerticalList(800, 10) // width=500, padding=10, gap=10
    .append(
        new Paragraph("Hello world!")
        .style({background: 'Blue'})
        .setAlignment(0)
    )
    .append(
        new Paragraph("How are you?")
        .style({background: 'Blue'})
        .setAlignment(0)
        .setPadding(20)
    )
    .append(
        new Paragraph("Lol...")
        .style({background: 'Blue'})
        .setAlignment(1)
        .setOuterWidthTarget(500)
    )
    .append(
        new HorizontalList(800, 10)
        .append(
            new Paragraph("Lol...")
            .style({background: 'Blue'})
            .setOuterWidthTarget(100)
            .setAlignment(1)
        )
        .append(
            new Paragraph("Here's a decent amount of text...")
            .style({background: 'Blue'})
            .setOuterWidthTarget(100)
            .addEventListener('click', () => {
                alert("This is an alert")
            })
        )
        .style({background: 'LightBlue'})
        .setAlignment(1/2)
        .setPadding(20)
        .rigidify()    
    )    
    .style({background: 'Green'})
    .setAlignment(1/2)
    .setPadding(20)
    .rigidify()
)
.append(
    new HorizontalList(800, 10)
    .append(
        new Paragraph("Lol...")
        .style({background: 'Blue'})
        .setOuterWidthTarget(100)
        .setAlignment(1)
    )
    .append(
        new Paragraph("Here's a decent amount of text...")
        .style({background: 'Blue'})
        .setOuterWidthTarget(100)
        .addEventListener('click', () => {
            alert("This is an alert")
        })
    )
    .style({background: 'Green'})
    .setAlignment(1/2)
    .setPadding(20)
    .rigidify()    
)
.style({background: 'Red'})
.setPadding(20)
.setGapBetweenChildren(20)
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