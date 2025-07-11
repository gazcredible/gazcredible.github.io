let RMDebug = function()
{
    this.Major = 0;
    this.Minor = 0;
    this.Step = 0;
};

RMDebug.prototype.warn = function (string)
{
    console.warn(string);
};

gRMDebug = new RMDebug();