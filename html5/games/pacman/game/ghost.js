class Ghost
{
    constructor(type)
    {
        this.position  = new Vector2();
        this.velocity  = new Vector2();
        this.target = '';
        this.speed = 0.05;
        this.previousTarget;
        this.type = type;

        if(this.type == 'red')
        {
            this.speed *= 4;
        }

        if(this.type == 'cyan')
        {
            this.speed /= 2;
        }

        //choose a current node

        var nodes = Object.keys(GameInst.nodeMap.map);

        this.target = nodes[Math.floor(Math.random()* nodes.length)];
        this.previousTarget = this.target;

        var v = this.target.split(':');
        this.position.x = parseInt(v[0]);
        this.position.y = parseInt(v[1]);
    }

    getNodePosition(label)
    {
        let retVal = new Vector2();
        var v = label.split(':');
        retVal.x = parseInt(v[0]);
        retVal.y = parseInt(v[1]);

        return retVal;
    }

    targetIsValid(target)
    {
        if(target == this.previousTarget)
        {
            return false;
        }

        if(target == '0,14') return false;
        if(target ==' 27,14')return false;

        return true;
    }

    update()
    {
        //if at target, find a new target based on current target's connections


        if( this.position.distance(this.getNodePosition(this.target))< this.speed)
        {
            let dest = [];

            if(GameInst.nodeMap.map[this.target].up != null)
            {
                dest.push(GameInst.nodeMap.map[this.target].up);
            }

            if(GameInst.nodeMap.map[this.target].down != null)
            {
                dest.push(GameInst.nodeMap.map[this.target].down);
            }

            if(GameInst.nodeMap.map[this.target].left != null)
            {
                dest.push(GameInst.nodeMap.map[this.target].left);
            }

            if(GameInst.nodeMap.map[this.target].right != null)
            {
                dest.push(GameInst.nodeMap.map[this.target].right);
            }

            let newTarget = dest[Math.floor(Math.random()* dest.length)];



            do
            {
                newTarget = dest[Math.floor(Math.random()* dest.length)];

            }while((this.targetIsValid(newTarget) == false) && (dest.length > 1));

            this.previousTarget = this.target;
            this.target = newTarget;

            let target = this.getNodePosition(this.target);

            this.velocity.x = target.x - this.position.x;
            this.velocity.y = target.y - this.position.y;
            this.velocity.normalize();
        }
        else
        {
            this.position.x += this.velocity.x * this.speed;
            this.position.y += this.velocity.y * this.speed;
        }
    }

    draw()
    {
        let spiteLabel = this.type+'-';

        if( Math.abs(this.velocity.x)  > Math.abs(this.velocity.y))
        {
            if (this.velocity.x > 0)
            {
                spiteLabel += 'r';
            }
            else
            {
                spiteLabel += 'l';
            }
        }
        else
        {
            if(this.velocity.y < 0 )
            {
                spiteLabel += 'u';
            }
            else
            {
                spiteLabel += 'd';
            }
        }

        if ((GameInst.frameCount % 16) > 7)
        {
            spiteLabel += '1';
        }
        else
        {
            spiteLabel += '0';
        }

        GameInst.spritesheet.DrawSprite(spiteLabel,new Vector2((this.position.x*8)-4, (this.position.y*8)-4) );

        let target = this.getNodePosition(this.target);

        /*
        GAZCanvas.Line(new Vector2((this.position.x*8)-4, (this.position.y*8)-4)
            ,new Vector2(target.x*8, target.y*8)
        ,'#ffffff'
        ,0.5);
         */
    }
}