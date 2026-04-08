/**
 * @module core
 *
 * The module defining the "core" of the mod (i.e. the general model and the {@link Prompt}) class
 */
import { ControlOrInput } from "./controls";
import { IsPartial } from "./util";
/**
 * A callback run every time there's a valid input in a prompt
 *
 * @typeParam K The prompt's keys.
 * @param v The prompt's data
 */
export type Subscriber<K extends PropertyKey> = (v: Map<K, unknown>) => void;
/**
 * An input which can be put into a {@link Prompt}.
 *
 * @typeParam T The type the input's value has
 * @see {@link InputArgs}
 * @see {@link InputOptArgs}
 */
export declare abstract class Input<T> {
    /** The label displayed next to the input */
    readonly label: string;
    /** The internal value */
    _value: T;
    constructor(label: string, default_v: T);
    /**
     * Creates the HTML elements for an input.
     *
     * @param oninput
     * A function that should be run every time the data is updated.
     */
    abstract build(oninput: () => void): HTMLElement;
    /** Whether an input's current value is valid or not */
    is_valid(): boolean;
    set value(v: T);
    get value(): T;
}
/**
 * An {@link Input} with arguments that are always required.
 *
 * @typeParam T The type the input's value has
 * @see {@link Input}
 * @see {@link InputOptArgs}
 */
export declare abstract class InputArgs<T, A> extends Input<T> {
    readonly args: A;
    constructor(label: string, default_v: T, args: A);
}
/**
 * An {@link Input} where the arguments are an object with *only* optional values.
 *
 * @typeParam T The type the input's value has
 * @see {@link Input}
 * @see {@link InputArgs}
 */
export declare abstract class InputOptArgs<T, A extends (IsPartial<A> extends true ? object : never)> extends Input<T> {
    readonly args: A;
    constructor(label: string, default_v: T, args: A);
}
/**
 * A control that isn't an input.
 *
 * @typeParam T The type for any args the control has
 */
export declare abstract class Control<A> {
    readonly args: A;
    protected constructor(args: A);
    abstract build(): HTMLElement;
}
/**
 * A control with a builtin {@link Subscriber}
 *
 * @typeParam A The arguments for the control
 * @typeParam K The property keys for the prompt values
 * @see {@link Control}
 */
export declare abstract class ControlWithSubscriber<A, K extends PropertyKey> extends Control<A> {
    /**
     * The subscriber callback
     *
     * @param value The prompt's values
     */
    abstract subscriber(value: Map<K, unknown>): void;
}
/**
 * A prompt that can be rendered.
 *
 * If you want to make one, you probably want {@link PromptBuilder}, since it's a much more
 * ergonomic API.
 *
 * @typeParam K The type of the keys for the prompt value map
 */
export declare class Prompt<K extends PropertyKey> {
    controls: ControlOrInput<K>[];
    inputs: Map<K, Input<unknown>>;
    container: HTMLElement;
    title: string;
    built: boolean;
    height: number;
    prompt_parent: HTMLElement | null;
    confirm_btn: HTMLElement | null;
    close_btn: HTMLElement | null;
    subscribers: Subscriber<K>[];
    constructor(title: string, controls: ControlOrInput<K>[], subscribers: Subscriber<K>[], container: HTMLElement, height: number);
    private get_values;
    build(): HTMLElement;
    /**
     * Gets the values in the prompt
     *
     * Returns successfully with the input values if the confirm button was pressed. Returns `null`
     * if the prompt was closed without confirming.
     *
     * @example
     * ```js
     * let prompt = new PromptBuilder("Test prompt")
     *      .text_input("a", "A")
     *      .numeric_input("b", "B", 12)
     *      .build()
     *
     * const data = await prompt.get()
     * console.log("Prompt data:", data)
     * ```
     */
    get(): Promise<Record<K, unknown> | null>;
}
