# Beam Renderer

![beam](logo.png)

Philosophy:

* ES6 (+ ES5 transpiled lib provided)
* TypeScript Defs
* Roll-Up (tree shaking) module builder
* Game orientated WebGL and Canvas Renderer
* Rendering features only: No asset loader, interactions, etc.

## v0.1

* Transform Class with immediate propagation + dirty parent checks
* Transform features: Scale, Rotation, Position
* Dirty parent checks
* Render filled rectangles (WebGL + Canvas) based on Transform
* Rectangle features: Size, Color
* Context loss handling
