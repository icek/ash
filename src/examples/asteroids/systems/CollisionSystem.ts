import { Engine, NodeList, System } from 'ash.ts';
import { EntityCreator } from '../EntityCreator';
import { Position } from '../components';
import { Sounds } from '../Sounds';
import { AsteroidCollisionNode, BulletCollisionNode, GameNode, SpaceshipCollisionNode } from '../nodes';

export class CollisionSystem extends System
{
    private creator:EntityCreator;

    private games!:NodeList<GameNode> | null;
    private spaceships!:NodeList<SpaceshipCollisionNode> | null;
    private asteroids!:NodeList<AsteroidCollisionNode> | null;
    private bullets!:NodeList<BulletCollisionNode> | null;

    constructor( creator:EntityCreator )
    {
        super();
        this.creator = creator;
    }

    public addToEngine( engine:Engine ):void
    {
        this.games = engine.getNodeList( GameNode );
        this.spaceships = engine.getNodeList( SpaceshipCollisionNode );
        this.asteroids = engine.getNodeList( AsteroidCollisionNode );
        this.bullets = engine.getNodeList( BulletCollisionNode );
    }

    public update( time:number ):void
    {
        let bullet:BulletCollisionNode | null;
        let asteroid:AsteroidCollisionNode | null;
        let spaceship:SpaceshipCollisionNode | null;

        if(!this.bullets || !this.asteroids || !this.games) {
            return;
        }

        for( bullet = this.bullets.head; bullet; bullet = bullet.next )
        {
            for( asteroid = this.asteroids.head; asteroid; asteroid = asteroid.next )
            {
                if( Position.distance( asteroid.position.x, asteroid.position.y, bullet.position.x, bullet.position.y ) <= asteroid.collision.radius )
                {
                    this.creator.destroyEntity( bullet.entity );
                    if( asteroid.collision.radius > 10 )
                    {
                        this.creator.createAsteroid( asteroid.collision.radius - 10, asteroid.position.x + Math.random() * 10 - 5, asteroid.position.y + Math.random() * 10 - 5 );
                        this.creator.createAsteroid( asteroid.collision.radius - 10, asteroid.position.x + Math.random() * 10 - 5, asteroid.position.y + Math.random() * 10 - 5 );
                    }
                    asteroid.asteroid.fsm.changeState( 'destroyed' );
                    asteroid.audio.play( Sounds.ExplodeAsteroid );
                    if( this.games.head )
                    {
                        this.games.head.state.hits++;
                    }
                    break;
                }
            }
        }

        if(!this.spaceships) {
            return;
        }

        for( spaceship = this.spaceships.head; spaceship; spaceship = spaceship.next )
        {
            for( asteroid = this.asteroids.head; asteroid; asteroid = asteroid.next )
            {
                if( Position.distance( asteroid.position.x, asteroid.position.y, spaceship.position.x, spaceship.position.y ) <= asteroid.collision.radius + spaceship.collision.radius )
                {
                    spaceship.spaceship.fsm.changeState( 'destroyed' );
                    spaceship.audio.play( Sounds.ExplodeShip );
                    if( this.games.head )
                    {
                        this.games.head.state.lives--;
                    }
                    break;
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
