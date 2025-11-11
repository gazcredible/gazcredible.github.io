import {Rect} from "./maths.ts";

export class TexturePageMetaData
{
    lookup;
    constructor()
    {
        this.lookup = {};
    }
}

export class TexturePage
{
    image;
    metadata;

    constructor(filename, metadata)
    {
        this.image = new Image();
        this.image.src = filename;
        this.metadata = metadata;
    }

    /*
        DrawSprite(string name, vector2 pos)

        Draw a sprite named 'name' from the metadata at position
     */

    DrawSprite(canvas, name, pos)
    {
        this.DrawSpriteInfo(canvas, this.metadata.lookup[name], pos);
    }

    /*
        DrawSpriteInfo(Rect uvRect, Vector2 pos)

        Use uVRect info to draw sprite
     */

    DrawSpriteInfo(canvas, uvRect, pos)
    {
        canvas.Sprite(this.image, new Rect(pos.x, pos.y, uvRect.w, uvRect.h), uvRect);
    }
}
