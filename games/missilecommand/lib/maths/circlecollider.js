class CircleCollider extends PolyCollider
{
    initCircleCollider(radius, segments)
    {
        super.init();

        var polyList = [];

        for(let i=0;i<segments;i++)
        {
            var rad = new Vector2(radius,0);
            var rot = Matrix.CreateRotationZ((float)((2*Math.PI*i)/segments));

            polyList.push(rot.Transform(rad));
        }

        super.initFromEdgeList(polyList);
    }
}