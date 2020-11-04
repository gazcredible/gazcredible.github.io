class IVector2
{
    constructor(x,y)
    {
        if(x === undefined)
        {
            this.x = 0;
            this.y = 0;
        }
        else
        {
            this.x = x;
            this.y = y;
        }
    }

    set(souce)
    {
        this.x = x;
        this.y = y;
    }

    Equals(target)
    {
        return ((this.x === target.x) && (this.y === target.y));
    }

    clone(source)
    {
        this.x = source.x;
        this.y = source.y;
    }

    distance(source)
    {
        return Math.sqrt( Math.pow(this.x-source.x,2) + Math.pow(this.y - source.y,2));
    }

    toVector2()
    {
        return new Vector2(this.x, this.y);
    }
}

class MapCell extends IVector2
{
    constructor(x,y)
    {
        super();

        if(x !== undefined)
        {
            this.x = x;
            this.y = y;
        }
        else
        {
            this.x = 0;
            this.y = 0;
        }
        this.owner = -1;
    }

    clone()
    {
        return new MapCell(this.x,this.y);
    }

    toString()
    {
        return ''+ this.x +':'+this.y;
    }
}


let MapCell_Size = 64;
let offset = new IVector2(32,32);

function logical_to_drawing_postion(x,y)
{
    return [offset.x +(x*MapCell_Size),offset.y+(y*MapCell_Size)];
}

function logical_to_drawing_postion_from_mapcell(mapcell)
{
    return logical_to_drawing_postion(mapcell.x,mapcell.y);
}

class Heatmap
{
    constructor()
    {
        this.debug_stuff = {};
    }

    init(width, height)
    {
        this.grid = new Array()

        for(let y = 0; y < height;y++)
        {
            let row = new Array();

            this.grid.push(row);

            for(let x = 0;x < width;x++)
            {
                row.push(false);
            }
        }

        this.star_edges = [new Vector2(10.5, 0.5),
            new Vector2(13.5, 4.5),
            new Vector2(18.5, 4.5),
            new Vector2(15.5, 7.5),
            new Vector2(13.5, 11.5),
            new Vector2(10.5, 9.5),
            new Vector2(6.5, 11.5),
            new Vector2(4.5, 7.5),
            new Vector2(2.5, 4.5),
            new Vector2(7.5, 4.5),
        ];

        for(let i=0;i< this.star_edges.length;i++)
        {
            this.star_edges[i].x -= 2;
        }

        this.sc = new PolyCollider();
        this.sc.init(this.star_edges);

    }

    update()
    {
        let ob = [];

        for (let i = 0; i < model.obstacles.length; i++)
        {
            let pc = new PolyCollider();

            let pos = model.obstacles[i].logicalPosition.clone();

            let edges = [];
            edges.push(new Vector2(pos.x, pos.y));
            edges.push(new Vector2(pos.x + 1, pos.y));
            edges.push(new Vector2(pos.x + 1, pos.y + 1));
            edges.push(new Vector2(pos.x, pos.y + 1));

            pc.init(edges);

            if (Input.mouseLogicalPos !== undefined)
            {
                let mouseInModelSpace = Input.mouseLogicalPos.clone()

                mouseInModelSpace.x = (mouseInModelSpace.x - offset.x) / MapCell_Size;
                mouseInModelSpace.y = (mouseInModelSpace.y - offset.y) / MapCell_Size;

                if (pc.isPointInMe(mouseInModelSpace) == true)
                {
                    //console.log(model.last_frame_time.toString() + ' ' + i + ' mouse in me!');
                }
            }
            ob.push(pc);
        }

        this.debug_stuff = [];

        for (let y = 0; y < this.grid.length; y++)
        {
            for (let x = 0; x < this.grid[y].length; x++)
            {
                let lc = new LineCollider();
                lc.init(x + 0.5, y + 0.5, model.player.logicalPosition.x + 0.5, model.player.logicalPosition.y + 0.5);

                let pos0 = logical_to_drawing_postion(lc.linelist[0].x0, lc.linelist[0].y0);
                let pos1 = logical_to_drawing_postion(lc.linelist[0].x1, lc.linelist[0].y1);

                let data = {};
                data['p0'] = new Vector2(pos0[0], pos0[1]);
                data['p1'] = new Vector2(pos1[0], pos1[1]);
                data['col'] = '#ffffff';

                this.grid[y][x] = true; // visible to player
                for (let c = 0; c < ob.length; c++)
                {
                    if (lc.collides(ob[c]))
                    {
                        this.grid[y][x] = false; //player view hits collider
                        data['col'] = '#ff0000';
                    }
                }

                this.debug_stuff.push(data);
            }
        }

        return;

        for (let y = 0; y < this.grid.length; y++)
        {
            for (let x = 0; x < this.grid[y].length; x++)
            {
                let cell_edges = [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];

                this.grid[y][x] = false;

                for (let i = 0; i < cell_edges.length; i++)
                {
                    if (this.sc.isPointInMe(new Vector2(cell_edges[i][0], cell_edges[i][1])) !== true)
                    {
                        this.grid[y][x] = true;
                    }
                    else
                    {
                        console.log('point in me');
                    }
                }
            }
        }
    }

