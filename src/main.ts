import { Mod } from "./mod"

export * as core from "./core"
export * as builder from "./builder"
export * as controls from "./controls"
export * as preview from "./preview"

declare global {
    /** The mod's global state */
    let multiprompt: Mod

    interface Window {
        /** The mod's global state */
        multiprompt: Mod
    }
}

runAfterLoad(() => {
    window.multiprompt = new Mod()
})
