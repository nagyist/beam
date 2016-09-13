import { PI2, TAU, EPSILON } from '../core/MathConstants.js';
import Children from './Children.js';

/**
 * 2D Transformation Class
 */

export default class Transform {

    /**
     *
     */
    constructor (parent = null, x = 0, y = 0, scaleX = 1, scaleY = 1, shearX = 0, shearY = 0)
    {
        this.name = '';

        //  Local Transform
        this.local = { a: scaleX, b: shearY, c: shearX, d: scaleY, tx: x, ty: y };

        //  World Transform
        this.world = { a: scaleX, b: shearY, c: shearX, d: scaleY, tx: x, ty: y };

        //  Cached Transform Calculations
        this.cache = { a: 1, b: 0, c: 0, d: 1, sr: 0, cr: 0 };

        this.hasLocalRotation = false;

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

        this.dirty = false;

        this.parent = parent;

        //  Optional if Flat Display List?
        this.children = new Children(this);

        if (parent)
        {
            parent.children.add(this);
        }
    }

    setContextTransform (context)
    {
        // if (this.dirty)
        // {
            //  Needs to start from the top-most dirty node, so it doesn't matter
            //  where we render from in the display list, it's always correct
            // this.update();
        // }

        context.setTransform(
            this.world.a,
            this.world.b,
            this.world.c,
            this.world.d,
            this.world.tx,
            this.world.ty);

        return this;
    }

    //  Updates the Transform.world object, ready for rendering
    //  Assuming this Transform is attached to the root (i.e. no parent)
    updateFromRoot ()
    {
        if (this.hasLocalRotation)
        {
            console.log(this.name, 'Transform.updateFromRoot');

            this.world.a = this.cache.a;
            this.world.b = this.cache.b;
            this.world.c = this.cache.c;
            this.world.d = this.cache.d;
            this.world.tx = this._posX - (this._pivotX * this.cache.a + this._pivotY * this.cache.c);
            this.world.ty = this._posY - (this._pivotX * this.cache.b + this._pivotY * this.cache.d);

            this._worldRotation = Math.atan2(-this.cache.c, this.cache.d);
        }
        else
        {
            console.log(this.name, 'Transform.updateFromRoot FAST');

            this.world.a = this._scaleX;
            this.world.b = 0;
            this.world.c = 0;
            this.world.d = this._scaleY;
            this.world.tx = this._posX - this._pivotX * this._scaleX;
            this.world.ty = this._posY - this._pivotY * this._scaleY;

            this._worldRotation = 0;
        }

        this._worldScaleX = this._scaleX;
        this._worldScaleY = this._scaleY;

        return this;
    }

    updateFromParent ()
    {
        let parent = this.parent.world;
        let tx = 0;
        let ty = 0;

        if (this.hasLocalRotation)
        {
            console.log(this.name, 'Transform.updateFromParent');

            let a = this.cache.a;
            let b = this.cache.b;
            let c = this.cache.c;
            let d = this.cache.d;

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
            console.log(this.name, 'Transform.updateFromParent FAST');

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

        return this;
    }

    updateAncestors ()
    {
        if (!this.parent)
        {
            return this;
        }

        console.log(this.name, 'updateAncestors');

        //  Gets all parent nodes, starting from this Transform
        //  Then updates from the top, down, but only on the ancestors,
        //  not any other children - will give us accurate worldX etc properties

        let node = this.parent;
        let nodes = [];

        do
        {
            nodes.push(node);
            node = node.parent;
        }
        while (node);

        //  We've got all the ancestors in the 'nodes' array, let's loop it

        while (nodes.length)
        {
            node = nodes.pop();

            if (node.parent)
            {
                node.updateFromParent();
            }
            else
            {
                node.updateFromRoot();
            }
        }

        //  By this point all of this Transforms ancestors have been
        //  updated, in the correct order, so we can now do this one
        //  and any of its children too

        return this.update();

    }

    update ()
    {
        if (this.parent)
        {
            this.updateFromParent();
        }
        else
        {
            this.updateFromRoot();
        }

        this.dirty = false;

        //  Update children

        if (this.children.size)
        {
            this.children.update();
        }

        return this;
    }

    //  LOCAL values (without parent taken into account)
    //  Can be read immediately, don't need to update anything

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

    //  GLOBAL read-only values
    //  Need *all* parents taken into account to get the correct values

    get worldRotation ()
    {
        if (this.dirty)
        {
            //  This needs to start at the root
            //  Otherwise a parent `n` steps up the chain may have changed
            this.update();
        }

        return this._worldRotation;
    }

    get worldScaleX ()
    {
        if (this.dirty)
        {
            this.update();
        }

        return this._worldScaleX;
    }

    get worldScaleY ()
    {
        if (this.dirty)
        {
            this.update();
        }

        return this._worldScaleY;
    }

    get worldX ()
    {
        if (this.dirty)
        {
            this.update();
        }

        return this.world.tx;
    }

    get worldY ()
    {
        if (this.dirty)
        {
            this.update();
        }

        return this.world.ty;
    }

    //  Setter Methods

    setPosition (x, y = x)
    {
        this._posX = x;
        this._posY = y;

        this.dirty = true;

        return this;
    }

    setScale (x, y = x)
    {
        this._scaleX = x;
        this._scaleY = y;

        this.updateCache();

        this.dirty = true;

        return this;
    }

    setShear (x, y = x)
    {
        this._shearX = x;
        this._shearY = y;

        this.dirty = true;

        return this;
    }

    setPivot (x, y = x)
    {
        this._pivotX = x;
        this._pivotY = y;

        this.dirty = true;

        return this;
    }

    setRotation (rotation)
    {
        this.rotation = rotation;

        return this;
    }

    //  Setters for LOCAL properties
    //
    //  Setting these flags the Transform as being dirty.
    //  However it doesn't propagate to children until one
    //  of the WORLD properties of the child is read, or until
    //  this Transform is updated or sent to a context

    set x (value)
    {
        this._posX = value;
        this.dirty = true;
    }

    set y (value)
    {
        this._posY = value;
        this.dirty = true;
    }

    set scaleX (value)
    {
        this._scaleX = value;
        this.dirty = true;
        this.updateCache();
    }

    set scaleY (value)
    {
        this._scaleY = value;
        this.dirty = true;
        this.updateCache();
    }

    set pivotX (value)
    {
        this._pivotX = value;
        this.dirty = true;
    }

    set pivotY (value)
    {
        this._pivotY = value;
        this.dirty = true;
    }

    set shearX (value)
    {
        this._shearX = value;
        this.dirty = true;
    }

    set shearY (value)
    {
        this._shearY = value;
        this.dirty = true;
    }

    set rotation (value)
    {
        if (this._rotation === value)
        {
            return;
        }

        this._rotation = value;
        this.dirty = true;

        if (this._rotation % PI2)
        {
            this.cache.sr = Math.sin(this._rotation);
            this.cache.cr = Math.cos(this._rotation);
            this.updateCache();
            this.hasLocalRotation = true;
        }
        else
        {
            this.hasLocalRotation = false;
        }
    }

    updateCache ()
    {
        this.cache.a = this.cache.cr * this._scaleX;
        this.cache.b = this.cache.sr * this._scaleX;
        this.cache.c = -this.cache.sr * this._scaleY;
        this.cache.d = this.cache.cr * this._scaleY;
    }

}
