//*********************************************************************************************************************
//
//*********************************************************************************************************************
class GameState_Test extends StateMachineState
{
    static label()
    {
        return "GameState_Test";
    }
    
    constructor()
    {
        super();
    }
    
    init()
    {
        super.init()
    }
    
    update()
    {
        super.update()
        GameInst.updateScene();


    }

    numberWithCommas(x)
    {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    draw()
    {
        super.draw();
        
        GAZCanvas.Rect(new Rect(0, 0, 1600, 900),'#000000');

        GameInst.drawScene();

        let date1 = new Date(Date.now());
        //let date2 = new Date("03/07/2020");
        let date2 = new Date("1/5/2026");

        let Difference_In_Time = date2.getTime() - date1.getTime();

        if(Difference_In_Time < 0)
        {
            Difference_In_Time = 0;
        }

        let Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));



        GAZCanvas.Text(500
            ,Difference_In_Days
            , new Vector2(1600/2,1000/2)
            ,'#ffffff'
            ,'center'
            ,'Archivo Black');


        GAZCanvas.Text(50
            ,this.numberWithCommas(Math.floor(Difference_In_Time/1000.0))
            , new Vector2(1600/2,870)
            ,'#00ff00'
            ,'center'
            ,'Archivo Black')
    }
}

