import * as BlendModes from './BlendModes.js';
import TextureManager from './TextureManager.js';

export default class WebGLRenderer
{
    constructor (width = 256, height = 256, canvas = null, options = {})
    {
        this.canvas = canvas || document.createElement('canvas');

        this.width = width;
        this.height = height;

        this.resize(width, height);

        this.gl = null;

        //  limit frames rendered
        this.frameCount = 0;

        this.contextOptions = {
            alpha: false,
            antialias: true,
            premultipliedAlpha: false,
            stencil: false,
            preserveDrawingBuffer: false
        };

        this.contextLost = false;

        this.projection = { x: 0, y: 0 };

        this.vertSize = 6;
        this.batchSize = 2000;

        this.stride = this.vertSize * 4;

        this.vertices = new Float32Array(this.batchSize * 4 * this.vertSize);
        this.indices = new Uint16Array(this.batchSize * 6);

        this._size = 0;
        this._batch = [];
        this._base = null;
        this._aVertexPosition = 0;
        this._aTextureCoord = 0;
        this._colorAttribute = 0;

        this.dirty = true;

        this.boot();

        this.textures = new TextureManager(this);
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

    addToDOM ()
    {
        document.body.appendChild(this.canvas);

        return this;
    }

    boot ()
    {
        this.contextLostBound = this.handleContextLost.bind(this);
        this.contextRestoredBound = this.handleContextRestored.bind(this);

        this.canvas.addEventListener('webglcontextlost', this.contextLostBound, false);
        this.canvas.addEventListener('webglcontextrestored', this.contextRestoredBound, false);

        var gl = this.canvas.getContext('webgl', this.contextOptions) || this.canvas.getContext('experimental-webgl', this.contextOptions);

        this.gl = gl;

        if (!gl)
        {
            throw new Error('Browser does not support WebGL');
        }

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);

        gl.viewport(0, 0, this.width, this.height);

        this.projection.x = this.width / 2;
        this.projection.y = -this.height / 2;

        for (let i = 0, j = 0; i < (this.batchSize * 6); i += 6, j += 4)
        {
            this.indices[i + 0] = j + 0;
            this.indices[i + 1] = j + 1;
            this.indices[i + 2] = j + 2;
            this.indices[i + 3] = j + 0;
            this.indices[i + 4] = j + 2;
            this.indices[i + 5] = j + 3;
        }

        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        // 65535 is max index, so 65535 / 6 = 10922.

        //  Upload the index data
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        this.initShader();

        return this;
    }

