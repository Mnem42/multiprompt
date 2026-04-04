import STYLE from "../assets/style.css"
import { PromptBuilder } from "./builder";

export class UI {
    prompt_container: HTMLElement

    constructor() {
        const style_elem = document.createElement("style")
        style_elem.innerHTML = STYLE
        document.head.appendChild(style_elem)

        this.prompt_container = document.getElementById("gameDiv") as HTMLElement
    }

    public new_builder(title: string): PromptBuilder {
        return new PromptBuilder(title, this.prompt_container)
    }
}