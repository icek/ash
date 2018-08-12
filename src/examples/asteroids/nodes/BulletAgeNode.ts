import { Node, keep } from 'ash.ts';
import { Bullet } from '../components';

export class BulletAgeNode extends Node<BulletAgeNode>
{
    @keep( Bullet )
    public bullet!:Bullet;
}
