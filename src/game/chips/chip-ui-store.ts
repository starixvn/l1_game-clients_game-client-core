import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export enum ChipDisplayType {
    Normal = 0,
    VIP,
}

@injectable()
export class ChipUIStore {
    constructor() {
        makeAutoObservable(this);
    }

    private _color = "#FFF";
    private _type = ChipDisplayType.Normal;
    private _value: number;

    isSmall = false;
    isUpdateView: boolean;

    set color(value: string) {
        this._color = value;
    }

    get color() {
        return this._color;
    }

    set type(value: ChipDisplayType) {
        this._type = value;
    }

    get type() {
        return this._type;
    }

    get value() {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }
}
