import { Control, HorizontalRule, NumberInput, TextInput } from "./controls";
import { Input, Prompt } from "./core";


export class PromptBuilder<K extends PropertyKey | never = never> {
    readonly title: string
    readonly container: HTMLElement
    inputs: Control<K>[]

    constructor(title: string, container: HTMLElement) {
        this.title = title
        this.container = container
        this.inputs = []
    }

    text_input<NK extends PropertyKey>(key: NK, label: string, default_v: string):
        PromptBuilder<K | NK>
    {
        return this.add_input(key, new TextInput(label, default_v))
    }

    numeric_input<NK extends PropertyKey>(key: NK, label: string, default_v: number):
        PromptBuilder<K | NK>
    {
        return this.add_input(
            key,
            new NumberInput(label, default_v)
        )
    }

    add_input<NK extends PropertyKey>(k: NK, input: Input<unknown>): PromptBuilder<K | NK> {
        this.inputs.push([k as unknown as K, input])
        return this as PromptBuilder<K | NK>
    }

    hr(): PromptBuilder<K> {
        this.inputs.push(new HorizontalRule)
        return this
    }

    build(): Prompt<K> {
        return new Prompt(this.title, this.inputs, this.container)
    }
}