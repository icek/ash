import { SignalBase } from './SignalBase';
export declare class Signal2<T1, T2> extends SignalBase<(a: T1, b: T2) => void> {
    dispatch(object1: T1, object2: T2): void;
}
