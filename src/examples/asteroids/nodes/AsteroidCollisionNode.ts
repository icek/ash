import { Node, keep } from '../ash';
import { Asteroid, Audio, Collision, Position } from '../components';

export class AsteroidCollisionNode extends Node<AsteroidCollisionNode>
{
    @keep( Asteroid )
    public asteroid:Asteroid;
    @keep( Position )
    public position:Position;
    @keep( Collision )
    public collision:Collision;
    @keep( Audio )
    public audio:Audio;
}
