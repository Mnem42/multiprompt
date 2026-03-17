import { NumberInput, SelectInput, TextInput, ToggleInput } from "./controls"
import { UI } from "./ui"

runAfterLoad(async () => {
    const manager = new UI()

    const prompt = manager.new_prompt(
        "Thing",
        {
            a: new TextInput("A", ""),
            b: new NumberInput("B", 2763),
            t: new ToggleInput("Toggle", false, { true_text: "Y", false_text: "N" }),
            s: new SelectInput("Select", 12, new Map([
                ["A", 12],
                ["B", 42],
                ["C", 2763]
            ]))
        }
    )

    prompt.get()
        .then(x => console.log(x))
        .catch(e => console.log("cancelled", e))
})