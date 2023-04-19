import { Container } from "inversify";
import { SedieGameHtmlView } from "./sedie-main-game-html-view";

export class SedieGameController {
    constructor(public readonly container: Container) {}

    start() {
        const sedieView = this.container.resolve(SedieGameHtmlView);
        sedieView.onLoad();
    }
}
