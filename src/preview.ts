/**
 * @module preview
 *
 * Defines previews which can either be stuck to the bottom of a prompt or used as normal controls.
 */
import {Control, ControlWithSubscriber, Subscriber} from "./core"

export type RenderCallback<K> = (
    ctx: CanvasRenderingContext2D,
    value: Map<K, unknown>,
    canvas: HTMLCanvasElement
) => void;

export class CanvasPreview<K extends PropertyKey> extends ControlWithSubscriber<void, K> {
    readonly render: RenderCallback<K>
    ctx: CanvasRenderingContext2D | null = null
    canvas: HTMLCanvasElement | null = null

    width: number = 300
    height: number = 150

    constructor(render: RenderCallback<K>) {
        super()
        this.render = render
    }

    build(): HTMLElement {
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.canvas.width = this.width
        this.canvas.height = this.height

        return this.canvas
    }

    subscriber(v: Map<K, unknown>): void {
        if (this.ctx !== null && this.canvas !== null)
            this.render(this.ctx, v, this.canvas)
    }

    /**
     * Sets the canvas width and height attributes.
     *
     * Modifies the already built canvas if this is run after {@link CanvasPreview.build}
     *
     * @param width The new width
     * @param height The new height
     */
    public with_resolution(width: number, height: number): this {
        this.width = width
        this.height = height

        if (this.canvas !== null) {
            this.canvas.width = width
            this.canvas.height = height
        }

        return this
    }
}
