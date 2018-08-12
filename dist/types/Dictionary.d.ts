export declare class Dictionary<TKey, TValue> {
    private _keys;
    private _values;
    constructor();
    set(key: TKey, value: TValue): TValue;
    get(key: TKey): TValue | null;
    has(key: TKey): boolean;
    remove(key: TKey): TValue | null;
    keys(): TKey[];
    values(): TValue[];
}
