
var layerInfo = function()
{
    this.size = new RMRect();
    this.image = new Image();
}

layerInfo.prototype =
{

};


var NodeInfo = function(inName)
{
    this.name = inName;
    this.children = [];
    this.type = "default";
    this.draw = true;

    //button bits
    this.buttonState = "_active";
    this.isButtonSelectable = true;
    this.buttonCallback = undefined;

    //text bits
    this.textValue = "undefined";
    this.textSize = 0;
    this.textJustify =0;
    this.textColour = '#ffffff';

    this.renderCallback = undefined;
}

NodeInfo.prototype =
{
    setButtonIsSelectable:function(inSelectable)
    {
        if(this.type == "button")
        {
            this.isButtonSelectable = inSelectable;
        }
    },

    setButtonStateActive:function()
    {
        this.buttonState = "_active";
    },

    setButtonStateDead:function()
    {
        this.buttonState = "_dead";
    },

    setButtonStateHover:function()
    {
        this.buttonState = "_hover";
    },

    setButtonStatePress:function()
    {
        this.buttonState = "_press";
    },

    addChild:function(inString)
    {
        var node = new NodeInfo(inString);

        // reverse fill arrays
        this.children.unshift(node);

        return node;
    },

    addButton:function(inString,inCallback)
    {
        var node = new NodeInfo(inString);
        node.setButton(inCallback);

        // reverse fill arrays
        this.children.unshift(node);

        node.addChild(inString+"_dead").setDraw(false);
        node.addChild(inString+"_active").setDraw(false);
        node.addChild(inString+"_press").setDraw(false);
        node.addChild(inString+"_hover").setDraw(false);

        return node;
    },

    setButton:function(inCallback)
    {
        this.setType("button");
        this.buttonCallback = inCallback;
    },

    setTextButton:function(inCallback,inString)
    {
        this.setType("textbutton");
        this.setText(inString);
        this.buttonCallback = inCallback;
    },

    setAsText:function()
    {
        this.setType("text");
    },

    setAsSimpleText:function()
    {
        this.setType("simpletext");
    },

    addText:function(inString)
    {
        var node = new NodeInfo(inString);
        node.setAsText();

        // reverse fill arrays
        this.children.unshift(node);
        node.addChild(inString + "_label");
        node.addChild(inString + "_text");
        node.addChild(inString + "_backing");
    },

    addRenderNode:function(inString, inRenderCallback)
    {
        var node = new NodeInfo(inString);
        node.setRenderNode(inRenderCallback);

        // reverse fill arrays
        this.children.unshift(node);

        return node;
    },

    setRenderNode:function(inRenderCallback)
    {
        this.setType("render_node");
        this.renderCallback = inRenderCallback;

    },

    setText:function(inText)
    {
        if((this.type == "text") || (this.type == "textbutton") || (this.type == "simpletext"))
        {
            this.textValue = inText;
        }
    },

    setDraw:function(inEnable)
    {
        this.draw = inEnable;
    },

    setType:function(inType)
    {
        this.type = inType;
    },


    findNode:function(inName)
    {
        if(inName == this.name)
        {
            return this;
        }

        for (var i=0; i<this.children.length; ++i)
        {
            var result = this.children[i].findNode(inName);

            if(result != null)
            {
                return result;
            }
        }

        return undefined;
    },


    update:function(inScreen)
    {
        if(this.callback != undefined)
        {
            this.callback(this,inScreen);
        }
        if((this.type == "button") || (this.type == "textbutton"))
        {
            if(this.isButtonSelectable == false)
            {
                this.setButtonStateDead();
            }
            else
            {
                var layer = null
                if(this.children.length>0)
                {
                    layer = inScreen.layerBank[this.children[0].name];
                }
                else
                {
                    layer = inScreen.layerBank[this.name];
                }
                    if(layer == undefined)  return;

                if( (layer.size.isInMe(inScreen.getUserEventPosition() ) == true)
                  &&(inScreen.getUserEventsEnabled() == true)
                  )
                {
                    switch(inScreen.getUserEvent())
                    {
                        case "held":
                            this.setButtonStatePress();
                            break;

                        case "released":
                            if(this.buttonCallback != undefined)
                            {
                                this.buttonCallback(this,inScreen);
                            }
                            break;

                        default:
                            this.setButtonStateHover();
                    }
                }
                else
                {
                    this.setButtonStateActive();
                }
            }
        }
    }

};


