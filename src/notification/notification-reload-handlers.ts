import { inject, injectable } from "inversify";
import { IHandler, NotificationServiceMessage } from "../shared";
import { NoticeStore, NoticeType } from "../game/notices";
import { Translator } from "../exports";

export namespace NotificationReloadHandlers {
    @injectable()
    export class NotificationReload implements IHandler<void> {
        constructor(
            @inject(NoticeStore) private readonly noticeStore: NoticeStore
        ) {}

        name = NotificationServiceMessage.reloadEventName;

        handle() {
            const reload = () => {
                window.location.reload();
            };
            this.noticeStore.addNotice({
                message: Translator.commonTranslate("message_new_update_available"),
                title: Translator.commonTranslate("notice"),
                type: NoticeType.Info,
                onClose: reload,
            });            
        }
    }
}
