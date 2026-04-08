/**
 * @module mod
 *
 * Defines the {@link Mod} singleton, which provides the entry point to the mod.
 */
import { PromptBuilder } from "./builder";
/**
 * The singleton managing the mod inserting itself into the DOM.
 *
 * @exception
 * If an attempt is made to initialise one even though the mod is already inited.
 *
 * @internal
 */
export declare class Mod {
    prompt_container: HTMLElement;
    constructor();
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
    new_builder(title: string): PromptBuilder;
}
