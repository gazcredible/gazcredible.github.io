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

    update(model)
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

                mouseInModelSpace.x = (mouseInModelSpace.x - model.offset.x) / this.mapcell_size;
                mouseInModelSpace.y = (mouseInModelSpace.y - model.offset.y) / this.mapcell_size;

                if (pc.isPointInMe(mouseInModelSpace) == true)
                {
                    //console.log(model.last_frame_time.toString() + ' ' + i + ' mouse in me!');
                }
            }
            ob.push(pc);
        }

        this.debug_stuff = [];

        if (model.player !== undefined)
        {
            for (let y = 0; y < this.grid.length; y++)
            {
                for (let x = 0; x < this.grid[y].length; x++)
                {
                    let lc = new LineCollider();
                    lc.init(x + 0.5, y + 0.5, model.player.logicalPosition.x + 0.5, model.player.logicalPosition.y + 0.5);

                    let pos0 = model.logical_to_drawing_postion(lc.linelist[0].x0, lc.linelist[0].y0);
                    let pos1 = model.logical_to_drawing_postion(lc.linelist[0].x1, lc.linelist[0].y1);

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

    getCell(x,y)
    {
        return this.grid[y][x];
    }

}

class OwnershipGrid
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
                row.push(undefined);
            }
        }
    }

    get(mapcell)
    {
        try
        {
            return this.grid[mapcell.y][mapcell.x];
        }
        catch (e)
        {
            console.log(e.toString());
        }

    }

    set(mapcell, owner)
    {
        try
        {
            this.grid[mapcell.y][mapcell.x] = owner;
        }
        catch (e)
        {
            console.log(e.toString());
        }
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
        this.ownership = new OwnershipGrid();

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
        this.navgrid.init(20, 12);
        this.heatmap.init(20, 12);
        this.ownership.init(20, 12);

        this.obstacles = [];

        if (false)
        {
            let cover = [[6, 3],
                [14, 3],
                [14, 8], [6, 8]
            ];

            for (let i = 0; i < cover.length; i++)
            {
                let obstacle = new GameObstacle(this);

                obstacle.setFromMapCell(new MapCell(cover[i][0], cover[i][1]));
                this.obstacles.push(obstacle);
            }
        }

        this.badman = new BaddieManager();
        this.baddies = [];

        this.spawnpoints = [];

        this.dancingQueen = new TroupeManager();

        this.dancingQueen.init();

        /*
        let spawnPoint = new SpawnPoint();
        spawnPoint.setFromMapCell(new MapCell(1, 1));
        this.badman.add_spawnpoint(spawnPoint);
        this.spawnpoints.push(spawnPoint);

        this.player = new Player();
        this.player.setFromMapCell(new MapCell(10, 6));
        */

        this.tickCount = 0;

        this.previous_beat_time = 0;
        this.step = 0;

        this.audio_context = 0;
        this.masterVolume = 0;

        this.audio_context = new (window.AudioContext || window.webkitAudioContext)();

        this.masterVolume = this.audio_context.createGain();
        this.masterVolume.gain.value = 1.0;
        this.masterVolume.connect(this.audio_context.destination);

        this.mapcell_size = 64;
        this.offset = new IVector2(32, 32);
    }

    logical_to_drawing_postion(x,y)
    {
        return [this.offset.x +(x*this.mapcell_size),this.offset.y+(y*this.mapcell_size)];
    }

    logical_to_drawing_postion_from_mapcell(mapcell)
    {
        return this.logical_to_drawing_postion(mapcell.x,mapcell.y);
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

                if (this.step === 1) // use this test IF you are triggering on measures, not beats / steps
                {
                    this.beat = true;
                }
            }
        }
        this.heatmap.update(this);

        for(let i=0;i< this.obstacles.length;i++)
        {
            this.obstacles[i].update();
        }

        this.badman.update();
        this.dancingQueen.update(this.time_since_last_update());


        if(this.player !== undefined)
        {
            this.player.update();
        }
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

    draw_grid()
    {
        //this.navgrid.draw();
        //this.heatmap.draw();

        for(let y=0;y<this.navgrid.grid.length; y++)
        {
            for(let x=0;x < this.navgrid.grid[y].length;x++)
            {
                let pos = this.logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],this.mapcell_size-1,this.mapcell_size-1)

                let color = '#000000';
                let text_col = '#ffffff';

                if(this.heatmap.isVisibleToPlayer(this.navgrid.grid[y][x]) === false)
                {
                    color = '#00ff00';
                    text_col = '#000000';
                }

                GAZCanvas.Rect(rect, color, true, 1);

                if(this.ownership.grid[y][x] !== undefined)
                {
                    GAZCanvas.Rect(rect, '#7f0000', true, 1);
                }

                GAZCanvas.Rect(rect, '#ffffff', false, 1);

                GAZCanvas.Text(12, this.navgrid.getCell(x,y).toString(), rect.getCentre(),text_col,'centre');
            }
        }

        for(let y=0;y<this.navgrid.grid.length; y+=2)
        {
            for(let x=0;x < this.navgrid.grid[y].length;x+=2)
            {
                let pos = this.logical_to_drawing_postion(x,y);
                let rect =  new Rect(pos[0],pos[1],this.mapcell_size*2-1,this.mapcell_size*2-1)
                GAZCanvas.Rect(rect,'#0000ff',false,1);
            }
        }

    }

    draw_baddie(baddie)
    {
        let color = '#ff0000';

        if(this.isBeat() === true)
        {
            color = '#ffffff';
        }

        if(baddie.route !== undefined)
        {
            let actual_route = [];
            actual_route.push(baddie.logicalPosition);
            actual_route.push(baddie.traversal_dest);

            for(let i=0;i< baddie.route.length;i++)
            {
                actual_route.push(baddie.route[i].toVector2());
            }

            for(let i=0;i< actual_route.length-1;i++)
            {
                let pos0 = this.logical_to_drawing_postion(actual_route[i].x,actual_route[i].y);

                pos0[0] += ((this.mapcell_size)/2);
                pos0[1] += ((this.mapcell_size)/2);

                let pos1 = this.logical_to_drawing_postion(actual_route[i+1].x,actual_route[i+1].y);

                pos1[0] += ((this.mapcell_size)/2);
                pos1[1] += ((this.mapcell_size)/2);

                GAZCanvas.Line(new Vector2(pos0[0], pos0[1]),new Vector2(pos1[0], pos1[1]),color,2);
            }
        }

        let baddie_size = 16;
        let pos = this.logical_to_drawing_postion(baddie.logicalPosition.x,baddie.logicalPosition.y);

        pos[0] += ((this.mapcell_size-baddie_size)/2);
        pos[1] += ((this.mapcell_size-baddie_size)/2);

        let rect =  new Rect(pos[0],pos[1],baddie_size,baddie_size)

        GAZCanvas.Rect(rect,color,true);

        let pos0 = this.logical_to_drawing_postion(baddie.logicalPosition.x,baddie.logicalPosition.y);

        let text = baddie.t_value.toFixed(2).toString() + ' ' + baddie.debug_text;

        GAZCanvas.Text(17,text,new Vector2(pos0[0]+1,pos0[1]+1),'#000000');
        GAZCanvas.Text(17,text,new Vector2(pos0[0],pos0[1]),'#ffffff');

        baddie.debug_text = '';
    }

    draw_obstacles(obstacle)
    {
        let pos = this.logical_to_drawing_postion_from_mapcell(obstacle.currentCell());
        let obs_border = 8;

        let rect =  new Rect(pos[0]+obs_border,pos[1]+obs_border,this.mapcell_size-(obs_border*2),this.mapcell_size-(obs_border*2));
        GAZCanvas.Rect(rect,'#7f7f7f',true);

        let cover_size = 8;
        for(let i=0;i<obstacle.cover.length;i++)
        {
            pos = this.logical_to_drawing_postion_from_mapcell(obstacle.cover[i]['mapcell']);
            rect =  new Rect(pos[0]+((this.mapcell_size - cover_size)/2),pos[1]+((this.mapcell_size - cover_size)/2),cover_size,cover_size);

            let colour = '#7f7f7f'
            if(this.heatmap.isVisibleToPlayer(obstacle.cover[i]['mapcell']) == false)
            {
                colour = '#007f00';
            }

            GAZCanvas.Rect(rect, colour, true);
        }
    }

    draw_player(player)
    {
        if(player !== undefined)
        {
            let pos = this.logical_to_drawing_postion_from_mapcell(player.logicalPosition);
            let rect = new Rect(pos[0] + 8, pos[1] + 8, this.mapcell_size - 16, this.mapcell_size - 16)
            GAZCanvas.Rect(rect, '#ffff00', true);
        }
    }

    draw_dancingQueen()
    {
        this.draw_baddie(this.dancingQueen);

        for(let i=0;i<this.dancingQueen.baddies.length;i++)
        {
            this.draw_baddie(this.dancingQueen.baddies[i]);
        }
    }

    draw()
    {
        this.draw_grid();

        for(let i=0;i< this.obstacles.length;i++)
        {
            this.draw_obstacles(this.obstacles[i]);
        }

        this.draw_player(this.player);

        for(let i=0;i< this.baddies.length;i++)
        {
            this.draw_baddie(this.baddies[i]);
        }

        this.draw_dancingQueen();

        let text = this.getBPM().toString() + ': ' + this.step + (this.beat === true? 'beat' : '');

        GAZCanvas.Text(20, text, new Vector2(10, 20), '#ffffff', 'left');
    }

    getOwner(mapcell)
    {
        return this.ownership.get(mapcell);
    }

    GameObject_toString(obj)
    {
        if(obj === undefined)
        {
            return 'undefined';
        }

        return obj.toString();
    }

    setOwner(owner,mapcell)
    {
        if(this.isValidLocation(owner,mapcell) === true)
        {
            if (this.getOwner(mapcell) === undefined)
            {
                this.ownership.set(mapcell, owner);
                return;
            }

            if (this.getOwner(mapcell) === owner)
            {
                this.ownership.set(mapcell, owner);
                return;
            }
        }

        console.log('setOwner() - can\'t change ownership');
    }

    removeOwner(owner,mapcell)
    {
        if(this.ownership.get(mapcell) === owner)
        {
            this.ownership.set(mapcell, undefined);
        }
    }

    canIGoHere(agent, mapcell)
    {
        if(this.getOwner(mapcell) === undefined)
        {
            return true;
        }

        return false;
    }


    isValidLocation(agent, mapcell)
    {
        if(mapcell.x < 0)  return false;
        if(mapcell.y < 0)  return false;

        if(mapcell.x > 19)  return false;
        if(mapcell.y > 11)  return false;

        for(let i=0;i< this.obstacles.length;i++)
        {
            if(mapcell.Equals(this.obstacles[i].currentCell()) === true)
            {
                return false;
            }
        }

        if(this.getOwner(mapcell) === undefined)
        {
            return true;
        }

        if(this.getOwner(mapcell) === agent)
        {
            return true;
        }


        return false;
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
