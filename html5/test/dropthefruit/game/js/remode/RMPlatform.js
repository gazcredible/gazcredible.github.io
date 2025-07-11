var RMBrowserVersion = function()
{
    this.Major = 0;
    this.Minor = 0;
    this.Step = 0;
}

RMBrowserVersion.prototype.fromIOS = function (label)
{
    var strings = label.split("_");

    this.Major = parseInt(strings[0]);
    this.Minor = parseInt(strings[1]);

    if(strings.length >2)
    {
        this.Step = parseInt(strings[2]);
    }
}

RMBrowserVersion.prototype.fromAndroid = function (label)
{
    var strings = label.split(".");

    if(strings.length >1)
    {
        this.Major = parseInt(strings[0]);
        this.Minor = parseInt(strings[1]);
    }

    if(strings.length >2)
    {
        this.Step = parseInt(strings[2]);
    }
}

RMBrowserVersion.prototype.toString = function ()
{
    return "version " + this.Major +" " + this.Minor +" " + this.Step;
}

//===========================================================================================

var RMPlatform = function()
{
    this.pageShow = true;

    this.strings = "";
    this.ua = ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : "");

    if(this.ua !== "")
    {
        //<browser> (<stuff>) AppleWebKit/<version> (<stuff>) Chrome/<version> Safari/<version>

        this.strings = this.ua.split(" ");
    }
};


RMPlatform.prototype.getDeviceName = function()
{
    if(this.isAndroid() == true)
    {
        if(this.strings[2] == 'U;')
        {
            return this.strings[6];
        }
        else
        {
            return this.strings[4];
        }

    }

    if(this.isiPhone() == true)
    {
        return this.strings[3];
    }

    if(this.isiPad() == true)
    {
        return 'iPad';
    }

    if(this.isWindows() == true)
    {
        return 'Windows';
    }

    return 'unknown';
}

RMPlatform.prototype.getPlatform = function()
{
    if(this.isAndroid() == true)
    {
        return "Android";
    }

    if(this.isiPad() || this.isiPhone() == true)
    {
        return "iOS";
    }

    if(navigator != undefined)
    {
        if(this.isIE() == true)
        {
            return "IE";
        }

        if(this.isChrome() == true)
        {
            return "Chrome";
        }
    }

    return "unknown!";
}

RMPlatform.prototype.getVersion = function()
{
    var version = new RMBrowserVersion();

    if(this.isiPad() == true)
    {
        version.fromIOS(this.strings[4]);
    }

    if(this.isiPhone() == true)
    {
        version.fromIOS(this.strings[5]);
    }

    if(this.isAndroid() == true)
    {
        version.fromAndroid(this.strings[4]);

        if(version.Major == 0)
        {
            version.fromAndroid(this.strings[3]);
        }
    }

    return version;
}


RMPlatform.prototype.isAndroid = function()
{
    return ((this.strings.length > 3) &&
        ( (this.strings[2] == "Android")
        ||(this.strings[3] == "Android")
        ||(this.strings[1]== "(Android;")
        ));
}

RMPlatform.prototype.isWindows = function()
{
    return this.strings[1]== "(Windows";
}

RMPlatform.prototype.isIE = function()
{
    if(navigator != undefined)
    {
        if(navigator.userAgent.indexOf(".NET CLR") != -1)
        {
            return true;
        }
    }
    return false;
}

RMPlatform.prototype.isChrome = function()
{
    if(navigator != undefined)
    {
        if(navigator.userAgent.indexOf("Chrome") != -1)
        {
            return true;
        }
    }
    return false;
}

RMPlatform.prototype.isiPhone = function()
{
    return ((this.strings.length > 3) && (this.strings[3] == "iPhone"));
}

RMPlatform.prototype.isiPad = function()
{
    return ((this.strings.length > 1) && (this.strings[1] == "(iPad;"));
}

RMPlatform.prototype.getiOSVersion = function()
{
    if(this.isiPad() == true)
    {
        return this.strings[4];
    }

    if(this.isiPhone() == true)
    {
        return this.strings[5];
    }

    return "";
}

RMPlatform.prototype.setIsBrowserVisible = function(inVisible)
{
    this.pageShow = inVisible;
}

RMPlatform.prototype.isActiveWindow=function()
{
    return this.pageShow;
}

RMPlatform.prototype.openNewTab=function(url)
{
    window.open(url,"_newtab");
}



gRMPlatform = new RMPlatform();