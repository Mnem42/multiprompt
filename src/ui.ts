import { Input, Prompt } from "./core";
import STYLE from "../assets/style.css"

export class UI {
    prompt_container: HTMLElement

    constructor() {
        const style_elem = document.createElement("style")
        style_elem.innerHTML = STYLE
        document.head.appendChild(style_elem)

        this.prompt_container = document.getElementById("gameDiv") as HTMLElement
    }

    // unknown seems to fuck up type checking, and im too lazy to use something else, seeing as
    // this just forwards the value
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public new_prompt<I extends Record<string, Input<any>>>(title: string, inputs: I): Prompt<I> {
        const prompt = new Prompt(title, inputs, this.prompt_container)
        return prompt
    }
}