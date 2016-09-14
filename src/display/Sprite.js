import BaseTransform from '../transform/BaseTransform.js';

export default class Sprite extends BaseTransform {

    /**
     *
     */
    constructor (texture, x = 0, y = 0)
    {
        super(x, y);

        this.visible = true;

        this.width = texture.width;
        this.height = texture.height;

        this.texture = texture;
    }

    render (renderer)
    {
        if (!this.visible)
        {
            return this;
        }

        this.transform.setContextTransform(renderer.context);

        renderer.context.drawImage(
            this.texture,
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height
        );
    }

}
