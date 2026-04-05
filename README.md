# Multiprompt

A mod for making "fancy" prompts for sandboxels in a reasonably ergonomic and simple way.

## Example
```js
const selector = new SelectBuilder<number>("thing")
    .add_option("A", 12, { colour: "#FFFF00"})
    .add_option("B", 42)
    .add_option("C", 2763)
    .set_default("C")
    .build()

const prompt = multiprompt
    .new_builder("Thing")
    .text_input("a", "A", "test")
    .numeric_input("b", "B", 2763)
    .hr()
    .header("Header")
    .add_input("selection", selector)
    .add_input("direction", dir_input("dir"))
    .dir_input("direction2", "Direction B")
    .build()

const v = await prompt.get()

if (v !== null) {
    console.log("Prompt data:", v)
}
else {
    console.log("Prompt closed")
}