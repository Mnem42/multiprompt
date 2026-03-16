/* eslint-disable no-unused-labels */
export abstract class Input<T> {
    readonly label: string
    _value: T

    constructor(label: string, default_v: T) {
        this.label = label
        this._value = default_v
    }
    public abstract build(): HTMLElement

    public is_valid(): boolean { return true }
    public set value(v: T) { this._value = v }
}

export class Prompt<I extends Record<string, Input<unknown>>> {
    inputs: I
    container: HTMLElement
    title: string
    built: boolean = false

    prompt_parent: HTMLElement | null = null
    confirm_btn:   HTMLElement | null = null
    close_btn:     HTMLElement | null = null

    constructor(title: string, inputs: I, container: HTMLElement) {
        this.title = title
        this.inputs = inputs
        this.container = container
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

        for (const input of Object.values(this.inputs)) {
            const label = document.createElement("div")
            label.innerText = input.label

            input_container.append(label, input.build())
        }

        this.built = true
        this.container.appendChild(this.prompt_parent)

        return this.prompt_parent
    }

    public async get(): Promise<I> {
        if (!this.built) {
            this.build()
        }

        dbg_assert: if (this.prompt_parent === null) throw new Error("wtf")

        this.prompt_parent.style.display = "block"

        return new Promise<I>((resolve, reject) => {
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