export default class Children {

    constructor (transform)
    {
        this.transform = transform;

        this.data = [];
    }

    //  This allows you to iterate over the class and get all of the children
    [Symbol.iterator]() {
        return this.data[Symbol.iterator]();
    }

    get size ()
    {
        return this.data.length;
    }

    update ()
    {
        for (let i = 0; i < this.data.length; i++)
        {
            this.data[i].update();
        }
    }

    add (child)
    {
        return this.addAt(child, this.data.length - 1);
    }

    addAt (child, index)
    {
        //  Invalid child?
        if (child === this.transform || child.parent === this.transform || index < 0 || index > this.data.length)
        {
            return child;
        }

        //  Child already parented? Remove it
        if (child.parent)
        {
            child.parent.children.remove(child);
        }

        child.parent = this.transform;

        this.data.splice(index, 0, child);

        this.transform.dirty = true;

        return child;
    }

    remove (child)
    {
        //  Invalid child?
        if (child === this.transform || child.parent !== this.transform)
        {
            return child;
        }

        let index = this.data.indexOf(child);

        if (index !== -1)
        {
            return this.removeAt(index);
        }
    }

    removeAt (index)
    {
        //  Valid index?
        if (index >= 0 && index < this.data.length)
        {
            let child = this.data.splice(index, 1);

            if (child[0])
            {
                child[0].parent = null;

                return child[0];
            }
        }
    }

}
