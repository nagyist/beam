import * as BlendModes from '../webgl/BlendModes.js';

export default class Texture {

    constructor (baseTexture)
    {
        this.baseTexture = baseTexture;

        this.blendMode = BlendModes.NORMAL;

        this.frame = { x: 0, y: 0, width: baseTexture.width, height: baseTexture.height, sourceWidth: baseTexture.width, sourceHeight: baseTexture.height };

        //  A per Texture setting that the user can modify without messing with any other Sprite using the same Texture Frame
        this._crop = { x: this.frame.x, y: this.frame.y, width: this.frame.width, height: this.frame.height };

        this._isCropped = false;

        //  WebGL UV data
        this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };

        this.updateUVs();
    }

    resetCrop ()
    {
        this._isCropped = false;

        this.updateFrame();
    }

    updateFrame ()
    {
        if (!this._isCropped)
        {
            this._crop.x = this.frame.x;
            this._crop.y = this.frame.y;
            this._crop.width = this.frame.width;
            this._crop.height = this.frame.height;
        }

        this.updateUVs();
    }

    /*
    setFrame (value)
    {
        this.frame = this.baseTexture.frameData.getFrame(value);

        this.updateFrame();
    }

    setFrameByIndex (value)
    {
        this.frame = this.baseTexture.frameData.getFrameIndex(value);

        this.updateFrame();
    }

    setFrameByName (value)
    {
        this.frame = this.baseTexture.frameData.getFrameName(value);

        this.updateFrame();
    }
    */

    updateUVs ()
    {
        var bw = this.baseTexture.width;
        var bh = this.baseTexture.height;
        
        this.uvs.x0 = this.cropX / bw;
        this.uvs.y0 = this.cropY / bh;

        this.uvs.x1 = (this.cropX + this.cropWidth) / bw;
        this.uvs.y1 = this.cropY / bh;

        this.uvs.x2 = (this.cropX + this.cropWidth) / bw;
        this.uvs.y2 = (this.cropY + this.cropHeight) / bh;

        this.uvs.x3 = this.cropX / bw;
        this.uvs.y3 = (this.cropY + this.cropHeight) / bh;
    }

    get width ()
    {
        return this.frame.sourceWidth;
    }

    get height ()
    {
        return this.frame.sourceHeight;
    }

    get cropX ()
    {
        return this._crop.x;
    }

    set cropX (value)
    {
        this._crop.x = value;
        this._isCropped = true;
        this.updateUVs();
    }

    get cropY ()
    {
        return this._crop.y;
    }

    set cropY (value)
    {
        this._crop.y = value;
        this._isCropped = true;
        this.updateUVs();
    }

    get cropWidth ()
    {
        return this._crop.width;
    }

    set cropWidth (value)
    {
        this._crop.width = value;
        this._isCropped = true;
        this.updateUVs();
    }

    get cropHeight ()
    {
        return this._crop.height;
    }

    set cropHeight (value)
    {
        this._crop.height = value;
        this._isCropped = true;
        this.updateUVs();
    }

}
