import { EntityCreator } from "../EntityCreator";
import { DeathThroesNode } from "../nodes";

import { ListIteratingSystem } from "../ash";

export class DeathThroesSystem extends ListIteratingSystem<DeathThroesNode>
{
    private creator:EntityCreator;

    constructor( creator:EntityCreator )
    {
        super( DeathThroesNode );
        this.creator = creator;
    }

    public updateNode( node:DeathThroesNode, time:number ):void
    {
        node.death.countdown -= time;
        if( node.death.countdown <= 0 )
        {
            this.creator.destroyEntity( node.entity );
        }
    }
}
