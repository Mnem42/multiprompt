/**
 * @module preview
 *
 * Defines previews which can either be stuck to the bottom of a prompt or used as normal controls.
 */
import {Control, ControlWithSubscriber, Subscriber} from "./core"

export type RenderCallback<K> = (ctx: CanvasRenderingContext2D, value: Map<K, unknown>) => void;

export class CanvasPreview<K extends PropertyKey> extends ControlWithSubscriber<void, K> {
    readonly render: RenderCallback<K>
    ctx: CanvasRenderingContext2D | null = null

    constructor(render: RenderCallback<K>) {
        super()
        this.render = render
    }

    build(): HTMLElement {
        const canvas = document.createElement("canvas")
        this.ctx = canvas.getContext("2d")
        return canvas
    }

    subscriber(v: Map<K, unknown>): void {
        if (this.ctx !== null) this.render(this.ctx, v)
    }
}
