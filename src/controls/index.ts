/**
 * @module controls
 *
 * The module which implements controls.
 */

import { Input, InputOptArgs, Control } from "../core"
export * from "./select"

/**
 * @ignore
 * @internal
 */
export type ControlOrInput<K> = [K, Input<unknown>] | Control<unknown>

/** An input for text */
export class TextInput extends Input<string> {
    input_elem: HTMLInputElement | null = null

    public build(): HTMLElement {
        this.input_elem = document.createElement("input")
        this.input_elem.value = this._value

        this.input_elem.style.flex = "2"
        this.input_elem.classList.add("mp_input")
        
        return this.input_elem
    }

    get value() {
        dbg_assert: if (!this.input_elem)
            throw new Error("Attempt to get control value before build")

        return this.input_elem.value
    }
}

/** A numeric input */
export class NumberInput extends Input<number> {
    input_elem: HTMLInputElement | null = null

    public build(): HTMLElement {
        this.input_elem = document.createElement("input")

        this.input_elem.value = this._value.toString()
        this.input_elem.inputMode = "numeric"
        this.input_elem.pattern = "[0-9]*"

        this.input_elem.style.flex = "2"
        this.input_elem.classList.add("mp_input")
        
        return this.input_elem
    }

    public is_valid(): boolean {
        return this.input_elem?.validity.valid ?? false
    }

    get value() {
        dbg_assert: if (!this.input_elem)
            throw new Error("Attempt to get control value before build")

        return parseInt(this.input_elem.value)
    }
}

/** Arguments for a {@link ToggleInput} */
type ToggleInputArgs = {
    /** The text to display when the value is `true` */
    true_text?: string,
    /** The text to display when the value is `false` */
    false_text?: string
}

/** An input that can be toggled */
export class ToggleInput extends InputOptArgs<boolean, ToggleInputArgs> {
    button: HTMLButtonElement | null = null

    public build(): HTMLElement {
        const true_text = this.args.true_text ?? "YES"
        const false_text = this.args.false_text ?? "NO"

        const button = document.createElement("button")
        button.innerText = this.value ? true_text : false_text
        button.dataset.enabled = this.value.toString()

        button.style.flex = "2"
        button.classList.add("mp_toggle")
        button.onclick = () => {
            this.value = !this.value;
            button.dataset.enabled = this.value.toString()
            button.innerText = this.value ? true_text : false_text
        }
        
        this.button = button
        return button
    }

    public is_valid(): boolean {
        return this.button?.validity.valid ?? false
    }
}

/** A horizontal rule */
export class HorizontalRule extends Control<void> {
    constructor() {
        super()
    }
    
    build(): HTMLElement {
        const elem = document.createElement("hr")
        elem.classList.add("mp_hr")
        return elem
    }
}

/** A header */
export class Header extends Control<string> {
    size: number

    /**
     * Constructs a header
     *
     * @param text The text to have
     * @param size The size for the header (in em)
     */
    constructor(text: string, size: number) {
        super(text)
        this.size = size
    }

    build(): HTMLElement {
        const elem = document.createElement("h2")
        elem.innerText = this.args
        elem.style.fontSize = `${this.size}em`
        elem.classList.add("mp_header")
        return elem
    }
}