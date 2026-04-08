/**
 * @module controls
 *
 * The module which implements controls.
 */
import { Input, InputOptArgs, Control } from "../core";
export { SelectOptions, SelectBuilder, SelectInput, dir_input } from "./select";
/**
 * Convenience alias for something which can either be a key-input pair or just a control.
 *
 * @ignore @internal
 */
export type ControlOrInput<K> = [K, Input<unknown>] | Control<unknown>;
/** An input for text */
export declare class TextInput extends Input<string> {
    input_elem: HTMLInputElement | null;
    build(on_input: () => void): HTMLElement;
    get value(): string;
}
/** A numeric input */
export declare class NumberInput extends Input<number> {
    input_elem: HTMLInputElement | null;
    build(on_input: () => void): HTMLElement;
    is_valid(): boolean;
    get value(): number;
}
/** Arguments for a {@link ToggleInput} */
export type ToggleInputArgs = {
    /** The text to display when the value is `true` */
    true_text?: string;
    /** The text to display when the value is `false` */
    false_text?: string;
};
/** An input that can be toggled */
export declare class ToggleInput extends InputOptArgs<boolean, ToggleInputArgs> {
    button: HTMLButtonElement | null;
    build(on_input: () => void): HTMLElement;
    is_valid(): boolean;
}
/** A horizontal rule */
export declare class HorizontalRule extends Control<void> {
    constructor();
    build(): HTMLElement;
}
/** A header */
export declare class Header extends Control<string> {
    size: number;
    /**
     * Constructs a header
     *
     * @param text The text to have
     * @param size The size for the header (in em)
     */
    constructor(text: string, size: number);
    build(): HTMLElement;
}
