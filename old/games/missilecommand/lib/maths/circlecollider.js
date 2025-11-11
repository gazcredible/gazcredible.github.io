class CircleCollider extends PolyCollider
{
    initCircleCollider(radius, segments)
    {
        if(segments == undefined)
        {
            segments = 32;
        }

        super.init();

        var polyList = [];

        for(let i=0;i<segments;i++)
        {
            var rad = new Vector2(radius,0);
            var rot = Matrix.CreateRotationZ(((2*Math.PI*i)/segments));

            polyList.push(rot.TransformVector2(rad));
        }

        super.initFromEdgeList(polyList);
    }
}