var RMPSDScreen	=	function()
{
    this.layerBank = {};
    this.root = "";
    this.bDrawSprites = true;
    this.bDraw = true;
    this.bDrawText = true;

    this.nodegraph = new NodeInfo("root");

    this.currentState = "";
    this.eventsEnabled = true;

    this.layerCount = 0;
}


RMPSDScreen.prototype	=
{
    getItemsToLoadCount:function()
    {
        if(this.layerCount == 0) return -1;

        var itemCount = 0;

        for(var key in this.layerBank)
        {
            if(this.layerBank.hasOwnProperty(key))
            {
                var value = this.layerBank[key];

                try
                {
                    if( (value.size != undefined)
                        &&(value.size.w >0)
                        )
                    {
                        itemCount++;
                    }
                }catch(e)
                {
                }
            }
        }

        return itemCount;
    },

    getItemsLoadedCount:function()
    {
        if(this.layerCount == 0) return -1;

        var itemCount = 0;

        for(var key in this.layerBank)
        {
            if(this.layerBank.hasOwnProperty(key))
            {
                var value = this.layerBank[key];

                try
                {
                    if( (value.size != undefined)
                        &&(value.size.w >0)
                        )
                    {
                        itemCount++;
                    }
                }catch(e)
                {
                }
            }
        }

        return itemCount;
    },

    isContentLoaded:function()
    {
        if(this.layerCount == 0) return false;

        for(var key in this.layerBank)
        {
            var value = this.layerBank[key];

            try
            {
                if( (value != undefined)
                  &&(value.size.w >0)
                  &&(value.image.width == 0)
                  )
                {
                    return false;
                }
            }catch(e)
            {
            }
        }

        return true;
    },

    getUserEventsEnabled:function()
    {
        return this.eventsEnabled;
    },

    getUserEvent:function()
    {
        return gMouseState.state;
    },

    getUserEventPosition:function()
    {
        if(gMouseState.GLPosition != undefined)
        {
            return gMouseState.GLPosition.clone();
        }

        return new RMVector2(-1,-1);
    },

    addNode:function(nodeName,parentName, textureName,inX,inY,inW,inH)
    {
        this.layerCount++;
        this.addLayer(nodeName,inX,inY,inW,inH,textureName);

        var node = this.nodegraph.findNode(parentName);

        if(node != null)
        {
            node.addChild(nodeName);
        }
    },

    addLayer:function(inName, inX,inY,inW,inH,inFilename)
    {
        if(this.layerBank[inName] == undefined)
        {
            this.layerBank.name = inName;
            this.layerBank[inName] = new layerInfo();

            this.layerBank[inName].size.x = inX;
            this.layerBank[inName].size.y = inY;
            this.layerBank[inName].size.w = inW;
            this.layerBank[inName].size.h = inH;

            if(this.layerBank[inName].size.w > 0)
            {
                this.layerBank[inName].image.src = this.root + inFilename;
            }
        }
    },

    getImage:function(inName)
    {
        return this.layerBank[inName];
    },

    draw:function()
    {
        if(this.bDraw == true)
        {
            this.drawNode(this.nodegraph);
        }
    },

    drawNodeFromName:function(inName,inOffset)
    {
        var node = this.nodegraph.findNode(inName);

        this.drawNode(node,inOffset);
    },

    drawSubTree:function(inNode,inOffset)
    {
        this.drawNode(inNode,inOffset);
    },

    drawNode:function(inNode,inOffset)
    {
        if(inNode.draw != false)
        {
            if(inOffset == undefined)
            {
                inOffset = new RMVector2(0,0);
            }
            // console.log("Drawing: " + inNode.name);
            var layer = this.layerBank[inNode.name];

            inNode.update(this);

            switch(inNode.type)
            {
                case "textbutton":
                {
                    this.drawLayer(inNode.name + inNode.buttonState);

                    var node = this.layerBank[inNode.name + "_text"];
                    if(node != undefined)
                    {
                        if(this.bDrawText == true)
                        {
                            gCanvas.GLTextCentred(34,inNode.textValue,node.size.getCentre(),'#ffffff');
                        }
                    }
                }
                    break;
                case "button":
                {
                    if(this.layerBank[inNode.name].size.w > 0)
                    {
                        this.drawLayerOffset(inNode.name,inOffset);

                    }
                    else
                    {
                        this.drawLayerOffset(inNode.name + inNode.buttonState,inOffset);
                    }
                }
                    break;

                case "simpletext":
                    if(this.bDrawText == true)
                    {
                        var pos = layer.size.getCentre().clone();
                        pos.x += inOffset.x;
                        pos.y += inOffset.y;
                        gCanvas.GLTextCentred(inNode.textSize,inNode.textValue,pos,inNode.textColour);

                        var rect = layer.size.clone();
                        rect.x += inOffset.x;
                        rect.y += inOffset.y;
                        gCanvas.GLStrokeRect(rect,'#7f7f7f');
                    }
                    break;

                case "text":
                {
                    this.drawLayer(inNode.name + "_backing");
                    //this.drawLayer(inNode.name + "_label");

                    //draw label text, i.e. the localised string
                    var node = this.layerBank[inNode.name + "_label"];
                    if(node != undefined)
                    {
                        if(this.bDrawText == true)
                        {
                            gCanvas.GLTextCentred(36,'#'+inNode.name,node.size.getCentre(),'#dfa253');
                        }
                    }

                    //draw text, i.e. the value (1,000,000 etc)
                    var node = this.layerBank[inNode.name + "_text"];
                    if(node != undefined)
                    {
                        if(this.bDrawText == true)
                        {
                            gCanvas.GLTextCentred(34,inNode.textValue,node.size.getCentre(),'#ffffff');
                        }
                    }

                }
                    break;

                case "render_node":
                    if(inNode.renderCallback != undefined)
                    {
                        inNode.renderCallback(this,inNode);
                    }
                    break;

                case "default":
                {
                    this.drawLayerOffset(inNode.name,inOffset);

                    for (var i=0; i<inNode.children.length; ++i)
                    {
                        this.drawNode(inNode.children[i],inOffset);
                    }
                }
                    break;
            }
        }
    },

    drawLayerOffset:function(inString,inOffset)
    {
        var layer = this.layerBank[inString];

        if((layer != undefined) && (layer.size.w > 0))
        {
            this.drawLayer(inString, new RMRect(layer.size.x+inOffset.x, layer.size.y+inOffset.y,layer.size.w,layer.size.h));
        }
    },

    drawLayer:function(inString,inRect,inClipTo)
    {
        var layer = this.layerBank[inString];

        if((layer != undefined) && (layer.size.w > 0))
        {
            if((inRect != undefined) && (inClipTo == undefined))
            {
                gCanvas.GLSprite(layer.image,inRect);
            }
            else
            {
                if(inClipTo == undefined)
                {
                    if(this.bDrawSprites == true)
                    {
                        gCanvas.GLSprite(layer.image,layer.size);
                    }
                    else
                    {
                        gCanvas.GLStrokeRect(layer.size,'#7f7f7f');
                    }
                }
                else
                {
                    var clipResult = inRect.clone();

                    if(inRect.isContainedBy(inClipTo) == false)
                    {
                        var uvRect = new RMRect(0,0,layer.image.width,layer.image.height);

                        //GARETH do some clipping - top

                        if(inRect.y < inClipTo.y)
                        {
                            var diff = inClipTo.y - inRect.y;

                            clipResult.y += diff;
                            clipResult.h -= diff;

                            uvRect.y = Math.floor( (diff*layer.image.height)/inRect.h );
                            uvRect.h = Math.floor(layer.image.height - uvRect.y);
                        }
                        else
                        {
                            //GARETH do some clipping - bottom (ouch!)

                            if((inRect.y+inRect.h) > (inClipTo.y+ inClipTo.h) )
                            {
                                var diff = (inRect.y+inRect.h) - (inClipTo.y+ inClipTo.h);
                                clipResult.h -= diff;

                                uvRect.y = 0;
                                uvRect.h = Math.floor((clipResult.h*layer.image.height)/inRect.h );
                            }
                        }

                        if(uvRect.h < 1)
                        {
                            uvRect.h = 1;
                        }

                        if(this.bDrawSprites == true)
                        {
                            gCanvas.GLSprite(layer.image,clipResult,uvRect);
                        }
                        else
                        {
                            gCanvas.GLStrokeRect(clipResult,'#7f7f7f');
                        }
                    }
                    else
                    {
                        if(this.bDrawSprites == true)
                        {
                            gCanvas.GLSprite(layer.image,clipResult);
                        }
                        else
                        {
                            gCanvas.GLStrokeRect(clipResult,'#7f7f7f');
                        }
                    }
                }
            }
        }
    },

    drawText:function(inLayer,inString, inStyle)
    {
        var node = this.layerBank[inLayer];
        if(node != undefined)
        {
            if(this.bDrawText == true)
            {
                gCanvas.GLText(inStyle.size, inString,node.size.getPosition(), inStyle.color,inStyle.position);
            }
        }
    }
};