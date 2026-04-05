import {Control, dir_input, HorizontalRule, NumberInput, TextInput} from "./controls";
import { Input, Prompt } from "./core";

/**
 * A builder for a {@link Prompt}. This is the much nicer API.
 *
 * @example
 * ```ts
 * const prompt = new PromptBuilder("Example prompt")
 *      .text_input("Text", "")
 *      .dir_input("Direction", "up")
 *      .hr()
 *      .numeric_input("Width", 10)
 *      .build()
 * ```
 */
export class PromptBuilder<K extends PropertyKey | never = never> {
    readonly title: string
    readonly container: HTMLElement
    inputs: Control<K>[]

    constructor(title: string, container: HTMLElement) {
        this.title = title
        this.container = container
        this.inputs = []
    }

    /**
     * Adds an arbitrary input.
     *
     * You should prefer the more specialized functions like
     * {@link text_input} and {@link numeric_input} unless they aren't defined for the specific
     * type of input.
     *
     * @param k
     * @param input
     */
    add_input<NK extends PropertyKey>(k: NK, input: Input<unknown>): PromptBuilder<K | NK> {
        this.inputs.push([k as unknown as K, input])
        return this as PromptBuilder<K | NK>
    }

    /**
     * Helper to add a {@link TextInput}
     *
     * @param key The key in the data
     * @param label The visual label for the input
     * @param default_v The default value for the input
     */
    text_input<NK extends PropertyKey>(key: NK, label: string, default_v: string):
        PromptBuilder<K | NK>
    {
        return this.add_input(key, new TextInput(label, default_v))
    }

    /**
     * Helper to add a {@link NumberInput}
     *
     * @param key The key in the data
     * @param label The visual label for the input
     * @param default_v The default value for the input
     */
    numeric_input<NK extends PropertyKey>(key: NK, label: string, default_v: number):
        PromptBuilder<K | NK>
    {
        return this.add_input(
            key,
            new NumberInput(label, default_v)
        )
    }

    /**
     * Adds a directional input.
     *
     * @remarks
     * This is no different from a {@link SelectInput} with a predefined set of labels and values
     * for each relative direction.
     *
     * @param k The key to assign
     * @param label The label for the input
     */
    dir_input<NK extends PropertyKey>(k: NK, label: string): PromptBuilder<K | NK> {
        this.inputs.push([k as unknown as K, dir_input(label)])
        return this as PromptBuilder<K | NK>
    }

    /** Inserts a horizontal rule. */
    hr(): PromptBuilder<K> {
        this.inputs.push(new HorizontalRule)
        return this
    }

    /** Builds this into a prompt which can then be used **/
    build(): Prompt<K> {
        return new Prompt(this.title, this.inputs, this.container)
    }
}