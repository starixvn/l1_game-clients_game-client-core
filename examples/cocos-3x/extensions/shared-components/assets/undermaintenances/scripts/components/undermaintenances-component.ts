import { _decorator, Component, director, Label } from "cc";
import Observer from "observer";
import gc from "game-client-base";
import { UMInfo } from "sc-user-service-client/dist/auth";
import mobx from "mobx";
import { sharedContainer } from "../../../../../../assets/scripts/shared-container";

const { ccclass, property } = _decorator;
const { observer, handle, render } = Observer;
const { Auth, Shared } = gc;

declare global {
    interface Window {
        reCheckInId: number;
        umInfo: UMInfo;
    }
}

Observer.configure({ default: { mobx, container: sharedContainer } });
@ccclass
@observer
export default class Undermaintenances extends Component {
    @property(Label)
    message: Label = null;

    onLoad() {
        // if (window.umInfo) {
        //     if (this) {
        //         const startTime = this.formatDate(this.convertToGMT8(new Date(window.umInfo.startTime)));
        //         const endTime = this.formatDate(this.convertToGMT8(new Date(window.umInfo.endTime)));

        //         // const message = i18n.t("ui.maintain_time", { startTime: startTime, endTime: endTime });
        //         this.message.string = `Maintain from ${startTime} to ${endTime}`;
        //     }
        // }

        if (window.reCheckInId) {
            clearInterval(window.reCheckInId);
        }

        // socketIOController.closeAllSocket();
        // MusicPlayer.getInstance().stopBackgroundAudio();
    }

    @render(Auth.AuthStore, (store) => store.umInfo)
    setUMInfo(umInfo: UMInfo) {
        const startTime = this.formatDate(this.convertToGMT8(new Date(umInfo.startTime)));
        const endTime = this.formatDate(this.convertToGMT8(new Date(umInfo.endTime)));

        // const message = i18n.t("ui.maintain_time", { startTime: startTime, endTime: endTime });
        this.message.string = `Maintain from ${startTime} to ${endTime}`;
    }

    convertToGMT8(date: Date) {
        return new Date(
            date.toLocaleString("en-US", {
                timeZone: "Asia/Manila",
            })
        );
    }

    formatDate(date: Date) {
        let template = "hh:mm dd/MM/yyyy";
        try {
            const z = {
                M: date.getMonth() + 1,
                d: date.getDate(),
                h: date.getHours(),
                m: date.getMinutes(),
                s: date.getSeconds(),
            };

            template = template.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
                return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2);
            });

            return template.replace(/(y+)/g, function (v) {
                return date.getFullYear().toString().slice(-v.length);
            });
        } catch (ex) {
            console.log(ex);
            return date.toString();
        }
    }
}
