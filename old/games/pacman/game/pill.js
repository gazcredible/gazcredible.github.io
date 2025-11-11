class Pill
{
    constructor()
    {
        this.active = true;
    }
}


class PowerPill extends Pill
{
}

class PillMap
{
    constructor()
    {
        this.map = {};
    }

    onNewLevel()
    {
        this.map['1:3'] = new PowerPill();
        this.map['26:3'] = new PowerPill();
        this.map['1:23'] = new PowerPill();
        this.map['26:23'] = new PowerPill();

        let data = [
           /*1*/ [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20,21,22,23,24,25,26],
            /*2*/ [1,6,12,15,21,26],
            /*3*/ [6,12,15,21],
            /*4*/ [1,6,12,15,21,26],
            /*5*/ [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
            /*6*/ [1,6,9,18,21,26],
            /*7*/ [1,6,9,18,21,26],
            /*8*/ [1,2,3,4,5,6,9,10,11,12,15,16,17,18,21,22,23,24,25,26],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*9*/ [6,21],
            /*5*/ [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20,21,22,23,24,25,26],
            /*6*/ [1,6,12,15,21,26],
            /*6*/ [1,6,12,15,21,26],
            /*6*/ [2,3,6,7,8,9,10,11,12,15,16,17,18,19,20,21,24,25],
            /*5*/ [3,6,9,18,21,24],
            /*5*/ [3,6,9,18,21,24],
            /*5*/ [1,2,3,4,5,6,9,10,11,12,15,16,17,18,21,22,23,24,25,26],
            /*5*/ [1,12,15,26],
            /*5*/ [1,12,15,26],
            /*5*/ [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
        ] ;

        for(let y = 0;y<data.length;y++)
        {
            for (let x = 0; x < data[y].length; x++)
            {
                this.map[(data[y][x])+':'+(y+1)] = new Pill();
            }
        }
    }

    draw()
    {
        for(let key in this.map)
        {
            let v = key.split(':');

            let x = parseInt(v[0]);
            let y = parseInt(v[1]);

            if (this.map[key] instanceof PowerPill)
            {
                if ((GameInst.frameCount % 16) > 8)
                {
                    GameInst.spritesheet.DrawSprite('power-pill', new Vector2(x * 8, y * 8));
                }
            }
            else
            {
                GameInst.spritesheet.DrawSprite('pill', new Vector2(x * 8, y * 8));
            }
        }
    }
}