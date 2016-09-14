
export default class CanvasRenderer
{
    constructor (width = 256, height = 256, canvas = null, options = {})
    {
        this.canvas = canvas || document.createElement('canvas');
        this.context = this.canvas.getContext('2d', options);

        this.width = width;
        this.height = height;

        this.resize(width, height);

        this.autoClear = true;
        this.roundPixels = false;
    }

    cls ()
    {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.width, this.height);
    }

    resize (width, height = width)
    {
        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;

        return this;
    }

    backgroundColor (color = 'rgb(0, 0, 0)')
    {
        this.canvas.style.backgroundColor = color;

        return this;
    }

    resetTransform ()
    {
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        return this;
    }

    crisp ()
    {
        const types = [ 'optimizeSpeed', 'crisp-edges', '-moz-crisp-edges', '-webkit-optimize-contrast', 'optimize-contrast', 'pixelated' ];

        for (let i = 0; i < types.length; i++)
        {
            this.canvas.style['image-rendering'] = types[i];
        }

        this.canvas.style.msInterpolationMode = 'nearest-neighbor';

        return this;
    }

    bicubic ()
    {
        this.canvas.style['image-rendering'] = 'auto';
        this.canvas.style.msInterpolationMode = 'bicubic';

        return this;
    }

}
