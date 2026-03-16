import { Input } from "./core"

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

export class ToggleInput extends Input<boolean> {
    button: HTMLButtonElement | null = null

    public build(): HTMLElement {
        const button = document.createElement("button")
        button.innerText = this._value ? "YES" : "NO"
        button.dataset.enabled = this._value.toString()

        button.style.flex = "2"
        button.classList.add("mp_toggle")
        button.onclick = () => {
            this._value = !this._value;
            button.dataset.enabled = this._value.toString()
            button.innerText = this._value ? "YES" : "NO"
        }
        
        this.button = button
        return button
    }

    public is_valid(): boolean {
        return this.button?.validity.valid ?? false
    }
}

