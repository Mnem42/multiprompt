/**
 * @module builder
 *
 * Defines {@link PromptBuilder}
 */
import { ControlOrInput } from "./controls";
import { Control, ControlWithSubscriber, Input, Prompt, Subscriber } from "./core";
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
export declare class PromptBuilder<K extends PropertyKey | never = never> {
    readonly title: string;
    readonly container: HTMLElement;
    readonly controls: ControlOrInput<K>[];
    readonly subscribers: Subscriber<K>[];
    /**
     * The height for the prompt in %
     *
     * @see PromptBuilder.with_height
     */
    height: number;
    /**
     * Constructs a new builder.
     *
     * You should prefer using {@link Mod.new_builder} since it provides the container element
     * for you.
     *
     * @param title The title for the prompt
     * @param container The container to put the prompt in when built
     */
    constructor(title: string, container: HTMLElement);
    /**
     * Sets the height of a prompt in %
     *
     * @param height The new aspect height
     */
    with_height(height: number): this;
    /**
     * Adds a subscriber.
     *
     * Subscribers are callbacks that are run every time an input changes.
     *
     * @see Subscriber
     * @param subscriber
     */
    add_subscriber(subscriber: Subscriber<K>): PromptBuilder<K>;
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
    add_input<NK extends PropertyKey>(k: NK, input: Input<unknown>): PromptBuilder<K | NK>;
    /**
     * Adds an arbitrary {@link Control} or {@link ControlWithSubscriber} to the prompt.
     *
     * If provided a {@link ControlWithSubscriber}, adds its subscriber to the list of subscribers.
     *
     * @param control The control to add
     */
    add_control(control: Control<void> | ControlWithSubscriber<void, K>): this;
    /**
     * Helper to add a {@link TextInput}
     *
     * @param key The key in the data
     * @param label The visual label for the input
     * @param default_v The default value for the input
     */
    text_input<NK extends PropertyKey>(key: NK, label: string, default_v?: string): PromptBuilder<K | NK>;
    /**
     * Helper to add a {@link NumberInput}
     *
     * @param key The key in the data
     * @param label The visual label for the input
     * @param default_v The default value for the input
     */
    numeric_input<NK extends PropertyKey>(key: NK, label: string, default_v?: number): PromptBuilder<K | NK>;
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
    dir_input<NK extends PropertyKey>(k: NK, label: string): PromptBuilder<K | NK>;
    /** Inserts a horizontal rule. */
    hr(): PromptBuilder<K>;
    /**
     * Adds a header.
     *
     * @param text The text to have in the header
     * @param size The header size (in em)
     */
    header(text: string, size?: number): PromptBuilder<K>;
    /** Builds this into a prompt which can then be used **/
    build(): Prompt<K>;
}
