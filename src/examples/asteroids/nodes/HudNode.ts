import { Node, keep } from 'ash';
import { GameState, Hud } from '../components';

export class HudNode extends Node<HudNode>
{
    @keep( GameState )
    public state:GameState;
    @keep( Hud )
    public hud:Hud;
}
