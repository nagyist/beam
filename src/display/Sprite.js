import BaseTransform from '../transform/BaseTransform.js';
import BaseTexture from './BaseTexture.js';
import Texture from './Texture.js';

export default class Sprite extends BaseTransform {

    /**
     *
     */
    constructor (source, x = 0, y = 0)
    {
        super(x, y);

        this.visible = true;

        this.alpha = 1;

        this.tint = [0xffffff, 0xffffff, 0xffffff, 0xffffff];

        this.texture = new Texture(new BaseTexture(source));
    }

    renderWebGL (renderer)
    {
        if (renderer._size >= renderer.batchSize)
        {
            renderer.flush();
            renderer._base = this.texture.baseTexture;
        }

        //  texture anchors
        let aX = 0;
        let aY = 0;

        //  Un-trimmed
        let w0 = this.texture.cropWidth * (1 - aX);
        let w1 = this.texture.cropWidth * -aX;
        let h0 = this.texture.cropHeight * (1 - aY);
        let h1 = this.texture.cropHeight * -aY;

        // if (texture.frame.trimmed)
        // {
        //     w1 = texture.frame.trimX - aX * texture.frame.trimWidth;
        //     w0 = w1 + texture.cropWidth;

        //     h1 = texture.frame.trimY - aY * texture.frame.trimHeight;
        //     h0 = h1 + texture.cropHeight;
        // }

        if (this.transform.dirty)
        {
            this.transform.update();
        }

        renderer.addVerts(this.texture.uvs, this.transform.world, w0, h0, w1, h1, this.alpha, this.tint);

        renderer._batch[renderer._size++] = this.texture;
    }

    renderCanvas (renderer)
    {
        if (!this.visible)
        {
            return this;
        }

        this.transform.setContextTransform(renderer.context);

        renderer.context.drawImage(
            this.texture.baseTexture.source,
            0,
            0,
            this.texture.width,
            this.texture.height,
            0,
            0,
            this.texture.width,
            this.texture.height
        );
    }

}
