import Transform from '../transform/Transform.js';

export default class Rectangle {

    /**
     *
     */
    constructor (x = 0, y = 0, width = 0, height = 0, color = 'rgba(255, 0, 255, 1.0)')
    {
        this.transform = new Transform(null, x, y);

        this.visible = true;

        this.width = width;
        this.height = height;

        this.color = color;
    }

    draw (renderer)
    {
        if (!this.visible)
        {
            return this;
        }

        renderer.context.fillStyle = this.color;

        this.transform.setContextTransform(renderer.context);

        renderer.context.fillRect(0, 0, this.width, this.height);
    }

    get x ()
    {
        return this.transform.x;
    }

    get y ()
    {
        return this.transform.y;
    }

    get rotation ()
    {
        return this.transform.rotation;
    }

    set x (value)
    {
        this.transform.x = value;
    }

    set y (value)
    {
        this.transform.y = value;
    }

    set rotation (value)
    {
        this.transform.rotation = value;
    }

}
