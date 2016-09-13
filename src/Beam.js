import { version } from '../package.json';
import Transform from './core/Transform.js';

export default class Beam
{
    constructor ()
    {
        console.log('Beam v' + version);
    }

    createTransform (parent = null, x = 0, y = 0, scaleX = 1, scaleY = 1, shearX = 0, shearY = 0)
    {
        return new Transform(parent, x, y, scaleX, scaleY, shearX, shearY);
    }
}
