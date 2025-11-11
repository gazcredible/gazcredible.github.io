// JavaScript Document

var gGameApp		=		null;
var gGameRoot;

//GARETH - global things
var gMouseState = null;
var gCanvas = null;

var gEnableAudio = true;


function initGameApp()
{
	gGameRoot =	gt('GameContainer');
    gMouseState = new RMMouseState();

	createGameApp('testApp');
}
