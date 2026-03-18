import { Input, InputArgs, InputOptArgs, NonInputControl } from "./core"

export type Control<K> = [K, Input<unknown>] | NonInputControl<unknown>

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
        // eslint-disable-next-line no-unused-labels
        dbg_assert: if (!this.input_elem)
            throw new Error("Attempt to get control value before build")

        return this.input_elem.value
    }
}

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
        // eslint-disable-next-line no-unused-labels
        dbg_assert: if (!this.input_elem)
            throw new Error("Attempt to get control value before build")

        return parseInt(this.input_elem.value)
    }
}

type ToggleInputArgs = {
    true_text?: string,
    false_text?: string
}

export class ToggleInput extends InputOptArgs<boolean, ToggleInputArgs> {
    button: HTMLButtonElement | null = null

    public build(): HTMLElement {
        const true_text = this.args.true_text ?? "YES"
        const false_text = this.args.false_text ?? "NO"

        const button = document.createElement("button")
        button.innerText = this._value ? true_text : false_text
        button.dataset.enabled = this._value.toString()

        button.style.flex = "2"
        button.classList.add("mp_toggle")
        button.onclick = () => {
            this._value = !this._value;
            button.dataset.enabled = this._value.toString()
            button.innerText = this._value ? true_text : false_text
        }
        
        this.button = button
        return button
    }

    public is_valid(): boolean {
        return this.button?.validity.valid ?? false
    }
}

export class SelectInput<T> extends InputArgs<T, Map<string, T>> {
    public build() {
        if (!this.args.values().find(x => x == this._value)) {
            console.warn(
                "The default value provided is not selectable by the user. " +
                "You really shouldn't do that, since it's kinda shit for UX.",
                "\ndefault:", this._value,
                "\noption map:", this.args
            )
        }

        const container = document.createElement("div")
        container.classList.add("mp_select_set")

        for (const [k, v] of this.args.entries()) {
            const elem = document.createElement("span")
            elem.innerText = k

            if (this._value == v) {
                elem.dataset.selected = "true"
            }

            elem.onclick = () => {
                this._value = v

                for (const x of container.children) {
                    (x as HTMLElement).dataset.selected = "false"
                }

                elem.dataset.selected = "true"
            }

            container.append(elem)
        }

        return container
    }
}

type Direction = "up" | "down" | "left" | "right"

export class DirInput extends Input<Direction> {
    readonly inner: SelectInput<Direction>

    constructor(label: string, default_v: Direction) {
        super(label, default_v)

        this.inner = new SelectInput(
            label,
            default_v,
            new Map([
                ["↑", "up"],
                ["↓", "down"],
                ["←", "left"],
                ["→", "right"]
            ])
        )
    }

    public build(): HTMLElement {
        return this.inner.build()
    }
}

export class HorizontalRule extends NonInputControl<void> {
    constructor() {
        super()
    }
    
    build(): HTMLElement {
        return document.createElement("hr")   
    }
}