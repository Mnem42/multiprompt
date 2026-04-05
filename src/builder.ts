/**
 * @module builder
 *
 * Defines {@link PromptBuilder}
 */

import {ControlOrInput, dir_input, Header, HorizontalRule, NumberInput, TextInput} from "./controls";
import {Input, Prompt, Subscriber} from "./core";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Mod } from "./mod"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SelectInput } from "./controls"

/**
 * A builder for a {@link Prompt}. This is the much nicer API compared to directly constructing
 * {@link Prompt}, but the intended way to get one of these is to use {@link Mod.new_builder}
 *
 * @example
 * ```ts
 * const prompt = new PromptBuilder("Example prompt", container)
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
    readonly controls: ControlOrInput<K>[] = []
    readonly subscribers: Subscriber<K>[] = []

    /**
     * Constructs a new builder.
     *
     * You should prefer using {@link Mod.new_builder} since it provides the container element
     * for you.
     *
     * @param title The title for the prompt
     * @param container The container to put the prompt in when built
     */
    constructor(title: string, container: HTMLElement) {
        this.title = title
        this.container = container
    }

    /**
     * Adds a subscriber.
     *
     * Subscribers are callbacks that are run every time an input changes.
     *
     * @see Subscriber
     * @param subscriber
     */
    add_subscriber(subscriber: Subscriber<K>): PromptBuilder<K> {
        this.subscribers.push(subscriber)
        return this
    }

    /**
     * Adds an arbitrary input.
     *
     * You should prefer the more specialised functions like
     * {@link text_input} and {@link numeric_input} unless they aren't defined for the specific
     * type of input.
     *
     * @param k
     * @param input
     */
    add_input<NK extends PropertyKey>(k: NK, input: Input<unknown>): PromptBuilder<K | NK> {
        this.controls.push([k as unknown as K, input])
        return this as PromptBuilder<K | NK>
    }

    /**
     * Helper to add a {@link TextInput}
     *
     * @param key The key in the data
     * @param label The visual label for the input
     * @param default_v The default value for the input
     */
    text_input<NK extends PropertyKey>(key: NK, label: string, default_v: string = ""):
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
    numeric_input<NK extends PropertyKey>(key: NK, label: string, default_v: number = 0):
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
        this.controls.push([k as unknown as K, dir_input(label)])
        return this as PromptBuilder<K | NK>
    }

    /** Inserts a horizontal rule. */
    hr(): PromptBuilder<K> {
        this.controls.push(new HorizontalRule)
        return this
    }

    /**
     * Adds a header.
     *
     * @param text The text to have in the header
     * @param size The header size (in em)
     */
    header(text: string, size: number = 1.5): PromptBuilder<K> {
        this.controls.push(new Header(text, size))
        return this
    }

    /** Builds this into a prompt which can then be used **/
    build(): Prompt<K> {
        return new Prompt(this.title, this.controls, this.subscribers, this.container)
    }
}