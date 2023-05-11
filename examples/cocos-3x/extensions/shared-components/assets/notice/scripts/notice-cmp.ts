import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

enum NoticeType {
    Info = 0,
    Error = 1,
}

@ccclass()
export class NoticeCmp extends Component {
    @property(Label)
    title: Label = null;

    @property(Label)
    message: Label = null;

    @property(Node)
    nodeInfo: Node = null;

    @property(Node)
    nodeError: Node = null;

    onClose: () => void;

    setData(data: { title: string; message: string; type: NoticeType; onClose: () => void }) {
        this.title.string = data.title;
        this.message.string = data.message;
        this.onClose = data.onClose;
        this.updateDisplay(data.type);
    }

    updateDisplay(type: NoticeType) {
        const isInfo = type === NoticeType.Info;
        this.nodeInfo.active = isInfo;
        this.nodeError.active = !isInfo;
    }

    protected onDestroy(): void {
        this.onClose && this.onClose();
    }
}
