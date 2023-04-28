import { inject, injectable } from "inversify";
import { IHandler } from "../../shared";
import { AudioStore } from "./audio-store";

export namespace AudioHandler {
    @injectable()
    export class init implements IHandler<void> {
        constructor(@inject(AudioStore) private readonly audioStore: AudioStore) {}

        async handle() {
            this.audioStore.init();
        }
    }

    @injectable()
    export class Play implements IHandler<void> {
        constructor(@inject(AudioStore) private readonly audioStore: AudioStore) {}

        async handle() {
            this.audioStore.isPlay = true;
        }
    }

    @injectable()
    export class Stop implements IHandler<void> {
        constructor(@inject(AudioStore) private readonly audioStore: AudioStore) {}

        async handle() {
            this.audioStore.isPlay = false;
        }
    }
}
