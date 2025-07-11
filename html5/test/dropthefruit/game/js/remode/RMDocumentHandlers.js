/*
	
	RMDocumentHandlers
	V 0.0
	Remode Studios
	22/02/12
	Chris Hebert

*/

function initDocumentHandlers(){

	if(window.addEventListener)
    {
		window.addEventListener('load',onDocumentLoad);
		window.addEventListener('mousemove',onMouseMove);
		window.addEventListener('mouseup',onDocumentMouseUp);
		window.addEventListener('mousedown',onDocumentMouseDown);
		window.addEventListener('keyup',onDocumentKeyUp);

        window.addEventListener('keydown',onDocumentKeyDown);
        window.addEventListener('keypress',onDocumentKeyPress);

        window.addEventListener('touchstart',onDocumentMouseDown);
        window.addEventListener('touchmove',onMouseMove);
        window.addEventListener('touchend',onDocumentMouseUp);

        document.addEventListener("webkitvisibilitychange", handleVisibilityChange, false);
        document.addEventListener("mozvisibilitychange", handleVisibilityChange, false);
        document.addEventListener("visibilitychange", handleVisibilityChange, false);

//        window.addEventListener('webkitvisibilitychange',onVisibilityChange);
	}
    else
    {
		window.onload		=	onDocumentLoad;	
	    window.onmousemove	=	onMouseMove;
		window.onmouseup	=	onDocumentMouseUp;
		window.mousedown	=	onDocumentMouseDown;
		window.onkeyup		=	onDocumentKeyUp;

        window.onkeydown = onDocumentKeyDown;
        window.onkeypress = onDocumentKeyPress;

        window.ontouchstart = onDocumentMouseDown;
        window.ontouchmove = onMouseMove;
        window.ontouchend = onDocumentMouseUp;
	}
}

function handleVisibilityChange(evt)
{
    var state;
    if(document.webkitHidden != undefined)
    {
        state = document.webkitHidden;
    }

    if(document.mozHidden != undefined)
    {
        state = document.mozHidden;
    }

    if(document.hidden != undefined)
    {
        state = document.hidden;
    }

    gRMPlatform.setIsBrowserVisible(!state);
}

function hideAddressBar()
{
    if(!window.location.hash)
    {
        if(document.height <= window.outerHeight + 10)
        {
            document.body.style.height = (window.outerHeight + 50) +'px';
            setTimeout( function(){ window.scrollTo(0, 1); }, 50 );
        }
        else
        {
            setTimeout( function(){ window.scrollTo(0, 1); }, 0 );
        }
    }
}
 
window.addEventListener("orientationchange", hideAddressBar );

function onDocumentKeyUp(evt)
{
	evt	= evt || window.event;
	
	var theKeyCode	= evt.keyCode || evt.which;

	return false;
}

function onDocumentKeyDown(evt)
{
    evt = evt || window.event;

    var theKeyCode = evt.keyCode || evt.which;

    return false;
}

function onDocumentKeyPress(evt)
{
    evt	= evt || window.event;

    var theKeyCode = evt.keyCode || evt.which;

    return false;
}

function onDocumentLoad(evt)
{
	evt		=		evt || window.event;
	if(!window.pageYOffset){ hideAddressBar(); }
	initGameApp();
}

function onDocumentMouseUp(evt)
{
    if(gMouseState != null)
    {
        gMouseState.setRawState(false);
        var location = mouseLoc(evt);
    }
}

function doStuff()
{
}

function onDocumentMouseDown(evt)
{
    if(gMouseState != null)
    {
        gMouseState.setRawState(true);
        var location = mouseLoc(evt);
        gMouseState.setPosition(location.x,location.y);
    }

    //doStuff();
    if(gAudioWebkit!= undefined)    gAudioWebkit.onInputEvent();
    if(gBuzzAudio != undefined)     gBuzzAudio.onInputEvent();
    if(gHowlerAudio != undefined)     gHowlerAudio.onInputEvent();
}

function onMouseMove(evt)
{
	evt = evt || window.event;
    var location = mouseLoc(evt);
    if(gMouseState != undefined)
    {
        gMouseState.setPosition(location.x,location.y);
    }
    return;//GARETH
}

function mouseLoc(evt)
{
	var outLoc	=
    {
			x:0,
			y:0
		}
	
	if(evt.touches){
		if(evt.touches.length) evt = evt.touches[0];	
	}
	//evt		=		evt || evt.touches[0];
	
	if (evt.pageX){
		outLoc.x		=		evt.pageX;
		outLoc.y		=		evt.pageY;
	}else if (evt.clientX){
		
		outLoc.x		=		evt.clientX + (document.documentElement.scrollLeft ?  document.documentElement.scrollLeft : document.body.scrollLeft);
		outLoc.y		=		evt.clientY + (document.documentElement.scrollTop ?  document.documentElement.scrollTop : document.body.scrollTop);
	
	}
	return outLoc;
}


initDocumentHandlers();