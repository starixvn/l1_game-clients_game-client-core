import { injectable } from "inversify";
import { makeAutoObservable } from "mobx";

export interface Warning {
    message: string;
}

export enum NoticeType {
    Info = 0,
    Error = 1,
}

export interface Notice extends Warning {
    title: string;

    type: NoticeType;

    onClose: () => void;
}

@injectable()
export class NoticeStore {
    constructor() {
        makeAutoObservable(this);
    }

    warning = null;

    notice = null;

    addWarning(message: string) {
        this.warning = { message };
    }

    addNotice(notice: Notice) {
        this.notice = notice;
    }
}
