import { Node, keep } from 'ash.ts';
import { DeathThroes } from '../components';

export class DeathThroesNode extends Node<DeathThroesNode>
{
    @keep( DeathThroes )
    public death!:DeathThroes;
}
