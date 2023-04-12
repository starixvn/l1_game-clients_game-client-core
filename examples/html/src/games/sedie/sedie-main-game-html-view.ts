import { Auth, Game, Player } from "game-client-base";
import { injectable } from "inversify";
import { handle, observer, render } from "observer";
import { HtmlViewEngine } from "../../views/html-view-engine";

@observer("sedie")
@injectable()
export class SedieGameHtmlView extends HtmlViewEngine {
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
            this.roundTimeComponent = document && document?.getElementById("sedie-round-time");
            this.playerComponent = document && document?.getElementById("sedie-player");
            this.gameNameComponent = document && document?.getElementById("sedie-game-name");
            this.roundStateComponent = document && document?.getElementById("sedie-round-state");
            this.roundIdComponent = document && document?.getElementById("sedie-round-id");
            this.oddsComponent = document && document?.getElementById("sedie-odds");
        } catch (error) {
            return null;
        }
    }

    @render(Game.GameStore, (store) => store.gameName)
    renderGameName(gameName: string) {
        this.setInnerHtml(this.gameNameComponent, gameName);
    }

    @render(Player.PlayerStore, (store) => store.name)
    renderPlayer(playerName: string) {
        this.setInnerHtml(this.playerComponent, playerName);
    }

    @render(Game.RoundTimeStore, (store) => store.roundTime)
    renderRoundTime(roundTime: string) {
        this.setInnerHtml(this.roundTimeComponent, roundTime);
    }

    @render(Game.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setInnerHtml(this.roundStateComponent, roundState);
    }

    @render(Game.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: string) {
        this.setInnerHtml(this.roundIdComponent, roundId);
    }

    @render(Game.GameConfigStore, (store) => store.odds)
    renderGameConfig(odds: any) {
        this.setInnerHtml(this.oddsComponent, JSON.stringify(odds));
    }

    @render(Auth.AuthStore, (store) => store.isAuthenticated)
    logAuthentication(isAuthenticated: any) {
        console.log("sedie game", { isAuthenticated });
        if (isAuthenticated) {
            this.authorize();
        }
    }

    @handle(Auth.AuthHandlers.SSO)
    sso() {
        return { token: "player-token", system: 1 };
    }

    @handle(Auth.AuthHandlers.Authorize)
    authorize() {}

    private setInnerHtml(component: HTMLElement | null, data: string) {
        component && (component.innerHTML = data);
    }
}
