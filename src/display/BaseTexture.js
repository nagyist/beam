export default class BaseTexture {

    constructor (source)
    {
        this.source = source;

        this.width = source.width;
        this.height = source.height;

        //  0 = Linear
        //  1 = Nearest (pixels)
        this.scaleMode = 0;

        this.premultipliedAlpha = true;

        this._gl = [];
        this._pot = false;
        this._dirty = [true, true, true, true];
    }

    dirty ()
    {
        for (let i = 0; i < this._glTextures.length; i++)
        {
            this._dirty[i] = true;
        }
    }

}
