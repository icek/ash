import { SignalBase } from './SignalBase';
export declare class Signal1<T> extends SignalBase<(a: T) => void> {
    dispatch(object: T): void;
}
