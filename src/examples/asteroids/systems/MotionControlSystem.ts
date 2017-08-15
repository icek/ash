import { Motion, MotionControls, Position } from '../components';
import { MotionControlNode } from '../nodes';
import { ListIteratingSystem } from 'ash';
import { KeyPoll } from '../KeyPoll';

export class MotionControlSystem extends ListIteratingSystem<MotionControlNode>
{
    private keyPoll:KeyPoll;

    constructor( keyPoll:KeyPoll )
    {
        super( MotionControlNode );
        this.keyPoll = keyPoll;
    }

    public updateNode( node:MotionControlNode, time:number ):void
    {
        let control:MotionControls = node.control;
        let position:Position = node.position;
        let motion:Motion = node.motion;

        if( this.keyPoll.isDown( control.left ) )
        {
            console.log( 'left' );
            position.rotation -= control.rotationRate * time;
        }

        if( this.keyPoll.isDown( control.right ) )
        {
            position.rotation += control.rotationRate * time;
        }

        if( this.keyPoll.isDown( control.accelerate ) )
        {
            motion.velocityX += Math.cos( position.rotation ) * control.accelerationRate * time;
            motion.velocityY += Math.sin( position.rotation ) * control.accelerationRate * time;
        }
    }
}
