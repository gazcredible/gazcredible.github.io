class RectCollider extends PolyCollider
{

    constructor()
    {
        super();
    }
    init(width, height)
    {
        super.init ();

        var polyList = [];
        polyList.push(new Vector2(-width/2,-height/2));
        polyList.push(new Vector2( width/2,-height/2));
        polyList.push(new Vector2( width/2, height/2));
        polyList.push(new Vector2(-width/2, height/2));

        super.initFromEdgeList(polyList);
    }
};