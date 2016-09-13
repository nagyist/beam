import { PI2, TAU, EPSILON } from './MathConstants.js';

/**
 * 2D Transformation Class
 */

export const ROOT = { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 };

export default class Transform {

    /**
     *
     */
    constructor (parent = null, x = 0, y = 0, scaleX = 1, scaleY = 1, shearX = 0, shearY = 0)
    {
        //  Local Transform
        this.local = { a: scaleX, b: shearY, c: shearX, d: scaleY, tx: x, ty: y };

        //  World Transform
        this.world = { a: scaleX, b: shearY, c: shearX, d: scaleY, tx: x, ty: y };

        //  Private value holders, accessed via the getters and setters
        this._posX = x;
        this._posY = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._shearX = shearX;
        this._shearY = shearY;
        this._rotation = 0;
        this._pivotX = 0;
        this._pivotY = 0;

        this._worldRotation = 0;
        this._worldScaleX = scaleX;
        this._worldScaleY = scaleY;

        //  Child related ...
        this.dirty = false;

        this.parent = parent;

        this.children = [];

        if (parent)
        {
            parent.addChild(this);
        }
        else
        {
            this.update();
        }
    }

    addChild (child)
    {
        child.parent = this;

        this.children.push(child);

        child.update(this);
    }

    reset ()
    {
    }

    update ()
    {
        let parent = (this.parent) ? this.parent.world : ROOT;
        let tx = 0;
        let ty = 0;

        if (this._rotation % PI2)
        {
            //  Local Rotation

            let sr = Math.sin(this._rotation);
            let cr = Math.cos(this._rotation);

            let a = cr * this._scaleX;
            let b = sr * this._scaleX;
            let c = -sr * this._scaleY;
            let d = cr * this._scaleY;

            tx = this._posX - (this._pivotX * a + this._pivotY * c);
            ty = this._posY - (this._pivotX * b + this._pivotY * d);

            this.world.a = a * parent.a + b * parent.c;
            this.world.b = a * parent.b + b * parent.d;
            this.world.c = c * parent.a + d * parent.c;
            this.world.d = c * parent.b + d * parent.d;

            this._worldRotation = Math.atan2(-this.world.c, this.world.d);
        }
        else
        {
            //  No Rotation

            tx = this._posX - this._pivotX * this._scaleX;
            ty = this._posY - this._pivotY * this._scaleY;

            this.world.a = this._scaleX * parent.a;
            this.world.b = this._scaleX * parent.b;
            this.world.c = this._scaleY * parent.c;
            this.world.d = this._scaleY * parent.d;

            this._worldRotation = 0;
        }

        this.world.tx = tx * parent.a + ty * parent.c + parent.tx;
        this.world.ty = ty * parent.b + ty * parent.d + parent.ty;

        this._worldScaleX = this._scaleX * Math.sqrt(this.world.a * this.world.a + this.world.c * this.world.c);
        this._worldScaleY = this._scaleY * Math.sqrt(this.world.b * this.world.b + this.world.d * this.world.d);

        this.dirty = false;

        //  Update children

        for (let i = 0; i < this.children.length; i++)
        {
            this.children[i].update();
        }

        return this;
    }

    decomposeMatrix (mat)
    {
        //  QR Decomposition

        let a = mat.a;
        let b = mat.b;
        let c = mat.c;
        let d = mat.d;
        let e = mat.e;
        let f = mat.f;

        let translate = { x: e, y: f };
        let rotation = 0;
        let scale = { x: 1, y: 1 };
        let skew = { x: 0, y: 0 };

        let determ = (a * d) - (b * c);

        if (a || b)
        {
            let r = Math.sqrt((a * a) + (b * b));
            rotation = (b > 0) ? Math.acos(a / r) : -Math.acos(a / r);
            scale = { x: r, y: determ / r };
            skew.x = Math.atan(((a * c) + (b * d)) / (r * r));
        }
        else if (c || d)
        {
            var s = Math.sqrt((c * c) + (d * d));
            rotation = (Math.PI * 0.5) - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
            scale = {x: determ / s, y: s};
            skew.y = Math.atan(((a * c) + (b * d)) / (s * s));
        }
        else
        {
            scale = { x: 0, y: 0 };
        }

        return {
            translate,
            rotation,
            scale,
            skew
        };

    }

    get x ()
    {
        return this._posX;
    }

    get y ()
    {
        return this._posY;
    }

    get scaleX ()
    {
        return this._scaleX;
    }

    get scaleY ()
    {
        return this._scaleY;
    }

    get pivotX ()
    {
        return this._pivotX;
    }

    get pivotY ()
    {
        return this._pivotY;
    }

    get shearX ()
    {
        return this._shearX;
    }

    get shearY ()
    {
        return this._shearY;
    }

    get rotation ()
    {
        return this._rotation;
    }

    get worldRotation ()
    {
        return this._worldRotation;
    }

    get worldScaleX ()
    {
        return this._worldScaleX;
    }

    get worldScaleY ()
    {
        return this._worldScaleY;
    }

    get worldX ()
    {
        return this.world.tx;
    }

    get worldY ()
    {
        return this.world.ty;
    }

    //  Setter Methods

    setPosition (x, y = x)
    {
        this._posX = x;
        this._posY = y;

        return this.update();
    }

    setScale (x, y = x)
    {
        this._scaleX = x;
        this._scaleY = y;

        return this.update();
    }

    setShear (x, y = x)
    {
        this._shearX = x;
        this._shearY = y;

        return this.update();
    }

    setPivot (x, y = x)
    {
        this._pivotX = x;
        this._pivotY = y;

        return this.update();
    }

    setRotation (rotation)
    {
        this._rotation = rotation;

        return this.update();
    }

    //  Setters

    set x (value)
    {
        this._posX = value;
        this.update();
    }

    set y (value)
    {
        this._posY = value;
        this.update();
    }

    set scaleX (value)
    {
        this._scaleX = value;
        this.update();
    }

    set scaleY (value)
    {
        this._scaleY = value;
        this.update();
    }

    set pivotX (value)
    {
        this._pivotX = value;
        this.update();
    }

    set pivotY (value)
    {
        this._pivotY = value;
        this.update();
    }

    set shearX (value)
    {
        this._shearX = value;
        this.update();
    }

    set shearY (value)
    {
        this._shearY = value;
        this.update();
    }

    set rotation (value)
    {
        this._rotation = value;
        this.update();
    }

}
