declare class DataBase {
    constructor(path: string, options?: { refresh?: boolean });
    
    set(key: string, value: object | string | number, dotNotation: boolean) : void;
    get(key: string, dotNotation: boolean) : object | undefined;
    delete(key: string, dotNotation: boolean) : boolean | undefined;
    all() : object;
    sync() : void;
}

export = DataBase;