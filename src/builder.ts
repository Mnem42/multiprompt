import { HorizontalRule, NumberInput, SelectInput, TextInput } from "./controls";
import { Input, NonInputControl, Prompt } from "./core";

type Control = [PropertyKey, Input<unknown>] | NonInputControl<unknown>

export class PromptBuilder<K = void> {
    readonly title: string
    readonly container: HTMLElement
    inputs: Control[]

    constructor(title: string, container: HTMLElement) {
        this.title = title
        this.container = container
        this.inputs = []
    }

    text_input<NK extends PropertyKey>(key: NK, label: string, default_v: string):
        PromptBuilder<K | NK>
    {
        this.inputs.push([key, new TextInput(label, default_v)])
        return this
    }

    numeric_input<NK extends PropertyKey>(key: NK, label: string, default_v: number):
        PromptBuilder<K | NK>
    {
        this.inputs.push([key, new NumberInput(label, default_v)])
        return this
    }

    select_input<T, NK extends PropertyKey>(key: NK, label: string, default_v_index: string, values: Map<string, T>):
        PromptBuilder<K | NK>
    {
        this.inputs.push([
            key, 
            new SelectInput(label, values.get(default_v_index), values)
        ])
        return this
    }

    add_input(k: string, input: Input<unknown>): PromptBuilder<K> {
        this.inputs.push([k, input])
        return this
    }

    hr(): PromptBuilder<K> {
        this.inputs.push(new HorizontalRule)
        return this
    }

    build() {
        return new Prompt(this.title, Object.fromEntries(this.inputs), this.container)
    }
}

const test = new PromptBuilder("Thing", document.createElement("div"))
    .text_input("a", "A", "test")
    .numeric_input("b", "B", 2763)
    .hr()
    .select_input(
        "c",
        "Select", 
        "C", 
        new Map([
            ["A", 12],
            ["B", 42],
            ["C", 2763]
        ]
    ))