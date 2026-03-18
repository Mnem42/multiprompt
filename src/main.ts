import { UI } from "./ui"

runAfterLoad(async () => {
    const manager = new UI()

    const prompt = manager
        .new_builder("Thing")
        .text_input("a", "A", "test")
        .numeric_input("b", "B", 2763)
        .hr()
        .select_input(
            "c",
            "Select", 
            "C", 
            new Map([
                ["A", 12],
                ["B", 42],
                ["C", 2763]
            ]
        ))
        .build()

    prompt.get()
        .then(x => console.log(x))
        .catch(e => console.log("cancelled", e))
})