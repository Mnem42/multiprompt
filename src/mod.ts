// @ts-expect-error esbuild bundles this
import STYLE from "../assets/style.css"
import { PromptBuilder } from "./builder";

/**
 * The singleton managing the mod inserting itself into the DOM.
 */
export class Mod {
    prompt_container: HTMLElement

    constructor() {
        const style_elem = document.createElement("style")
        style_elem.innerHTML = STYLE
        document.head.appendChild(style_elem)

        this.prompt_container = document.getElementById("gameDiv") as HTMLElement
    }

    /**
     * Returns a new {@link PromptBuilder} with the parent provided.
     *
     * You should prefer this over directly constructing a {@link PromptBuilder} because it
     * manages providing the container element for you.
     */
    public new_builder(title: string): PromptBuilder {
        return new PromptBuilder(title, this.prompt_container)
    }
}