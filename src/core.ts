/* eslint-disable no-unused-labels */

import { Control } from "./controls"
import { IsPartial } from "./util"

export abstract class Input<T> {
    /** The label displayed next to the input */
    readonly label: string

    /** The intenral value */
    _value: T

    constructor(label: string, default_v: T) {
        this.label = label
        this._value = default_v
    }

    /** The function that creates the HTML for an input */
    public abstract build(): HTMLElement

    /** Whether an input's current value is valid or not */
    public is_valid(): boolean { return true }

    public set value(v: T) { this._value = v }
    public get value() { return this._value }
}

/** An {@link Input} with arguments */
export abstract class InputArgs<T, A> extends Input<T> {
    readonly args: A

    constructor(label: string, default_v: T, args: A) {
        super(label, default_v)
        this.args = args
    }
}

/** An {@link Input} with arguments which are an object with *only* optional values */
export abstract class InputOptArgs<T, A extends (IsPartial<A> extends true ? object : never)> extends Input<T> {
    readonly args: A

    constructor(label: string, default_v: T, args: A) {
        super(label, default_v)
        this.args = args
    }
}

export abstract class NonInputControl<A> {
    readonly args: A

    constructor(args: A) {
        this.args = args
    }

    public abstract build(): HTMLElement
}

export class Prompt<K extends PropertyKey> {
    controls: Control<K>[]
    inputs: Map<K, Input<unknown>>
    container: HTMLElement
    title: string
    built: boolean = false

    prompt_parent: HTMLElement | null = null
    confirm_btn:   HTMLElement | null = null
    close_btn:     HTMLElement | null = null

    constructor(title: string, controls: Control<K>[], container: HTMLElement) {
        this.title = title
        this.controls = controls
        this.container = container
        this.inputs = new Map(controls.filter(x => Array.isArray(x)))
    }

    public build(): HTMLElement {
        this.prompt_parent = document.createElement("div")
        this.prompt_parent.classList.add("menuParent")
        this.prompt_parent.style.display = "block"

        this.prompt_parent.innerHTML = `
        <div class="mp_screen menuScreen">
            <button class="XButton">-</button>
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

                input_container.append(label, input.build())
            }
            else {
                input_container.append(control.build())
            }
        }

        this.built = true
        this.container.appendChild(this.prompt_parent)

        return this.prompt_parent
    }

    public async get(): Promise<typeof this.inputs> {
        if (!this.built) {
            this.build()
        }

        dbg_assert: if (this.prompt_parent === null) throw new Error("wtf")

        this.prompt_parent.style.display = "block"

        return new Promise<typeof this.inputs>((resolve, reject) => {
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

                const mapped_entries = Object.entries(this.inputs)
                    .map(([k, v]) => [k, v.value])

                resolve(Object.fromEntries(mapped_entries))
            }

            this.close_btn.onclick = () => reject("close")
        }).finally(() => {
            dbg_assert: if(this.prompt_parent === null) throw new Error("wtf")
            this.prompt_parent.style.display = "none"
        })
    }
}  