import { Auth, GameConfigs, Player, Rounds } from "@sg/game-client-base";
import { injectable } from "inversify";
import { observer, render } from "observer";
import { HtmlViewEngine } from "../../views/html-view-engine";

@observer("dragonTiger")
@injectable()
export class DragonTigerGameHtmlView extends HtmlViewEngine {
    roundTimeComponent: HTMLElement | null;
    playerComponent: HTMLElement | null;
    gameNameComponent: HTMLElement | null;
    roundStateComponent: HTMLElement | null;
    roundIdComponent: HTMLElement | null;
    oddsComponent: HTMLElement | null;

    constructor() {
        super();
        this.initView();
    }

    initView() {
        try {
            this.roundTimeComponent = document && document?.getElementById("dragon-tiger-round-time");
            this.playerComponent = document && document?.getElementById("dragon-tiger-player");
            this.roundStateComponent = document && document?.getElementById("dragon-tiger-round-state");
            this.roundIdComponent = document && document?.getElementById("dragon-tiger-round-id");
            this.oddsComponent = document && document?.getElementById("dragon-tiger-odds");
        } catch (error) {
            //console.log(error);
            return null;
        }
    }

    @render(Player.MainPlayerStore, (store) => store.name)
    renderPlayer(playerName: string) {
        this.setInnerHtml(this.playerComponent, playerName);
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderRoundTime(roundTime: number) {
        this.setInnerHtml(this.roundTimeComponent, roundTime?.toString());
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setInnerHtml(this.roundStateComponent, roundState);
    }

    @render(Rounds.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: number) {
        this.setInnerHtml(this.roundIdComponent, roundId?.toString());
    }

    @render(Auth.AuthStore, (store) => store.isAuthenticated)
    logAuthentication(isAuthenticated: any) {
        console.log("dragon tiger game", { isAuthenticated });
    }

    @render(GameConfigs.GameConfigStore, (store) => store.odds)
    renderGameConfig(odds: any) {
        this.setInnerHtml(this.oddsComponent, JSON.stringify(odds));
    }

    private setInnerHtml(component: HTMLElement | null, data: string) {
        component && (component.innerHTML = data);
    }
}
