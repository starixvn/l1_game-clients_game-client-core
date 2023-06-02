import { Auth, Connection, GameConfigs, Player, Rounds, Shared } from "game-client-base";
import { injectable } from "inversify";
import { handle, observer, render } from "observer";
import { siteConfigs } from "../../configs";
import { HtmlViewEngine } from "../../views/html-view-engine";
import { fakeResponseSSO } from "./../fake-handle-sso";

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
        this.sso();
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

    onLoad(): void {
        this.sso();
    }

    renderGameName(gameName: string) {
        this.setInnerHtml(this.gameNameComponent, gameName);
    }

    @render(Player.MainPlayerStore, (store) => store.name)
    renderPlayer(playerName: string) {
        this.setInnerHtml(this.playerComponent, playerName);
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundTime)
    renderRoundTime(roundTime: string) {
        this.setInnerHtml(this.roundTimeComponent, roundTime);
    }

    @render(Rounds.RoundTimeStore, (store) => store.roundState)
    renderRoundState(roundState: string) {
        this.setInnerHtml(this.roundStateComponent, roundState);
    }

    @render(Rounds.RoundStore, (store) => store.roundId)
    renderRoundId(roundId: string) {
        this.setInnerHtml(this.roundIdComponent, roundId);
    }

    @render(GameConfigs.GameConfigStore, (store) => store.odds)
    renderGameConfig(odds: any) {
        this.setInnerHtml(this.oddsComponent, JSON.stringify(odds));
    }

    @render(Connection.ConnectionStore, (store) => store.signedIn)
    onSignIn(signedIn: boolean) {
        signedIn && this.inGame();
    }

    @handle(Connection.ConnectionHandlers.InGameHandler)
    inGame() {}

    @handle(Auth.AuthHandlers.SSO)
    sso() {
        return siteConfigs.isDev ? fakeResponseSSO() : { token: "player-token", system: 1 };
    }

    @render(Auth.AuthStore, (store) => store.isAuthorized)
    onAuthorize(isAuthorized: boolean) {
        if (isAuthorized) {
            this.connectGameService();
            this.triggerRecheckIn();
        }
    }
    @handle(Connection.ConnectionHandlers.ConnectHandler)
    connectGameService() {
        return {};
    }

    private setInnerHtml(component: HTMLElement | null, data: string) {
        component && (component.innerHTML = data);
    }

    @handle(Auth.AuthHandlers.TriggerRecheckIn)
    triggerRecheckIn() {
        const sessionInfo = Shared.utils.StorageManager.get(Shared.utils.localStorageKeys.session) as Auth.ISessionInfo;
        return { sessionInfo };
    }
}
