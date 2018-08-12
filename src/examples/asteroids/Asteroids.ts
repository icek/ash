import { Engine, RAFTickProvider } from 'ash.ts';

import { EntityCreator } from './EntityCreator';
import { GameConfig } from './GameConfig';
import { KeyPoll } from './KeyPoll';

import { AnimationSystem } from './systems/AnimationSystem';
import { AudioSystem } from './systems/AudioSystem';
import { BulletAgeSystem } from './systems/BulletAgeSystem';
import { CollisionSystem } from './systems/CollisionSystem';
import { DeathThroesSystem } from './systems/DeathThroesSystem';
import { GameManager } from './systems/GameManager';
import { GunControlSystem } from './systems/GunControlSystem';
import { HudSystem } from './systems/HudSystem';
import { MotionControlSystem } from './systems/MotionControlSystem';
import { MovementSystem } from './systems/MovementSystem';
import { RenderSystem } from './systems/RenderSystem';
import { SystemPriorities } from './systems/SystemPriorities';
import { WaitForStartSystem } from './systems/WaitForStartSystem';


export class Asteroids
{
    private engine!:Engine;
    private tickProvider!:RAFTickProvider;
    private creator!:EntityCreator;
    private keyPoll!:KeyPoll;
    private config!:GameConfig;

    constructor( private container:HTMLElement, width:number, height:number )
    {
        this.prepare( width, height );
    }

    private prepare( width:number, height:number ):void
    {
        this.engine = new Engine();
        this.creator = new EntityCreator( this.engine );
        this.keyPoll = new KeyPoll();
        this.config = new GameConfig( width, height );

        this.engine.addSystem( new WaitForStartSystem( this.creator ), SystemPriorities.preUpdate );
        this.engine.addSystem( new GameManager( this.creator, this.config ), SystemPriorities.preUpdate );
        this.engine.addSystem( new MotionControlSystem( this.keyPoll ), SystemPriorities.update );
        this.engine.addSystem( new GunControlSystem( this.keyPoll, this.creator ), SystemPriorities.update );
        this.engine.addSystem( new BulletAgeSystem( this.creator ), SystemPriorities.update );
        this.engine.addSystem( new DeathThroesSystem( this.creator ), SystemPriorities.update );
        this.engine.addSystem( new MovementSystem( this.config ), SystemPriorities.move );
        this.engine.addSystem( new CollisionSystem( this.creator ), SystemPriorities.resolveCollisions );
        this.engine.addSystem( new AnimationSystem(), SystemPriorities.animate );
        this.engine.addSystem( new HudSystem(), SystemPriorities.animate );
        this.engine.addSystem( new RenderSystem( this.container ), SystemPriorities.render );
        this.engine.addSystem( new AudioSystem(), SystemPriorities.render );

        this.creator.createWaitForClick();
        this.creator.createGame();
    }

    public start():void
    {
        this.tickProvider = new RAFTickProvider();
        this.tickProvider.add( delta => this.engine.update( delta ) );
        this.tickProvider.start();
    }
}
