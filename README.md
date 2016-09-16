# Beam Renderer

![beam](logo.png)

"Beam is a tiny, game focused, WebGL and Canvas Renderer."

## To Build

`npm install`

Make sure rollup is available globally:

`npm install rollup --global`

After installing you can build with:

`rollup -c`

This will output the build files to the `dist` folder.

Note: You need an ES6 version of node to do this, such as v5.6+. Check by running `node -v`, and if it's too low a version, update it.

## Examples

Can be found in `examples`

## Philosophy:

* ES6 (+ ES5 transpiled lib provided)
* TypeScript Defs
* Roll-Up (tree shaking) module builder
* Rendering features only: No asset loader, interactions, etc.

## Change Log

### September 16th 2016

* Removed the need for BaseTexture
* Optimized WebGLRenderer to compare Texture keys, instead of whole objects
* Added in TextureManager to help with creating, loading and getting textures
* Updated previous 3 examples to use new approach

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
