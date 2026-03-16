import { NumberInput, TextInput, ToggleInput } from "./controls"
import { UI } from "./ui"

runAfterLoad(async () => {
    const manager = new UI()

    const prompt = manager.new_prompt(
        "Thing",
        {
            a: new TextInput("A", ""),
            b: new NumberInput("B", 2763),
            t: new ToggleInput("Toggle", false)
        }
    )

    prompt.get()
        .then(x => console.log(x))
        .catch(e => console.log("cancelled", e))
})