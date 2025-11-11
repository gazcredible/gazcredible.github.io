class GameObstacle extends GameObject
{
    constructor()
    {
        super();

        this.cover = []
    }

    setFromMapCell(mapcell)
    {
        super.setFromMapCell(mapcell);

        let cover_points = [[0,-1],[-1,0],[1,0],[0,1]];

        for(let i=0;i< cover_points.length;i++)
        {
            let pos = mapcell.clone();
            pos.x += cover_points[i][0];
            pos.y += cover_points[i][1];

            if(model.isValidLocation(this, pos))
            {
                let data = {}
                data['mapcell'] = pos;
                data['owner'] = undefined;
                this.cover.push(data);
            }
        }
    }

    toString()
    {
        return 'GameObstacle';
    }
}
