import { System } from './System';
export declare class SystemList {
    head: System | null;
    tail: System | null;
    add(system: System): void;
    remove(system: System): void;
    removeAll(): void;
    get<TSystem extends System>(type: {
        new (...args: any[]): TSystem;
    }): TSystem | null;
}
