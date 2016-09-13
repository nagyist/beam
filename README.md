# Beam Renderer

![beam](logo.png)

Philosophy:

* ES6 (+ ES5 transpiled lib provided)
* TypeScript Defs
* Roll-Up (tree shaking) module builder
* Game orientated WebGL and Canvas Renderer
* Rendering features only: No asset loader, interactions, etc.

## v0.1

September 12th 2016 Done:

* Transform Class with immediate propagation to children.
* Transform features: Scale, Rotation, Position, Pivot.
* Examples

## TODO

* Dirty parent checks
* Deferred Transform class option (dirty flag check)
* Core child management functions (removeChild, addChildAt, getChildAt, etc)
* Interpolation Option
* Shear Tests
* Get Position Functions (for hit testing when deeply translated)
* Render filled rectangles (WebGL + Canvas) based on Transform
* Rectangle features: Size, Color
* Context loss handling
