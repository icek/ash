import { EngineState } from './EngineState';
import { Engine } from '../core/Engine';
export declare class EngineStateMachine {
    engine: Engine;
    private states;
    private currentState?;
    constructor(engine: Engine);
    addState(name: string, state: EngineState): this;
    createState(name: string): EngineState;
    changeState(name: string): void;
}
