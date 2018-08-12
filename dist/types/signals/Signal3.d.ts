import { SignalBase } from './SignalBase';
export declare class Signal3<T1, T2, T3> extends SignalBase<(a: T1, b: T2, c: T3) => void> {
    dispatch(object1: T1, object2: T2, object3: T3): void;
}
