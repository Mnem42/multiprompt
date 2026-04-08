import { InputArgs } from "../core";
/** Additional options for a select option */
export type SelectOptions = {
    /** The CSS colour for the option */
    colour?: string;
};
type SelectArgs<K, T> = [K, T, SelectOptions][];
/**
 * An input where you can select an input. If you're constructing one, you should probably use
 * {@link SelectBuilder}
 */
export declare class SelectInput<K extends string, T> extends InputArgs<T, SelectArgs<K, T>> {
    build(on_input: () => void): HTMLElement;
}
/** A builder for {@link SelectInput} */
export declare class SelectBuilder<T, K extends string = never> {
    inputs: SelectArgs<K, T>;
    default_key?: K;
    readonly label: string;
    constructor(label: string);
    /**
     * Adds an option
     *
     * @param key The key to add
     * @param value The value that maps to the key
     * @param options The options for the input
     */
    add_option<NK extends string>(key: NK, value: T, options?: SelectOptions): SelectBuilder<T, K | NK>;
    /**
     * Sets a given key as the default
     *
     * @param default_key The key to use as the default
     */
    set_default(default_key: K): SelectBuilder<T, K>;
    /** Builds this into a {@link SelectInput} */
    build(): SelectInput<K, T>;
}
/** A relative direction */
type Direction = "up" | "down" | "left" | "right";
/**
 * A function to easily make a directional input. If you're using a {@link PromptBuilder}, you
 * should use {@link PromptBuilder.dir_input}.
 */
export declare function dir_input(label: string): SelectInput<Direction, Direction>;
export {};
