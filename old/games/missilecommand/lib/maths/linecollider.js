class LineCollider extends ColliderBase
{
    constructor()
    {
        super();

    }

    initFromPoints(v0,v1)
    {
        super.init ();

        this.localPointList.push(v0);
        this.localPointList.push(v1);

        this.setTransform(Matrix_Identity);
    }
};