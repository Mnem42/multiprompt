import { DirInput as dir_input, SelectBuilder } from "./controls"
import { UI } from "./ui"

runAfterLoad(async () => {
    const manager = new UI()

    const selector = new SelectBuilder<number>("thing")
        .add_option("A", 12, { colour: "#FFFF00"})
        .add_option("B", 42)
        .add_option("C", 2763)
        .set_default("C")
        .build()

    const prompt = manager
        .new_builder("Thing")
        .text_input("a", "A", "test")
        .numeric_input("b", "B", 2763)
        .hr()
        .add_input("selection", selector)
        .add_input("direction", dir_input("dir"))
        .build()

    prompt.get()
        .then(x => console.log(x))
        .catch(e => console.log("cancelled", e))
})