    draw()
    {
        for (let y = 0; y < this.grid.length; y++)
        {
            for (let x = 0; x < this.grid[y].length; x++)
            {
                if (this.grid[y][x])
                {
                    let pos = logical_to_drawing_postion(x,y);
                    let rect =  new Rect(pos[0],pos[1],MapCell_Size-1,MapCell_Size-1)
                    //GAZCanvas.Text(12, collision.toString(), rect.getCentre(),'#ffffff','centre');

                    GAZCanvas.Rect(rect, '#7f0000', false, 3);
                }
            }
        }

        return

        for (let i=0;i< this.debug_stuff.length;i++)
        {
            GAZCanvas.Line(this.debug_stuff[i]['p0'], this.debug_stuff[i]['p1'], this.debug_stuff[i]['col'],2 );
        }

        return;

        for(let i=0;i<this.sc.linelist.length;i++)
        {
            let pos0 = logical_to_drawing_postion(this.sc.linelist[i].x0,this.sc.linelist[i].y0);
            let pos1 = logical_to_drawing_postion(this.sc.linelist[i].x1,this.sc.linelist[i].y1);

            GAZCanvas.Line(new Vector2(pos0[0],pos0[1]), new Vector2(pos1[0], pos1[1]),'#ffffff',3);
        }
    }

    isVisibleToPlayer(mapcell)
    {
        return this.grid[mapcell.y][mapcell.x];
    }
}


class NavGrid
{
    constructor()
    {
    }

    init(width, height)
    {
        this.grid = new Array()

        for(let y = 0; y < height;y++)
        {
            let row = new Array();

            this.grid.push(row);

            for(let x = 0;x < width;x++)
            {
                row.push(new MapCell(x,y));
            }
        }
    }

    draw()
    {
        for(let y=0;y<this.grid.length; y++)
        {
            for(let x=0;x < this.grid[y].length;x++)
            {
                let pos = logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],MapCell_Size-1,MapCell_Size-1)

                let color = '#000000';
                let text_col = '#ffffff';

                if(model.heatmap.isVisibleToPlayer(this.grid[y][x]) === false)
                {
                    color = '#00ff00';
                    text_col = '#000000';
                }

                GAZCanvas.Rect(rect, color, true, 1);

                if(this.grid[y][x].owner !== -1)
                {
                    GAZCanvas.Rect(rect, '#7f0000', true, 1);
                }

                GAZCanvas.Rect(rect, '#ffffff', false, 1);

                GAZCanvas.Text(12, this.getCell(x,y).toString(), rect.getCentre(),text_col,'centre');
            }
        }

        for(let y=0;y<this.grid.length; y+=2)
        {
            for(let x=0;x < this.grid[y].length;x+=2)
            {
                let pos = logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],MapCell_Size*2-1,MapCell_Size*2-1)
                GAZCanvas.Rect(rect,'#0000ff',false,1);
            }
        }
    }

    getCell(x,y)
    {
        return this.grid[y][x];
    }

}

let global_ID = 1;

class GameObject
{
    constructor()
    {
        this.logicalPosition = new Vector2(0,0);
        this.ID = global_ID;
        global_ID += 1;
    }

    update()
    {

    }

    draw()
    {
    }

    IsValidCell(cell)
    {
        if(cell.x < 0)  return false;
        if(cell.y < 0)  return false;

        if(cell.x > 19)  return false;
        if(cell.y > 11)  return false;

        for(let i=0;i< model.obstacles.length;i++)
        {
            if(cell.Equals(model.obstacles[i].currentCell()) === true)
            {
                return false;
            }
        }

        return true;
    }

