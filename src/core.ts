/**
 * @module core
 *
 * The module defining the "core" of the mod (i.e. the general model and the {@link Prompt}) class
 */

import { ControlOrInput } from "./controls"
import { IsPartial } from "./util"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PromptBuilder } from "./builder"

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
export abstract class Input<T> {
    /** The label displayed next to the input */
    readonly label: string

    /** The internal value */
    _value: T

    constructor(label: string, default_v: T) {
        this.label = label
        this._value = default_v
    }

    /**
     * Creates the HTML elements for an input.
     *
     * @param oninput
     * A function that should be run every time the data is updated.
     */
    public abstract build(oninput: () => void): HTMLElement

    /** Whether an input's current value is valid or not */
    public is_valid(): boolean { return true }

    public set value(v: T) { this._value = v }
    public get value() { return this._value }
}

/**
 * An {@link Input} with arguments that are always required.
 *
 * @typeParam T The type the input's value has
 * @see {@link Input}
 * @see {@link InputOptArgs}
 */
export abstract class InputArgs<T, A> extends Input<T> {
    readonly args: A

    constructor(label: string, default_v: T, args: A) {
        super(label, default_v)
        this.args = args
    }
}

/**
 * An {@link Input} where the arguments are an object with *only* optional values.
 *
 * @typeParam T The type the input's value has
 * @see {@link Input}
 * @see {@link InputArgs}
 */
export abstract class InputOptArgs<T, A extends (IsPartial<A> extends true ? object : never)> extends Input<T> {
    readonly args: A

    constructor(label: string, default_v: T, args: A) {
        super(label, default_v)
        this.args = args
    }
}

/**
 * A control that isn't an input.
 *
 * @typeParam T The type for any args the control has
 */
export abstract class Control<A> {
    readonly args: A

    protected constructor(args: A) {
        this.args = args
    }

    public abstract build(): HTMLElement
}

/**
 * A control with a builtin {@link Subscriber}
 *
 * @typeParam A The arguments for the control
 * @typeParam K The property keys for the prompt values
 * @see {@link Control}
 */
export abstract class ControlWithSubscriber<A, K extends PropertyKey> extends Control<A> {
    /**
     * The subscriber callback
     *
     * @param value The prompt's values
     */
    public abstract subscriber(value: Map<K, unknown>): void
}

/**
 * A prompt that can be rendered.
 *
 * If you want to make one, you probably want {@link PromptBuilder}, since it's a much more
 * ergonomic API.
 *
 * @typeParam K The type of the keys for the prompt value map
 */
export class Prompt<K extends PropertyKey> {
    controls: ControlOrInput<K>[]
    inputs: Map<K, Input<unknown>>
    container: HTMLElement
    title: string
    built: boolean = false
    height: number

    prompt_parent: HTMLElement | null = null
    confirm_btn:   HTMLElement | null = null
    close_btn:     HTMLElement | null = null

    subscribers: Subscriber<K>[]

    constructor(
        title: string,
        controls: ControlOrInput<K>[],
        subscribers: Subscriber<K>[],
        container: HTMLElement,
        height: number,
    ) {
        this.title = title
        this.controls = controls
        this.container = container
        this.subscribers = subscribers
        this.height = height

        this.inputs = new Map(controls.filter(x => Array.isArray(x)))
    }

    private get_values(): Map<K, unknown> | null {
        for (const input of Object.values(this.inputs)) {
            if (!input.is_valid()) return null
        }

        const mapped_entries = this.inputs
            .entries()
            .map(([k, v]) => [k, v.value] as const)

        return new Map(mapped_entries)
    }

    build(): HTMLElement {
        this.prompt_parent = document.createElement("div")
        this.prompt_parent.classList.add("menuParent")

        this.prompt_parent.style.display = "block"
        this.prompt_parent.style.minHeight = `${this.height}%`

        this.prompt_parent.innerHTML = `
        <div class="mp_screen menuScreen">
            <button class="XButton"></button>
            <span class="menuTitle" style="color: unset;">${this.title}</span>
            <div class="mp_prompt_inputs menuText" style="padding-top:1em"></div>
            <span class="mp_confirm menuBottomButton promptOK">Confirm</span>
        </div>
        `

        this.confirm_btn = this.prompt_parent.querySelector(".mp_confirm") as HTMLElement
        this.close_btn = this.prompt_parent.querySelector(".XButton") as HTMLElement
        const input_container = this.prompt_parent.querySelector(".menuText") as HTMLElement

        for (const control of Object.values(this.controls)) {
            if (Array.isArray(control)) {
                const input = control[1]

                const label = document.createElement("div")
                label.innerText = input.label

                input_container.append(
                    label,
                    input.build(() => {
                        const values = this.get_values()

                        if (values !== null) {
                            for (const subscriber of this.subscribers) subscriber(values)
                        }
                    })
                )
            }
            else {
                input_container.append(control.build())
            }
        }

        const values = this.get_values()

        if (values === null)
            throw new Error("Invalid input implementation: default values is invalid")

        for (const subscriber of this.subscribers) {
            subscriber(values)
        }

        this.built = true
        this.container.appendChild(this.prompt_parent)

        return this.prompt_parent
    }

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
    public async get(): Promise<Record<K, unknown> | null> {
        if (!this.built) {
            this.build()
        }

        dbg_assert: if (this.prompt_parent === null) throw new Error("wtf")

        this.prompt_parent.style.display = "block"

        return new Promise<Record<K, unknown> | null>((resolve) => {
            dbg_assert: if (
                this.confirm_btn === null ||
                this.close_btn === null ||
                this.prompt_parent === null
            ) {
                throw new Error("wtf")
            }

            this.confirm_btn.onclick = () => {
                for (const input of Object.values(this.inputs)) {
                    if (!input.is_valid()) return
                }

                const mapped_entries = this.inputs
                    .entries()
                    .map(([k, v]) => [k, v.value] as const)

                resolve(Object.fromEntries(mapped_entries) as Record<K, unknown>)
            }

            this.close_btn.onclick = () => resolve(null)
        }).finally(() => {
            dbg_assert: if(this.prompt_parent === null) throw new Error("wtf")
            this.prompt_parent.style.display = "none"
        })
    }
}  