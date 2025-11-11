class TexturePageMetaData
{
    constructor()
    {
        this.lookup = {};
    }
}

class TexturePage
{
    constructor(filename, metadata)
    {
        this.image = new Image();
        this.image.src = filename;
        this.metadata = metadata;
    }
    
    DrawSprite(name, pos)
    {
        var uvRect = CrappyBirdInst.texturePage.metadata.lookup[name];
        GAZCanvas.Sprite(CrappyBirdInst.texturePage.image, new Rect(pos.x, pos.y, uvRect.w, uvRect.h), uvRect);
    }
    
    DrawSpriteInfo(uvRect, pos)
    {
        GAZCanvas.Sprite(CrappyBirdInst.texturePage.image, new Rect(pos.x, pos.y, uvRect.w, uvRect.h), uvRect);
    }
}