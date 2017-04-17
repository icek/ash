import { Node, keep } from "../ash";
import { Bullet } from "../components";

export class BulletAgeNode extends Node<BulletAgeNode>
{
    @keep(Bullet)
    public bullet:Bullet;
}
