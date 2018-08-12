import { ListIteratingSystem } from 'ash.ts';
import { GameConfig } from '../GameConfig';
import { MovementNode } from '../nodes';

export class MovementSystem extends ListIteratingSystem<MovementNode>
{
    private config:GameConfig;

    constructor( config:GameConfig )
    {
        super( MovementNode );
        this.config = config;
    }

    public updateNode( node:MovementNode, time:number ):void
    {
        let position = node.position;
        let motion = node.motion;
        position.x += motion.velocityX * time;
        position.y += motion.velocityY * time;
        if( position.x < 0 )
        {
            position.x += this.config.width;
        }
        if( position.x > this.config.width )
        {
            position.x -= this.config.width;
        }
        if( position.y < 0 )
        {
            position.y += this.config.height;
        }
        if( position.y > this.config.height )
        {
            position.y -= this.config.height;
        }
        position.rotation += motion.angularVelocity * time;
        if( motion.damping > 0 )
        {
            let xDamp:number = Math.abs( Math.cos( position.rotation ) * motion.damping * time );
            let yDamp:number = Math.abs( Math.sin( position.rotation ) * motion.damping * time );
            if( motion.velocityX > xDamp )
            {
                motion.velocityX -= xDamp;
            }
            else if( motion.velocityX < -xDamp )
            {
                motion.velocityX += xDamp;
            }
            else
            {
                motion.velocityX = 0;
            }
            if( motion.velocityY > yDamp )
            {
                motion.velocityY -= yDamp;
            }
            else if( motion.velocityY < -yDamp )
            {
                motion.velocityY += yDamp;
            }
            else
            {
                motion.velocityY = 0;
            }
        }
    }

}
