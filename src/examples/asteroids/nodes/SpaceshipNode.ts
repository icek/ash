import { Node, keep } from 'ash.ts';
import { Position, Spaceship } from '../components';

export class SpaceshipNode extends Node<SpaceshipNode>
{
    @keep( Spaceship )
    public spaceship!:Spaceship;
    @keep( Position )
    public position!:Position;
}
