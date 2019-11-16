

class MapNode
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;

        this.left = null;
        this.right = null;
        this.up= null;
        this.down = null;
    }
}

class NodeMap
{
    constructor()
    {
        this.map = {};
        this.nodes ={};

        this.add(1,1,'1:5','6:1');
        this.add(6,1,'6:5','12:1');
        this.add(12,1,'12:5',null);

        this.add(15,1,'15:5','21:1');
        this.add(21,1,'21:5','26:1');
        this.add(26,1,'26:5',null);

        this.add(1,5,'1:8','6:5');
        this.add(6,5,'6:8','9:5');
        this.add(9,5,'9:8','12:5');
        this.add(12,5,null,'15:5');

        this.add(15,5,null,'18:5');
        this.add(18,5,'18:8','21:5');
        this.add(21,5,'21:8','26:5');
        this.add(26,5,'26:8',null);

        this.add(1,8,null,'6:8');
        this.add(6,8,'6:14',null);
        this.add(9,8,null,'12:8');
        this.add(12,8,'12:11',null);

        this.add(15,8,'15:11','18:8');
        this.add(18,8,null,null);
        this.add(21,8,'21:11','26:8');
        this.add(26,8,null,null);

        this.add(9,11,'9:14','12:11');
        this.add(12,11,null,'15:11');
        this.add(15,11,null,'18:11');
        this.add(18,11,'18:14',null);
        this.add(21,11,'21:14',null);


        //this.add(0,14,null,'6:14');
        this.add(6,14,'6:20','9:14');
        this.add(9,14,'9:17',null);
        this.add(18,14,'18:17','21:14');
        //this.add(21,14,'21:20','27:14');
        this.add(21,14,'21:20',null);
        //this.add(27,14,null,'0:14');


        this.add(9,17,'9:20','18:17');
        this.add(18,17,'18:20',null);

        this.add(1,20,'1:23','6:20');
        this.add(6,20,'6:23','9:20');
        this.add(9,20,null,'12:20');
        this.add(12,20,'12:23',null);
        this.add(15,20,'15:23','18:20');
        this.add(18,20,null,'21:20');
        this.add(21,20,'21:23','26:20');
        this.add(26,20,'26:23',null);

        this.add(1,23,null,'3:23');
        this.add(3,23,'3:26',null);
        this.add(6,23,null,'9:23');
        this.add(9,23,'9:26','12:23');
        this.add(12,23,null,'15:23');
        this.add(15,23,null,'18:23');
        this.add(18,23,'18:26','21:23');
        this.add(21,23,'21:26',null);
        this.add(24,23,'24:26','26:23');
        this.add(26,23,null,null);

        this.add(1,26,'1:29','3:26');
        this.add(3,26,null,'6:26');
        this.add(6,26,null,null);
        this.add(9,26,null,'12:26');
        this.add(12,26,'12:29',null);
        this.add(15,26,'15:29','18:26');
        this.add(18,26,null,null);
        this.add(21,26,null,'24:26');
        this.add(24,26,null,'26:26');
        this.add(26,26,'26:29',null);

        this.add(1,29,null,'12:29');
        this.add(12,29,null,'15:29');
        this.add(15,29,null,'26:29');
        this.add(26,29,null,null);
    }

    add(x,y, down, right)
    {
        var label = '' +x+":"+y;

        if(this.map[label] == undefined)
        {
            this.map[label] = new MapNode(x, y);
        }

        if(right != null)
        {
            this.map[label].right = right;

            if(this.map[right] == undefined)
            {
                // create node from label
                var v = right.split(':');
                this.map[right] = new MapNode(parseInt(v[0]), parseInt(v[1]));
            }

            this.map[right].left = label;
        }
        if(down != null)
        {
            this.map[label].down = down;

            if (this.map[down] == undefined)
            {
                var v = down.split(':');
                this.map[down] = new MapNode(parseInt(v[0]), parseInt(v[1]));
            }
            this.map[down].up = label;
        }
    }

    draw()
    {
        if(false)
        {
            for (let key in this.map)
            {
                var data = this.map[key];
                GameInst.spritesheet.DrawSprite('pill', new Vector2(data.x * 8, data.y * 8));

                if (data.right != null)
                {
                    let target = this.map[data.right];

                    if (target.x > data.x)
                    {
                        GAZCanvas.Line(new Vector2((data.x * 8) + 4, (data.y * 8) + 4)
                            , new Vector2((target.x * 8) + 4, (target.y * 8) + 4)
                            , '#ffffff'
                            , 0.5);
                    }
                }

                if (data.down != null)
                {
                    let target = this.map[data.down];

                    GAZCanvas.Line(new Vector2((data.x * 8) + 4, (data.y * 8) + 4)
                        , new Vector2((target.x * 8) + 4, (target.y * 8) + 4)
                        , '#00ffff'
                        , 0.5);
                }


                if (data.left != null)
                {
                    let target = this.map[data.left];

                    if (target.x < data.x)
                    {
                        GAZCanvas.Line(new Vector2((data.x * 8) + 4, (data.y * 8) + 4 + 1)
                            , new Vector2((target.x * 8) + 4, (target.y * 8) + 4 + 1)
                            , '#ff00ff'
                            , 0.5);
                    }
                }

                if (data.up != null)
                {
                    let target = this.map[data.up];

                    GAZCanvas.Line(new Vector2((data.x * 8) + 4 + 1, (data.y * 8) + 4)
                        , new Vector2((target.x * 8) + 4 + 1, (target.y * 8) + 4)
                        , '#ffff00'
                        , 0.5);
                }
            }

            for (var y = 0; y < 31; y++)
            {
                for (var x = 0; x < 28; x++)
                {
                    GAZCanvas.Text(2.5, '['+x+':'+y+']',new Vector2((x*8)+4,(y*8)+4), '#ffffff','center');
                }
            }

            for (let y = 0; y < 31; y++)
            {
                //GAZCanvas.Line(new Vector2(0,y*8), new Vector2(28*8,y*8),'#ffff00',1);
            }
            for (let x = 0; x < 28; x++)
            {
                //GAZCanvas.Line(new Vector2(x*8,0), new Vector2(x*8,31*8),'#ffff00',1);
            }
        }
    }
}