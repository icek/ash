import { Gun, GunControls, Position } from '../components';
import { GunControlNode } from '../nodes';
import { EntityCreator } from '../EntityCreator';

import { ListIteratingSystem } from '../ash';
import { KeyPoll } from '../KeyPoll';
import { Sounds } from '../Sounds';

export class GunControlSystem extends ListIteratingSystem<GunControlNode>
{
    private keyPoll:KeyPoll;
    private creator:EntityCreator;

    constructor( keyPoll:KeyPoll, creator:EntityCreator )
    {
        super( GunControlNode );
        this.keyPoll = keyPoll;
        this.creator = creator;
    }

    public updateNode( node:GunControlNode, time:number ):void
    {
        let control:GunControls = node.control;
        let position:Position = node.position;
        let gun:Gun = node.gun;

        gun.shooting = this.keyPoll.isDown( control.trigger );
        gun.timeSinceLastShot += time;
        if( gun.shooting && gun.timeSinceLastShot >= gun.minimumShotInterval )
        {
            this.creator.createUserBullet( gun, position );
            node.audio.play( Sounds.ShootGun );
            gun.timeSinceLastShot = 0;
        }
    }
}
