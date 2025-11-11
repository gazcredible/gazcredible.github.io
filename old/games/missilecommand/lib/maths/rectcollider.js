class RectCollider extends PolyCollider
{
    constructor(width, height)
    {
        super();

        var polyList = [];
        polyList.push(new Vector2(-width/2,-height/2));
        polyList.push(new Vector2( width/2,-height/2));
        polyList.push(new Vector2( width/2, height/2));
        polyList.push(new Vector2(-width/2, height/2));

        super.initFromEdgeList(polyList);
    }
}