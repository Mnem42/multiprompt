import { dir_input, SelectBuilder } from "./controls"
import { Mod } from "./mod"

export * as core from "./core"
export * as builder from "./builder"
export * as controls from "./controls"

declare global {
    /** The mod's global state */
    let multiprompt: Mod

    interface Window {
        /** The mod's global state */
        multiprompt: Mod
    }
}

runAfterLoad(async () => {
    multiprompt = new Mod()

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
        console.log("A:", v.get("a")?.value as string)
    }
})