    initShader ()
    {
        var gl = this.gl;

        var vertexSrc = [
            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',
            'attribute vec4 aColor;',

            'uniform vec2 projectionVector;',

            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',

            'const vec2 center = vec2(-1.0, 1.0);',

            'void main(void) {',
            '   gl_Position = vec4((aVertexPosition / projectionVector) + center, 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '   vec3 color = mod(vec3(aColor.y / 65536.0, aColor.y / 256.0, aColor.y), 256.0) / 256.0;',
            '   vColor = vec4(color * aColor.x, aColor.x);',
            '}'
        ];

        var fragmentSrc = [
            'precision mediump float;',
            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',
            'uniform sampler2D uSampler;',
            'void main(void) {',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;',
            '}'
        ];

        var fragmentShader = this.compileShader(fragmentSrc, gl.FRAGMENT_SHADER);
        var vertexShader = this.compileShader(vertexSrc, gl.VERTEX_SHADER);
        var program = gl.createProgram();

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.log('Could not initialise shaders');
            return false;
        }
        else
        {
            //  Set Shader
            gl.useProgram(program);

            //  Get and store the attributes
            this._aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
            this._aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
            this._colorAttribute = gl.getAttribLocation(program, 'aColor');

            //  vertex position
            gl.enableVertexAttribArray(0);

            //  texture coordinate
            gl.enableVertexAttribArray(1);

            //  color attribute
            gl.enableVertexAttribArray(2);

            //  The projection vector (middle of the game world)
            this.projectionVector = gl.getUniformLocation(program, 'projectionVector');

            //  Un-used Shader uniforms
            // this.uSampler = gl.getUniformLocation(program, 'uSampler');
            // this.dimensions = gl.getUniformLocation(program, 'dimensions');

            //  Shader reference - not needed globally atm, leave commented for now
            // this.program = program;

            return true;
        }
    }

    compileShader (src, type)
    {
        let gl = this.gl;
        let shader = gl.createShader(type);

        gl.shaderSource(shader, src.join('\n'));
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        {
            return null;
        }

        return shader;
    }

    cls ()
    {
        if (this.contextLost)
        {
            return;
        }

        var gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //  Transparent
        // gl.clearColor(0, 0, 0, 0);

        //  Black
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //  Normal Blend Mode
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this._size = 0;
        this._batch.length = 0;

        this.dirty = true;
    }

    addVerts (uvs, wt, w0, h0, w1, h1, alpha, tint)
    {
        var a = wt.a;
        var b = wt.b;
        var c = wt.c;
        var d = wt.d;
        var tx = wt.tx;
        var ty = wt.ty;

        var verts = this.vertices;
        var i = this._size * 4 * this.vertSize;

        //  Top Left vert (xy, uv, color)
        verts[i++] = a * w1 + c * h1 + tx;
        verts[i++] = d * h1 + b * w1 + ty;
        verts[i++] = uvs.x0;
        verts[i++] = uvs.y0;
        verts[i++] = alpha;
        verts[i++] = tint[0];

        //  Top Right vert (xy, uv, color)
        verts[i++] = a * w0 + c * h1 + tx;
        verts[i++] = d * h1 + b * w0 + ty;
        verts[i++] = uvs.x1;
        verts[i++] = uvs.y1;
        verts[i++] = alpha;
        verts[i++] = tint[1];

        //  Bottom Right vert (xy, uv, color)
        verts[i++] = a * w0 + c * h0 + tx;
        verts[i++] = d * h0 + b * w0 + ty;
        verts[i++] = uvs.x2;
        verts[i++] = uvs.y2;
        verts[i++] = alpha;
        verts[i++] = tint[2];

        //  Bottom Left vert (xy, uv, color)
        verts[i++] = a * w1 + c * h0 + tx;
        verts[i++] = d * h0 + b * w1 + ty;
        verts[i++] = uvs.x3;
        verts[i++] = uvs.y3;
        verts[i++] = alpha;
        verts[i++] = tint[3];
    }

    flush ()
    {
        if (this._size === 0)
        {
            //  Nothing more to draw
            return;
        }

        var gl = this.gl;

        if (this.dirty)
        {
            //  Always dirty the first pass through
            //  but subsequent calls may be clean
            this.dirty = false;

            // bind the main texture
            gl.activeTexture(gl.TEXTURE0);

            // bind the buffers
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            //  set the projection vector (defaults to middle of game world on negative y)
            gl.uniform2f(this.projectionVector, this.projection.x, this.projection.y);

            //  vertex position
            gl.vertexAttribPointer(this._aVertexPosition, 2, gl.FLOAT, false, this.stride, 0);

            //  texture coordinate
            gl.vertexAttribPointer(this._aTextureCoord, 2, gl.FLOAT, false, this.stride, 2 * 4);

            //  color attribute
            gl.vertexAttribPointer(this._colorAttribute, 2, gl.FLOAT, false, this.stride, 4 * 4);
        }

        //  Upload the verts to the buffer
        if (this._size > (this.batchSize * 0.5))
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            var view = this.vertices.subarray(0, this._size * 4 * this.vertSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
        }

        var start = 0;
        var currentSize = 0;

        var base = { key: '' };
        var nextBase = null;

        var blend = 0;
        var nextBlend = null;

        for (let i = 0; i < this._size; i++)
        {
            //  _batch[i] contains the next texture to be rendered
            nextBlend = this._batch[i].blendMode;

            if (blend !== nextBlend)
            {
                //  Unrolled for speed
                if (nextBlend === BlendModes.NORMAL)
                {
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                }
                else if (nextBlend === BlendModes.ADD)
                {
                    gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);
                }
                else if (nextBlend === BlendModes.MULTIPLY)
                {
                    gl.blendFunc(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                }
                else if (nextBlend === BlendModes.SCREEN)
                {
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                }
            }

            nextBase = this._batch[i].base;

            if (base.key !== nextBase.key)
            {
                if (currentSize > 0)
                {
                    gl.bindTexture(gl.TEXTURE_2D, base.texture);
                    gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
                }

                start = i;
                currentSize = 0;
                base = nextBase;
            }

            currentSize++;
        }

        if (currentSize > 0)
        {
            gl.bindTexture(gl.TEXTURE_2D, base.texture);
            gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
        }

        //  Reset the batch
        this._size = 0;
    }

    handleContextLost (event)
    {
        event.preventDefault();

        this.contextLost = true;
    }

    handleContextRestored ()
    {
        this.boot();

        // empty all the ol gl textures as they are useless now

        this.contextLost = false;
    }

}
