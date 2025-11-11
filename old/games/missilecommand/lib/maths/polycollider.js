class PolyCollider extends ColliderBase
{

    constructor()
    {
        super();
    }

    initFromEdgeList(edgeList)
    {
        super.init();

        for(let i=0;i<edgeList.length;i++)
        {
            this.localPointList.push(edgeList[i]);
            this.localPointList.push(edgeList[(i+1)%edgeList.length]);
        }
    }
};