import { Engine, Entity, EntityStateMachine } from 'ash';
import {
    Animation, Asteroid, Audio, Bullet, Collision, DeathThroes, Display, GameState, Gun, GunControls,
    Hud, Motion, MotionControls, Position, Spaceship, WaitForStart
} from './components';
import { Keyboard } from './Keyboard';

import {
    AsteroidView, AsteroidDeathView, BulletView, HudView, SpaceshipView, SpaceshipDeathView, WaitForStartView
} from './graphics';

export class EntityCreator
{
    private engine:Engine;
    private waitEntity!:Entity;

    constructor( engine:Engine )
    {
        this.engine = engine;
    }

    public destroyEntity( entity:Entity ):void
    {
        this.engine.removeEntity( entity );
    }

    public createGame():Entity
    {
        let hud:HudView = new HudView();

        let gameEntity:Entity = new Entity( 'game' )
            .add( new GameState() )
            .add( new Hud( hud ) )
            .add( new Display( hud ) )
            .add( new Position( 400, 25, 0 ) );
        this.engine.addEntity( gameEntity );
        return gameEntity;
    }

    public createWaitForClick():Entity
    {
        if( !this.waitEntity )
        {
            let waitView:WaitForStartView = new WaitForStartView();

            this.waitEntity = new Entity( 'wait' )
                .add( new WaitForStart( waitView ) )
                .add( new Display( waitView ) )
                .add( new Position( 400, 300, 0 ) );
        }
        this.waitEntity.get( WaitForStart ).startGame = false;
        this.engine.addEntity( this.waitEntity );
        return this.waitEntity;
    }

    public createAsteroid( radius:number, x:number, y:number ):Entity
    {
        let asteroid:Entity = new Entity();

        let fsm:EntityStateMachine = new EntityStateMachine( asteroid );

        fsm.createState( 'alive' )
            .add<Motion>( Motion ).withInstance( new Motion( ( Math.random() - 0.5 ) * 4 * ( 50 - radius ), ( Math.random() - 0.5 ) * 4 * ( 50 - radius ), Math.random() * 2 - 1, 0 ) )
            .add<Collision>( Collision ).withInstance( new Collision( radius ) )
            .add<Display>( Display ).withInstance( new Display( new AsteroidView( radius ) ) );

        let deathView:AsteroidDeathView = new AsteroidDeathView( radius );
        fsm.createState( 'destroyed' )
            .add<DeathThroes>( DeathThroes ).withInstance( new DeathThroes( 3 ) )
            .add<Display>( Display ).withInstance( new Display( deathView ) )
            .add<Animation>( Animation ).withInstance( new Animation( deathView ) );

        asteroid
            .add( new Asteroid( fsm ) )
            .add( new Position( x, y, 0 ) )
            .add( new Audio() );

        fsm.changeState( 'alive' );
        this.engine.addEntity( asteroid );
        return asteroid;
    }

    public createSpaceship():Entity
    {
        let spaceship:Entity = new Entity();
        let fsm:EntityStateMachine = new EntityStateMachine( spaceship );

        fsm.createState( 'playing' )
            .add<Motion>( Motion ).withInstance( new Motion( 0, 0, 0, 15 ) )
            .add<MotionControls>( MotionControls ).withInstance( new MotionControls( Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, 100, 3 ) )
            .add<Gun>( Gun ).withInstance( new Gun( 8, 0, 0.3, 2 ) )
            .add<GunControls>( GunControls ).withInstance( new GunControls( Keyboard.SPACE ) )
            .add<Collision>( Collision ).withInstance( new Collision( 9 ) )
            .add<Display>( Display ).withInstance( new Display( new SpaceshipView() ) );

        let deathView:SpaceshipDeathView = new SpaceshipDeathView();
        fsm.createState( 'destroyed' )
            .add<DeathThroes>( DeathThroes ).withInstance( new DeathThroes( 5 ) )
            .add<Display>( Display ).withInstance( new Display( deathView ) )
            .add<Animation>( Animation ).withInstance( new Animation( deathView ) );

        spaceship
            .add( new Spaceship( fsm ) )
            .add( new Position( 300, 225, 0 ) )
            .add( new Audio() );

        fsm.changeState( 'playing' );
        this.engine.addEntity( spaceship );
        return spaceship;
    }

    public createUserBullet( gun:Gun, parentPosition:Position ):Entity
    {
        let cos:number = Math.cos( parentPosition.rotation );
        let sin:number = Math.sin( parentPosition.rotation );
        let bullet:Entity = new Entity()
            .add( new Bullet( gun.bulletLifetime ) )
            .add( new Position(
                cos * gun.offsetFromParentX - sin * gun.offsetFromParentY + parentPosition.x,
                sin * gun.offsetFromParentX + cos * gun.offsetFromParentY + parentPosition.y, 0 ) )
            .add( new Collision( 0 ) )
            .add( new Motion( cos * 150, sin * 150, 0, 0 ) )
            .add( new Display( new BulletView() ) );
        this.engine.addEntity( bullet );
        return bullet;
    }
}