import { Mod } from "./mod"
import { PromptBuilder } from "./builder"

export * as core from "./core"
export * as builder from "./builder"
export * as controls from "./controls"
export * as preview from "./preview"

/**
 * Provides a {@link PromptBuilder}. This is the intended way to get one.
 *
 * @see {@link Mod.new_builder}
 */
export let new_builder: (title: string) => PromptBuilder;

runAfterLoad(() => {
    const manager = new Mod()
    new_builder = manager.new_builder;
})