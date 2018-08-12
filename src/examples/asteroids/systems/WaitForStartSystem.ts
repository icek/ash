import { Engine, NodeList, System } from 'ash.ts';
import { AsteroidCollisionNode, GameNode, WaitForStartNode } from '../nodes';
import { EntityCreator } from '../EntityCreator';

export class WaitForStartSystem extends System
{
    private engine!:Engine;
    private creator:EntityCreator;

    private gameNodes!:NodeList<GameNode> | null;
    private waitNodes!:NodeList<WaitForStartNode> | null;
    private asteroids!:NodeList<AsteroidCollisionNode> | null;

    constructor( creator:EntityCreator )
    {
        super();
        this.creator = creator;
    }

    public addToEngine( engine:Engine ):void
    {
        this.engine = engine;
        this.waitNodes = engine.getNodeList( WaitForStartNode );
        this.gameNodes = engine.getNodeList( GameNode );
        this.asteroids = engine.getNodeList( AsteroidCollisionNode );
    }

    public update( time:number ):void
    {
        if(!this.waitNodes || ! this.gameNodes || !this.asteroids) {
            return;
        }

        let node:WaitForStartNode | null = this.waitNodes.head;
        let game:GameNode | null = this.gameNodes.head;
        if( node && node.wait.startGame && game )
        {
            for( let asteroid:AsteroidCollisionNode | null = this.asteroids.head; asteroid; asteroid = asteroid.next )
            {
                this.creator.destroyEntity( asteroid.entity );
            }

            game.state.setForStart();
            node.wait.startGame = false;
            this.engine.removeEntity( node.entity );
        }
    }

    public removeFromEngine( engine:Engine ):void
    {
        this.gameNodes = null;
        this.waitNodes = null;
        this.asteroids = null;
    }
}
