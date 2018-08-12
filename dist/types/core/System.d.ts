import { Engine } from './Engine';
export declare abstract class System {
    previous: System | null;
    next: System | null;
    priority: number;
    abstract addToEngine(engine: Engine): void;
    abstract removeFromEngine(engine: Engine): void;
    abstract update(time: number): void;
}
