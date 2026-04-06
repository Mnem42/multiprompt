/**
 * @module preview
 *
 * Defines previews which can either be stuck to the bottom of a prompt or used as normal controls.
 */
import {ControlWithSubscriber} from "./core"

/**
 * A callback that can be used for rendering a {@link CanvasPreview}
 *
 * @see CanvasPreview.constructor
 */
export type RenderCallback<K> = (
    ctx: CanvasRenderingContext2D,
    value: Map<K, unknown>,
    canvas: HTMLCanvasElement
) => void;

/**
 * Arguments for setting a {@link CanvasPreview}'s zooming and panning behaviour.
 *
 * @see CanvasPreview.with_zoom
 */
export type ZoomArgs = {
    min_zoom: number;
    max_zoom: number;
    zoom_speed: number;
}

/**
 * Gets you a control with a canvas so you can draw arbitrary things on it.
 *
 * This also provides zooming and panning if you run {@link CanvasPreview.with_zoom} on it.
 */
export class CanvasPreview<K extends PropertyKey> extends ControlWithSubscriber<void, K> {
    readonly render: RenderCallback<K>

    built: boolean = false

    image_rendering: "auto" | "smooth" | "high-quality" | "crisp-edges" | "pixelated" = "pixelated"

    width: number = 300
    height: number = 150
    zoom_args: ZoomArgs | null = null

    ctx: CanvasRenderingContext2D | null = null
    canvas: HTMLCanvasElement | null = null
    values: Map<K, unknown> | null = null

    pan_x: number = 0
    pan_y: number = 0
    current_zoom: number = 1

    /**
     * Constructs a preview
     *
     * @param render The callback to run for redrawing the preview
     */
    constructor(render: RenderCallback<K>) {
        super()
        this.render = render
    }

    build(): HTMLElement {
        // So that this won't ever get changed by accident or deliberately, because that
        // assumption makes it a bit more convenient to code some other bits of code.
        Object.freeze(this.zoom_args)

        const container = document.createElement("div")
        container.classList.add("mp_preview_container")

        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")

        this.canvas.width = this.width
        this.canvas.height = this.height

        this.canvas.style.imageRendering = this.image_rendering

        if (this.zoom_args !== null) {
            const zoom_args = this.zoom_args!

            container.addEventListener("wheel", e => {
                e.preventDefault()

                this.current_zoom += e.deltaY * zoom_args.zoom_speed
                this.current_zoom = Math.min(
                    Math.max(zoom_args.min_zoom, this.current_zoom),
                    zoom_args.max_zoom
                )

                this.pan_x += e.deltaX

                this.redraw()
            })


            let mouse_down = false
            container.addEventListener("mousedown", () => mouse_down = true)
            container.addEventListener("mouseup", () => mouse_down = false)

            container.addEventListener("mousemove", e => {
                if (mouse_down) {
                    e.preventDefault()

                    this.pan_x += e.movementX
                    this.pan_y += e.movementY

                    console.log(this.pan_x, this.pan_y)
                }

                this.redraw()
            })
        }

        this.built = true
        container.appendChild(this.canvas)
        return container
    }

    /**
     * Redraws the canvas based on internal state.
     *
     * The exact things this function does are:
     * 1. Reset the ctx
     * 2. Translate the canvas based on panning
     * 3. Scale the canvas based on zoom
     * 4. Runs the user provided callback
     *
     * @see CanvasPreview.render
     * @see RenderCallback
     */
    private redraw() {
        if (this.ctx && this.values && this.canvas) {
            this.ctx.reset()
            this.ctx.translate(this.pan_x, this.pan_y)
            this.ctx.scale(this.current_zoom, this.current_zoom)
            this.render(this.ctx, this.values, this.canvas)
        }
    }

    subscriber(v: Map<K, unknown>): void {
        this.values ??= v

        if (this.ctx !== null && this.canvas !== null) this.redraw()
    }

    /**
     * Sets the canvas width and height attributes.
     *
     * Modifies the already built canvas if this is run after {@link CanvasPreview.build}.
     *
     * @param width The new width
     * @param height The new height
     *
     * @see HTMLCanvasElement.width
     * @see HTMLCanvasElement.height
     */
    with_resolution(width: number, height: number): this {
        this.width = width
        this.height = height

        if (this.canvas !== null) {
            this.canvas.width = width
            this.canvas.height = height
        }

        return this
    }

    /**
     * Sets arguments for zoom.
     *
     * @param args The arguments to provide
     * @param args.min_zoom The minimum zoom level (default: 0.5x)
     * @param args.max_zoom The maximum zoom level (default: 2x)
     * @param args.zoom_speed The speed of zooming (default: 0.05)
     *
     * @param preserve
     * If the prompt is already built and this isn't set to `true`, zeroes out the current pan and
     * zoom numbers.
     *
     * @see ZoomArgs
     */
    with_zoom(args: Partial<ZoomArgs> = {}, preserve: boolean = false): this {
        if (this.built && !preserve) {
            this.pan_x = 0
            this.pan_y = 0
            this.current_zoom = 0
        }

        this.zoom_args = {
            min_zoom: args.min_zoom ?? 0.5,
            max_zoom: args.max_zoom ?? 2,
            zoom_speed: args.zoom_speed ?? 0.05
        }
        return this
    }

    /**
     * Sets the rendering mode for the canvas. Modifies the styling of the canvas if run after
     * build.
     *
     * @param mode The mode to switch to
     *
     * @see CSSStyleDeclaration.imageRendering
     */
    set_rendering(mode: typeof this.image_rendering): this {
        this.image_rendering = mode
        return this
    }
}