    IsValidTransition(start, target)
    {
        if(this.IsValidCell(target) === true)
        {
            return true;
        }

        return false;
    }

    setFromMapCell(mapcell)
    {
        this.logicalPosition.x = mapcell.x;
        this.logicalPosition.y = mapcell.y;

        model.setOwner(this,mapcell);
    }

    currentCell()
    {
        if(this.logicalPosition === undefined)
        {
            throw 'undefined pos!';
        }

        return new MapCell( Math.floor(this.logicalPosition.x), Math.floor(this.logicalPosition.y));
    }
}

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

            if(model.isValidLocation(pos.x,pos.y))
            {
                let data = {}
                data['mapcell'] = pos;
                data['owner'] = undefined;
                this.cover.push(data);
            }
        }
    }

    draw()
    {
        super.draw()
        let pos = logical_to_drawing_postion_from_mapcell(this.currentCell());
        let rect =  new Rect(pos[0]+2,pos[1]+2,MapCell_Size-4,MapCell_Size-4)
        GAZCanvas.Rect(rect,'#7f7f7f',true);

        let cover_size = 8;
        for(let i=0;i<this.cover.length;i++)
        {
            pos = logical_to_drawing_postion_from_mapcell(this.cover[i]['mapcell']);
            rect =  new Rect(pos[0]+((MapCell_Size - cover_size)/2),pos[1]+((MapCell_Size - cover_size)/2),cover_size,cover_size);

            let colour = '#7f7f7f'
            if(model.heatmap.isVisibleToPlayer(this.cover[i]['mapcell']) == false)
            {
                colour = '#00ff00';
            }

            GAZCanvas.Rect(rect, colour, true);
        }
    }
}

class GameAgent extends GameObject
{
    constructor()
    {
        super();
        //TBD
    }

    update()
    {
        super.update();
    }

    draw()
    {
        super.draw()
        let baddie_size = 16;
        let pos = logical_to_drawing_postion(this.logicalPosition.x,this.logicalPosition.y);

        pos[0] += ((MapCell_Size-baddie_size)/2);
        pos[1] += ((MapCell_Size-baddie_size)/2);

        let rect =  new Rect(pos[0],pos[1],baddie_size,baddie_size)

        let color = 'ff0000';

        if(model.isBeat() === true)
        {
            color = '#ffffff';
        }

        GAZCanvas.Rect(rect,color,true);
    }

    IsValidCell(cell)
    {
        if(cell.x < 0)  return false;
        if(cell.y < 0)  return false;

        if(cell.x > 19)  return false;
        if(cell.y > 11)  return false;

        return super.IsValidCell(cell);
    }

    IsValidTransition(start, target)
    {
        if(this.IsValidCell(target) === true)
        {
            return true;
        }

        return false;
    }

}

class Player extends GameObject
{
    constructor()
    {
        super();
        this.size = 16;
    }

    setFromMapCell(mapcell)
    {
        super.setFromMapCell(mapcell);
    }

