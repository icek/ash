import { Node, keep } from 'ash.ts';
import { Audio, Collision, Position, Spaceship } from '../components';

export class SpaceshipCollisionNode extends Node<SpaceshipCollisionNode>
{
    @keep( Spaceship )
    public spaceship!:Spaceship;
    @keep( Position )
    public position!:Position;
    @keep( Collision )
    public collision!:Collision;
    @keep( Audio )
    public audio!:Audio;
}
