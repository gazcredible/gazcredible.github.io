class FenceCollider extends ColliderBase
{
    constructor()
    {
        super();
    }

    initFromFence(fence)
    {
        super.init();

        var v1 = new Vector2();
        var v2 = new Vector2();

        v1 = fence[0];

        for(let i=1;i<fence.length;i++)
        {
            v2 = fence[i];
            this.localPointList.push(v1);
            this.localPointList.push(v2);

            v1 = v2;
        }

        this.setTransform(Matrix_Identity);
    }

    isPointInMe(pos)
    {
        return false;
    }
}
