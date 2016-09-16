import * as BlendModes from './BlendModes.js';
import Texture from '../display/Texture.js';

export default class TextureManager {

    constructor (renderer)
    {
        this.renderer = renderer;

        this.gl = renderer.gl;

        this.cache = new Map();
    }

    add (key, source, scaleMode = 1, preMultipliedAlpha = true)
    {
        if (this.cache.has(key))
        {
            console.warn('Texture key already in use: ' + key);
            return this;
        }

        let width = source.width;
        let height = source.height;
        let texture = this.loadTexture(source, scaleMode, preMultipliedAlpha);

        this.cache.set(key, {
            key,
            source,
            texture,
            width,
            height,
            scaleMode,
            preMultipliedAlpha
        });

        return this;
    }

    get (key)
    {
        return this.cache.get(key);
    }

    create (key, blendMode = BlendModes.NORMAL)
    {
        if (!this.cache.has(key))
        {
            console.warn('No Texture with key: ' + key + ' found.');
            return this;
        }

        let base = this.cache.get(key);

        return new Texture(base, blendMode);
    }

    isPowerOfTwo (width, height)
    {
        return (width > 0 && (width & (width - 1)) === 0 && height > 0 && (height & (height - 1)) === 0);
    }

    loadTexture (source, scaleMode, preMultipliedAlpha)
    {
        var gl = this.gl;

        var texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, preMultipliedAlpha);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

        if (scaleMode)
        {
            //  scaleMode 1 = Nearest
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }
        else
        {
            //  scaleMode 0 = Linear
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        if (this.isPowerOfTwo(source.width, source.height))
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        return texture;
    }

    unloadTexture (key)
    {
        if (!this.cache.has(key))
        {
            return this;
        }

        let base = this.cache.get(key);

        if (this.gl && base.texture)
        {
            this.gl.deleteTexture(base.texture);

            base.texture = null;
        }

        return this;
    }
    
}
