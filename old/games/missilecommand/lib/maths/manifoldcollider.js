class ColliderHolder
{
    constructor(collider, xform)
    {
        this.collider = collider;
        this.transform = xform;
    }
}

class ManifoldCollider extends ColliderBase
{
    constructor()
    {
        super();
        this.colliderList = [];
    }

    addCollider(collider,transform)
    {
        colliderList.push(new ColliderHolder(collider,transform) );
    }


    setTransform(mat)
    {
        for(let i=0;i< this.colliderList;i++)
        {
            this.colliderList[i].collider.setTransform(this.colliderList[i] * mat);
        }
    }

    collides(obj, collisionList)
    {
        var bGotCollision = false;

        for(let i=0;i< this.colliderList;i++)
        {
            if (this.colliderList[i].collider.Collides(obj, collisionList) == true)
            {
                bGotCollision = true;
            }

            if ((collisionList == null) && (bGotCollision == true))
            {
                return true;
            }
        }

        return bGotCollision;
    }

    isPointInMe(pos)
    {
        for(let i=0;i< this.colliderList;i++)
        {
            if (this.colliderList[i].collider.isPointInMe(pos) == true) return true;
        }

        return false;
    }

    Draw(col)
    {
        for(let i=0;i< this.colliderList;i++)
        {
            this.colliderList[i].collider.Draw(c);
        }
    }
}