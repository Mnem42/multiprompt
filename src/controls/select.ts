import { InputArgs } from "../core"

type SelectOptions = { colour?: string }
type SelectArgs<K, T> = [K, T, SelectOptions][]

export class SelectInput<K extends string, T> extends InputArgs<T, SelectArgs<K, T>> {
    public build(): HTMLElement {
        const container = document.createElement("div")
        container.classList.add("mp_select_set")

        for (const [k, v, opts] of this.args) {
            const elem = document.createElement("span")
            elem.innerText = k
            
            if (opts.colour) elem.style.color = opts.colour

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

export class SelectBuilder<T, K extends string = never> {
    inputs: SelectArgs<K, T> = []
    default_key?: K = undefined
    readonly label: string

    constructor(label: string) {
        this.label = label
    }

    add_option<NK extends string>(key: NK, value: T, options?: SelectOptions):
        SelectBuilder<T, K | NK>
    {
        this.inputs.push([key as unknown as K, value, options ?? {}])
        return this
    }

    set_default(default_key: K): SelectBuilder<T, K> {
        this.default_key = default_key
        return this
    }

    build(): SelectInput<K, T> {
        const default_v = this.inputs.find(x => x[0] == this.default_key)

        return new SelectInput<K, T>(
            this.label,
            default_v?.[1] ?? this.inputs[0][1],
            this.inputs
        )
    }
}

type Direction = "up" | "down" | "left" | "right"

export function dir_input(label: string): SelectInput<Direction, Direction> {
    const v = new SelectBuilder<Direction>(label)

    v.add_option("↑", "up")
    v.add_option("↓", "down")
    v.add_option("←", "left")
    v.add_option("→", "right")

    return v.build()
}