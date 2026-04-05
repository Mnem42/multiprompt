/**
 * @module mod
 *
 * Defines the {@link Mod} singleton, which provides the entry point to the mod.
 */

// @ts-expect-error esbuild bundles this
import STYLE from "../assets/style.css"
import { PromptBuilder } from "./builder";

let mod_inited: boolean = false;

/**
 * The singleton managing the mod inserting itself into the DOM.
 *
 * @exception
 * If an attempt is made to initialize one even though the mod is already inited.
 *
 * @internal
 */
export class Mod {
    prompt_container: HTMLElement

    constructor() {
        if (mod_inited) {
            throw new Error("This is a *SINGLE*ton")
        }

        const style_elem = document.createElement("style")
        style_elem.innerHTML = STYLE
        document.head.appendChild(style_elem)

        this.prompt_container = document.getElementById("gameDiv") as HTMLElement
        mod_inited = true;
    }

    /**
     * Returns a new {@link PromptBuilder} with the parent provided.
     *
     * You should prefer this over directly constructing a {@link PromptBuilder} because it
     * manages providing the container element for you.
     *
     * @example
     * ```js
     * const prompt = multiprompt.new_builder("Example prompt")
     *      .text_input("Text", "")
     *      .dir_input("Direction", "up")
     *      .hr()
     *      .numeric_input("Width", 10)
     *      .build()
     * ```
     */
    public new_builder(title: string): PromptBuilder {
        return new PromptBuilder(title, this.prompt_container)
    }
}