# Beam Renderer

![beam](logo.png)

"Beam is a tiny, game focused, WebGL and Canvas Renderer."

## To Build

After `npm install`:

`rollup -c`

Will output the build files to the `dist` folder. Needs an ES6 version of node (such as v5.6+)

## Examples

Can be found in `examples`

## Philosophy:

* ES6 (+ ES5 transpiled lib provided)
* TypeScript Defs
* Roll-Up (tree shaking) module builder
* Rendering features only: No asset loader, interactions, etc.

## Change Log

### September 15th 2016

* WebGL Renderer added
* Texture and BaseTexture classes added
* Sprite updated to use Texture
* Blend Modes supported and working on the Textures

### September 14th 2016

* Rectangle class added
* First pass at CanvasRenderer added
* Sprite class added
* Many Rect and Many Image tests added (Transform code running fast, rendering eating CPU)

### September 13th 2016

* Deferred Transform class option (dirty flag check)
* Core child management functions (removeChild, addChildAt, getChildAt, etc)

### September 12th 2016

* Transform Class with immediate propagation to children.
* Transform features: Scale, Rotation, Position, Pivot.
* Examples

## TODO

* Minimal Loader? (or have as separate file?)
* Cropped Textures
* Texture Frames
* Add Blend Modes to Canvas Renderer
* Scissor / Mask renderer
* Bounds calculation
* Dirty parent checks
* Interpolation Option
* Shear Tests
* Get Position Functions (for hit testing when deeply translated)
