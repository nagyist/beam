import BaseTransform from '../transform/BaseTransform.js';

export default class Rectangle extends BaseTransform {

    /**
     *
     */
    constructor (x = 0, y = 0, width = 0, height = 0, color = 'rgba(255, 0, 255, 1.0)')
    {
        super(x, y);

        this.visible = true;

        this.width = width;
        this.height = height;

        this.color = color;
    }

    render (renderer)
    {
        if (!this.visible)
        {
            return this;
        }

        renderer.context.fillStyle = this.color;

        this.transform.setContextTransform(renderer.context);

        renderer.context.fillRect(0, 0, this.width, this.height);
    }

}
