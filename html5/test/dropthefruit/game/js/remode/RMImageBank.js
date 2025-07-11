var RMImageBank	=	function()
{
    this.layerBank = {};
}


RMImageBank.prototype	={

    addImage:function(inName, inFilename)
    {
        if(this.layerBank[inName] == undefined)
        {
            this.layerBank.name = inName;
            this.layerBank[inName] = new Image();
            this.layerBank[inName].src = inFilename;
        }
    },

    getImage:function(inName)
    {
        return this.layerBank[inName];
    }
};

imageBank = new RMImageBank();