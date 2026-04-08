/**
 * @module preview
 *
 * Defines previews which can either be stuck to the bottom of a prompt or used as normal controls.
 */
import { ControlWithSubscriber } from "./core";
/**
 * A callback that can be used for rendering a {@link CanvasPreview}
 *
 * @see {@link CanvasPreview.constructor}
 */
export type RenderCallback<K> = (ctx: CanvasRenderingContext2D, value: Map<K, unknown>, canvas: HTMLCanvasElement) => void;
/**
 * Arguments for setting a {@link CanvasPreview}'s zooming and panning behaviour.
 *
 * @see {@link CanvasPreview.with_zoom}
 */
export type ZoomArgs = {
    min_zoom: number;
    max_zoom: number;
    zoom_speed: number;
    zoom_increments: number;
};
/**
 * Gets you a control with a canvas so you can draw arbitrary things on it.
 *
 * This also provides zooming and panning if you run {@link CanvasPreview.with_zoom} on it.
 */
export declare class CanvasPreview<K extends PropertyKey> extends ControlWithSubscriber<void, K> {
    #private;
    readonly render: RenderCallback<K>;
    private built;
    private image_rendering;
    private width;
    private height;
    private zoom_args;
    private ctx;
    private canvas;
    private values;
    private pan_x;
    private pan_y;
    private current_zoom;
    /**
     * Constructs a preview
     *
     * @param render The callback to run for redrawing the preview
     */
    constructor(render: RenderCallback<K>);
    build(): HTMLElement;
    /**
     * Redraws the canvas based on internal state.
     *
     * The exact things this function does are:
     * 1. Reset the ctx
     * 2. Translate the canvas based on panning
     * 3. Scale the canvas based on zoom
     * 4. Runs the user provided callback
     *
     * @see {@link CanvasPreview.render}
     * @see {@link RenderCallback}
     */
    private redraw;
    subscriber(v: Map<K, unknown>): void;
    /**
     * Sets the canvas width and height attributes.
     *
     * Modifies the already built canvas if this is run after {@link CanvasPreview.build}.
     *
     * @param width The new width
     * @param height The new height
     *
     * @see {@link HTMLCanvasElement.width}
     * @see {@link HTMLCanvasElement.height}
     */
    with_resolution(width: number, height: number): this;
    /**
     * Sets arguments for zoom.
     *
     * @param args The arguments to provide
     * @param args.min_zoom The minimum zoom level (default: 0.5x)
     * @param args.max_zoom The maximum zoom level (default: 2x)
     * @param args.zoom_speed The speed of zooming (default: 0.05)
     * @param args.zoom_increments The increments to round to when displaying (default: 0.1)
     *
     * @param preserve
     * If the prompt is already built and this isn't set to `true`, zeroes out the current pan and
     * zoom numbers.
     *
     * @see {@link ZoomArgs}
     */
    with_zoom(args?: Partial<ZoomArgs>, preserve?: boolean): this;
    /**
     * Sets the rendering mode for the canvas. Modifies the styling of the canvas if run after
     * build.
     *
     * @param mode The mode to switch to
     *
     * @see {@link CSSStyleDeclaration.imageRendering}
     */
    set_rendering(mode: typeof this.image_rendering): this;
    /**
     * Sets whether to trigger a redraw every game tick or not. Does nothing if run after the
     * canvas is built.
     *
     * @param mode The value to set to
     */
    redraw_on_tick(mode: boolean): this;
}
/**
 * Helper function to draw to a pixelmap. Does not call {@link CanvasRenderingContext2D.fill}.
 *
 * @remarks
 * This sets {CanvasRenderingContext2D.imageSmoothingEnabled} to `false` on `ctx` to
 * prevent blurriness when drawing the temporary canvas onto it, turn it back on externally if
 * needed.
 *
 * @param ctx        The context to draw to
 * @param pixmap     The pixelmap to draw
 * @param pixel_size The size per pixel
 * @param offset_x   The X offset to draw at
 * @param offset_y   The Y offset to draw at
 */
export declare function draw_pixmap(ctx: CanvasRenderingContext2D, pixmap: (Pixel | null)[][], pixel_size?: number, offset_x?: number, offset_y?: number): void;