    update()
    {
        let new_pos = this.logicalPosition.clone();

        if(Input.getKeystate(KEYCODE_left_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.x = this.logicalPosition.x - 0.1;
        }

        if(Input.getKeystate(KEYCODE_right_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.x = this.logicalPosition.x + 0.1;
        }

        if(Input.getKeystate(KEYCODE_up_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.y = this.logicalPosition.y - 0.1;
        }

        if(Input.getKeystate(KEYCODE_down_arrow) !== INPUT_NOT_PRESSED)
        {
            new_pos.y = this.logicalPosition.y + 0.1;
        }

        if((new_pos.x !== this.logicalPosition.x) || (new_pos.y !== this.logicalPosition.y))
        {
            if(model.isValidLocation(new_pos.x, new_pos.y) && this.canMoveTo(new_pos.x, new_pos.y)===true)
            {
                //work out the upto 4 cells the player is interacting with and take them out
                let cells = {};

                let offsets = [[0,0], [1,0], [0,1], [1,1]];
                for(let i=0;i< offsets.length;i++)
                {
                    let pos = this.logicalPosition.clone();
                    pos.x = Math.floor(pos.x + offsets[i][0]*0.9);
                    pos.y = Math.floor(pos.y + offsets[i][1]*0.9);

                    if(pos in cells == false)
                    {
                        cells[pos] = pos;
                        model.removeOwner(this, pos);
                    }
                }

                this.logicalPosition.x = new_pos.x;
                this.logicalPosition.y = new_pos.y;

                //work out the upto 4 cells the player is interacting with and add them int

                cells = {};

                for(let i=0;i< offsets.length;i++)
                {
                    let pos = this.logicalPosition.clone();
                    pos.x = Math.floor(pos.x + offsets[i][0]*0.9);
                    pos.y = Math.floor(pos.y + offsets[i][1]*0.9);

                    if(pos in cells == false)
                    {
                        cells[pos] = pos;
                        model.setOwner(this, pos);
                    }
                }
            }
        }
    }

    draw()
    {
        super.draw()
        //let pos = logical_to_drawing_postion_from_mapcell(this.currentCell());
        let pos = logical_to_drawing_postion_from_mapcell(this.logicalPosition);
        let rect =  new Rect(pos[0]+8,pos[1]+8,MapCell_Size-16,MapCell_Size-16)
        GAZCanvas.Rect(rect,'#ffff00',true);
    }


    canMoveTo(x,y)
    {
        //does x,y overlap any obstacles or baddies?

        let playercollider = new PolyCollider();

        let pos =  new Vector2(x,y); //this.logicalPosition.clone();
        //pos.x = Math.floor(pos.x);
        //pos.y = Math.floor(pos.y);

        let edges = [];
        edges.push(new Vector2(pos.x+0,pos.y+0));
        edges.push(new Vector2(pos.x+1,pos.y+0));
        edges.push(new Vector2(pos.x+1,pos.y+1));
        edges.push(new Vector2(pos.x+0,pos.y+1));

        playercollider.init(edges);

        for(let i=0;i< model.obstacles.length;i++)
        {
            let obscollider = new PolyCollider();
            pos =  model.obstacles[i].logicalPosition.clone();

            edges = [];
            edges.push(new Vector2(pos.x+0,pos.y+0));
            edges.push(new Vector2(pos.x+1,pos.y+0));
            edges.push(new Vector2(pos.x+1,pos.y+1));
            edges.push(new Vector2(pos.x+0,pos.y+1));

            obscollider.init(edges);

            if(playercollider.collides(obscollider) === true)
            {
                return false;
            }
        }

        return true;
    }
}


class SpawnPoint extends GameObject
{
    constructor()
    {
        super();
    }
}

class Model
{
    constructor()
    {
        this.navgrid = new NavGrid();
        this.obstacles = [];
        this.baddies = [];
        this.player = undefined;
        this.heatmap = new Heatmap();

        this.elapsed_time = 0;
        this.previous_beat_time = 0;
        this.step = 0;

        this.audio_context=0;
        this.masterVolume=0;

        this.sim_active = false;

        this.last_frame_time = 0;
        this.current_frame_time = 0;
        this.frame_time = 0;
    }

    init()
    {
        this.navgrid.init(20,12);
        this.heatmap.init(20,12);

        this.obstacles = [];

        if(true)
        {
            let cover = [[6,3],
                [14,3],
                [14,8],[6,8]
            ];

            for (let i = 0; i < cover.length; i++)
            {
                let obstacle = new GameObstacle(this);

                obstacle.setFromMapCell(new MapCell(cover[i][0], cover[i][1]));
                this.obstacles.push(obstacle);
            }
        }

        this.baddies = [];

        this.spawnpoints = [];

        let spawnPoint = new SpawnPoint();
        spawnPoint.setFromMapCell(new MapCell(1,1));
        baddieManager.add_spawnpoint(spawnPoint);
        this.spawnpoints.push(spawnPoint);

        //let baddie = new GameAgent();
        //baddie.setFromMapCell(new MapCell(0,0));
        //this.baddies.push(baddie);

        this.player = new Player();
        this.player.setFromMapCell(new MapCell(10,6));

        this.tickCount = 0;

        this.previous_beat_time = 0;
        this.step = 0;

        this.audio_context=0;
        this.masterVolume=0;

        this.audio_context = new (window.AudioContext || window.webkitAudioContext)();

        this.masterVolume = this.audio_context.createGain();
        this.masterVolume.gain.value = 1.0;
        this.masterVolume.connect(this.audio_context.destination);
    }

    addBaddie(baddie)
    {
        this.baddies.push(baddie);
    }

    update()
    {
        this.beat = false;

        if(Input.currentMouseState === INPUT_PRESSED)
        {
            this.audio_context.resume();
            this.sim_active = true;
        }


        if(this.sim_active === true)
        {
            this.last_frame_time = this.current_frame_time;
            this.current_frame_time = this.audio_context.currentTime;
            this.frame_time = this.current_frame_time - this.last_frame_time;

            this.elapsed_time = this.current_frame_time - this.previous_beat_time;

            if (this.elapsed_time > this.get_beat_time())
            {
                //a beat (step) has occurred
                this.previous_beat_time += this.elapsed_time;

                this.step = (this.step) % 4;
                this.step += 1;

                //if (this.step === 1) // use this test IF you are triggering on measures, not beats / steps
                {
                    this.beat = true;
                }
            }
        }
        this.heatmap.update();

        for(let i=0;i< this.obstacles.length;i++)
        {
            this.obstacles[i].update();
        }

        baddieManager.update();

        this.player.update();
    }

    time_since_last_update()
    {
        return this.frame_time;
    }

    isBeat()
    {
        return this.beat;
    }

    //time in seconds for one measure (a 1-2-3-4 beat sequence)
    get_measure_time()
    {
        return 60 / this.getBPM();
    }

    //time in seconds for one beat (a 1,2,3 or 4 time)
    get_beat_time()
    {
        return this.get_measure_time()/4.0; // as it's 4 beats to the bar (measure)
    }

    getBPM()
    {
        return 147;
        return 20;
    }


    draw()
    {
        this.navgrid.draw();
        this.heatmap.draw();

        for(let i=0;i< this.obstacles.length;i++)
        {
            this.obstacles[i].draw();
        }

        this.player.draw();

        for(let i=0;i< this.baddies.length;i++)
        {
            this.baddies[i].draw();
        }

        let text = this.getBPM().toString() + ': ' + this.step + (this.beat === true? 'beat' : '');

        GAZCanvas.Text(20, text, new Vector2(10, 20), '#ffffff', 'left');
    }

    setOwner(owner,mapcell)
    {
        if(this.navgrid.getCell(mapcell.x, mapcell.y).owner === -1)
        {
            this.navgrid.getCell(mapcell.x, mapcell.y).owner = owner.ID;
        }
    }

    removeOwner(owner,mapcell)
    {
        if(this.navgrid.getCell(mapcell.x, mapcell.y).owner === owner.ID)
        {
            this.navgrid.getCell(mapcell.x, mapcell.y).owner = -1;
        }
    }

    isValidLocation(x, y)
    {
        if(x < 0)  return false;
        if(y < 0)  return false;

        if(x > 19)  return false;
        if(y > 11)  return false;

        return true;
    }

    get_obstacle_for_baddie(baddie)
    {
        for(let i = 0 ; i< this.obstacles.length;i++)
        {
            for(let j = 0; j < this.obstacles[i].cover.length;j++)
            {
                if(this.obstacles[i].cover[j]['owner'] === baddie)
                {
                    return this.obstacles[i].cover[j]['mapcell'];
                }
            }
        }

        return undefined;
    }

    free_obstacle(mapcell)
    {
        for(let i = 0 ; i< this.obstacles.length;i++)
        {
            for(let j = 0; j < this.obstacles[i].cover.length;j++)
            {
                if(this.obstacles[i].cover[j]['mapcell'].Equals(mapcell))
                {
                    this.obstacles[i].cover[j]['owner'] = undefined;
                    return;
                }
            }
        }

        throw 'mapcell not in obstacle';
    }

    get_free_obstacle_cover(mapcell)
    {
        let best_dist = Number.MAX_VALUE;
        let best_spot = undefined;

        for(let i = 0 ; i< this.obstacles.length;i++)
        {
            for(let j = 0; j < this.obstacles[i].cover.length;j++)
            {
                if( (this.obstacles[i].cover[j]['owner'] === undefined)
                    &&(this.heatmap.isVisibleToPlayer(this.obstacles[i].cover[j]['mapcell']) === false)
                )
                {
                    let dist = mapcell.distance(this.obstacles[i].cover[j]['mapcell']);

                    if(dist < best_dist)
                    {
                        best_dist = dist;
                        best_spot = this.obstacles[i].cover[j];
                    }
                }
            }
        }

        return best_spot;
    }
}

let model = new Model();
