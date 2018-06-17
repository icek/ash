import { Engine, NodeList, System } from 'ash';
import { GameConfig } from '../GameConfig';
import { EntityCreator } from '../EntityCreator';
import { Position } from '../components';
import { AsteroidCollisionNode, BulletCollisionNode, GameNode, SpaceshipNode } from '../nodes';

export class GameManager extends System
{
    private config:GameConfig;
    private creator:EntityCreator;

    private games!:NodeList<GameNode> | null;
    private spaceships!:NodeList<SpaceshipNode> | null;
    private asteroids!:NodeList<AsteroidCollisionNode> | null;
    private bullets!:NodeList<BulletCollisionNode> | null;

    constructor( creator:EntityCreator, config:GameConfig )
    {
        super();
        this.creator = creator;
        this.config = config;
    }

    public addToEngine( engine:Engine ):void
    {
        this.games = engine.getNodeList( GameNode );
        this.spaceships = engine.getNodeList( SpaceshipNode );
        this.asteroids = engine.getNodeList( AsteroidCollisionNode );
        this.bullets = engine.getNodeList( BulletCollisionNode );
    }

    public update( time:number ):void
    {
        if(!this.bullets || !this.asteroids || !this.spaceships || !this.games) {
            return;
        }

        let node:GameNode | null = this.games.head;
        if( node && node.state.playing )
        {
            if( this.spaceships.empty )
            {
                if( node.state.lives > 0 )
                {
                    let newSpaceshipPositionX = this.config.width * 0.5;
                    let newSpaceshipPositionY = this.config.height * 0.5;
                    let clearToAddSpaceship:boolean = true;
                    for( let asteroid:AsteroidCollisionNode | null = this.asteroids.head; asteroid; asteroid = asteroid.next )
                    {
                        if( Position.distance( asteroid.position.x, asteroid.position.y, newSpaceshipPositionX, newSpaceshipPositionY ) <= asteroid.collision.radius + 50 )
                        {
                            clearToAddSpaceship = false;
                            break;
                        }
                    }
                    if( clearToAddSpaceship )
                    {
                        this.creator.createSpaceship();
                    }
                }
                else
                {
                    node.state.playing = false;
                    this.creator.createWaitForClick();
                }
            }

            if( this.asteroids.empty && this.bullets.empty && this.spaceships.head )
            {
                // next level
                let spaceship:SpaceshipNode | null = this.spaceships.head;
                node.state.level++;
                let asteroidCount:number = 2 + node.state.level;
                for( let i:number = 0; i < asteroidCount; ++i )
                {
                    let positionX:number;
                    let positionY:number;
                    // check not on top of spaceship
                    do
                    {
                        positionX = Math.random() * this.config.width;
                        positionY = Math.random() * this.config.height;
                    }
                    while( Position.distance( positionX, positionY, spaceship.position.x, spaceship.position.y ) <= 80 );
                    this.creator.createAsteroid( 30, positionX, positionY );
                }
            }
        }
    }

    public removeFromEngine( engine:Engine ):void
    {
        this.games = null;
        this.spaceships = null;
        this.asteroids = null;
        this.bullets = null;
    }
}
