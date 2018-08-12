import { EntityCreator } from '../EntityCreator';
import { Bullet } from '../components';
import { BulletAgeNode } from '../nodes';
import { ListIteratingSystem } from 'ash.ts';

export class BulletAgeSystem extends ListIteratingSystem<BulletAgeNode>
{
    private creator:EntityCreator;

    constructor( creator:EntityCreator )
    {
        super( BulletAgeNode );
        this.creator = creator;
    }

    public updateNode( node:BulletAgeNode, time:number ):void
    {
        let bullet:Bullet = node.bullet;
        bullet.lifeRemaining -= time;
        if( bullet.lifeRemaining <= 0 )
        {
            this.creator.destroyEntity( node.entity );
        }
    }
}
