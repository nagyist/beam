import { PI2, TAU, EPSILON } from '../core/MathConstants.js';
import Transform from './Transform.js';

//  A BaseTransform class that you can use when extending a Sprite or other Game Object
//  Hides away the 'private' stuff and exposes only the useful getters and setters

export default class BaseTransform {

    constructor (x = 0, y = 0)
    {
        this.name = '';

        this.transform = new Transform(null, x, y);
    }

    get x ()
    {
        return this.transform._posX;
    }

    get y ()
    {
        return this.transform._posY;
    }

    get scaleX ()
    {
        return this.transform._scaleX;
    }

    get scaleY ()
    {
        return this.transform._scaleY;
    }

    get pivotX ()
    {
        return this.transform._pivotX;
    }

    get pivotY ()
    {
        return this.transform._pivotY;
    }

    get shearX ()
    {
        return this.transform._shearX;
    }

    get shearY ()
    {
        return this.transform._shearY;
    }

    get rotation ()
    {
        return this.transform._rotation;
    }

    //  GLOBAL read-only values
    //  Need *all* parents taken into account to get the correct values

    get worldRotation ()
    {
        this.transform.updateAncestors();

        return this.transform._worldRotation;
    }

    get worldScaleX ()
    {
        this.transform.updateAncestors();

        return this.transform._worldScaleX;
    }

    get worldScaleY ()
    {
        this.transform.updateAncestors();

        return this.transform._worldScaleY;
    }

    get worldX ()
    {
        this.transform.updateAncestors();

        return this.transform.world.tx;
    }

    get worldY ()
    {
        this.transform.updateAncestors();

        return this.transform.world.ty;
    }

    //  Setter Methods

    setPosition (x, y = x)
    {
        this.transform._posX = x;
        this.transform._posY = y;

        return this.transform.update();
    }

    setScale (x, y = x)
    {
        this.transform._scaleX = x;
        this.transform._scaleY = y;

        this.transform.updateCache();

        return this.transform.update();
    }

    setShear (x, y = x)
    {
        this.transform._shearX = x;
        this.transform._shearY = y;

        return this.transform.update();
    }

    setPivot (x, y = x)
    {
        this.transform._pivotX = x;
        this.transform._pivotY = y;

        return this.transform.update();
    }

    setRotation (rotation)
    {
        this.transform.rotation = rotation;

        return this.transform.update();
    }

    //  Setters for LOCAL properties
    //
    //  Setting these flags the Transform as being dirty.
    //  However it doesn't propagate to children until one
    //  of the WORLD properties of the child is read, or until
    //  this transform.Transform is updated or sent to a context

    set x (value)
    {
        this.transform._posX = value;
        this.transform.dirty = true;
    }

    set y (value)
    {
        this.transform._posY = value;
        this.transform.dirty = true;
    }

    set scaleX (value)
    {
        this.transform._scaleX = value;
        this.transform.dirty = true;
        this.transform.updateCache();
    }

    set scaleY (value)
    {
        this.transform._scaleY = value;
        this.transform.dirty = true;
        this.transform.updateCache();
    }

    set pivotX (value)
    {
        this.transform._pivotX = value;
        this.transform.dirty = true;
    }

    set pivotY (value)
    {
        this.transform._pivotY = value;
        this.transform.dirty = true;
    }

    set shearX (value)
    {
        this.transform._shearX = value;
        this.transform.dirty = true;
    }

    set shearY (value)
    {
        this.transform._shearY = value;
        this.transform.dirty = true;
    }

    set rotation (value)
    {
        if (this.transform._rotation === value)
        {
            return;
        }

        this.transform._rotation = value;
        this.transform.dirty = true;

        if (this.transform._rotation % PI2)
        {
            this.transform.cache.sr = Math.sin(this.transform._rotation);
            this.transform.cache.cr = Math.cos(this.transform._rotation);
            this.transform.updateCache();
            this.transform.hasLocalRotation = true;
        }
        else
        {
            this.transform.hasLocalRotation = false;
        }
    }

}
