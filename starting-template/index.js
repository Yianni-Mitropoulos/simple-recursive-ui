CSS_DO([
    ['body', {
        fontFamily: "Work Sans",
        lineHeight: "170%", // 20px
        letterSpacing: "0.5px"
    }]
])

SRUI_body = new VerticalList(
    ['setTagName', 'body'],
    ['setBackgroundColor', 'red']
)