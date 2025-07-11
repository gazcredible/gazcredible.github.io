/*
	
	RMUtils
	V 0.0
	Remode Studios
	22/02/12
	Chris Hebert

*/

function setFade(inID,inValue){
	var theElement	=	gt(inID);
	if(!theElement) return;
	
	theElement.style.MozOpacity		=	String(inValue);
	theElement.style.opacity		=	String(inValue);
	theElement.style.filter			=	'alpha(opacity=' + String(inValue * 100) + ')';
}

function trace(inString){
	var theField	=		gt('Trace');
	if(!theField) return;
	
	theField.innerHTML		=	inString;	
}

function randomChar(inCharMap){
	var theIdx	=		Math.random() * (inCharMap.length -1);
	return inCharMap.charAt(theIdx);	
}

function getTicks(){
		var theDate		=		new Date();
		return theDate.getTime();
}
	
function mk(inType,inStyle){
	var outObj;
	
	outObj		=	document.createElement(inType);
	
	if(inStyle){
		mergeObjects(inStyle,outObj.style);
	}
	
	return outObj;	
}

function gt(inID){
	return document.getElementById(inID);	
}

function resetArray(inArray,inData){
	var i;
	
	for(i=0;i<inArray.length;i++){
		if(!inArray[i].reset) continue;
		inArray[i].reset(inData);
	}
}

function updateArray(inArray,inData){
	var i;
	
	for(i=0;i<inArray.length;i++){
		if(!inArray[i].update) continue;
		inArray[i].update(inData);
	}
}

function drawArray(inArray,inData){
	var i;
	
	for(i=0;i<inArray.length;i++){
		if(!inArray[i].draw) continue;
		inArray[i].draw(inData);
	}
}

function removeFromArray(inArray,inItem){
	var outArray		=		[];
	var i;
	
	for(i=0;i<inArray.length;i++){
		if(inArray[i] == inItem) continue;	
		outArray.push(inArray[i]);
	}
	return outArray;
}

function mergeObjects(inSource,inTarget){

	if(!inSource) return;
	if(!inTarget) return;
	
	var key;
	
	for(key in inSource){
		inTarget[key]	=		inSource[key];	
	}
	
}