import { Container } from "inversify";
import * as Auth from "../auth";
import * as ChipSetting from "../chip-setting";
import * as SiteConfigs from "../configs";
import { GameSetting as OldGameSetting } from "../game/game-configs";
import {
    RoundStore as OldRoundStore,
    RoundTimeStore as OldRoundTimeStore,
    RoundTimeHandlers as OldRoundTimeHandlers,
    RoundHandlers as OldRoundHandlers,
} from "../game/rounds";
import * as Notification from "../notification";
import * as Players from "../players";
import * as UnderMaintenance from "../under-maintenance";
// import { InGameHandler } from "./connection";
// import { DisableGameHandlers } from "./disabled-game";
import * as GameTurnBase from "./export";
import { GameSetting, GameConfigStore } from "../game/game-configs";
// import { HideGameHandler } from "./hide-game";
import { RoundStore, RoundTimeHandlers, RoundTimeStore, RoundHandlers } from "./rounds";

import {
    ProvablyFairHandler as OldProvablyFairHandler,
    PFBetHandler as OldPFBetHandler,
    ProvablyFairStore as OldProvablyFairStore
} from "../features/provably-fair/round-base";


import {
    BetHandler as OldBetHandler,
    BetStore as OldBetStore,
    BetResponseHandlers as OldBetResponseHandlers
} from "../game/bets/";


import { PFBetHandler, ProvablyFairHandler, ProvablyFairStore } from "./provably-fair";

import { BetHandler, BetResponseHandlers, BetStore } from "./bets";
// import { GameConfigStore as OldGameConfigStore } from "../game/game-configs";

export const features = [Auth, Players, SiteConfigs, GameTurnBase, Notification, UnderMaintenance, ChipSetting];

export const onContainerCreated = (container: Container, setting?: GameSetting) => {
    // container.bind(GameSetting).toConstantValue(setting);
    // container.bind(OldGameSetting).toConstantValue(setting as any);

    container.bind(RoundTimeHandlers).to(RoundTimeHandlers as any);
    container.bind(OldRoundTimeHandlers).to(RoundTimeHandlers as any);

    // container.bind(OldDisableGameHandlers).to(DisableGameHandlers as any);
    // container.bind(ConnectionHandlers.InGameHandler).to(InGameHandler as any);
    // container.bind(OldHideGameHandler).to(HideGameHandler as any);

    container.bind(RoundHandlers).to(RoundHandlers as any);
    container.bind(OldRoundHandlers).to(RoundHandlers as any);

    container.bind(RoundStore).to(RoundStore as any);
    container.bind(OldRoundStore).toService(RoundStore as any);

    container.bind(RoundTimeStore).to(RoundTimeStore);
    container.bind(OldRoundTimeStore).toService(RoundTimeStore as any);


    container.bind(ProvablyFairHandler).to(ProvablyFairHandler as any);
    container.bind(OldProvablyFairHandler).to(ProvablyFairHandler as any);

    container.bind(BetHandler).to(BetHandler as any);
    container.bind(OldBetHandler).to(BetHandler as any);

    container.bind(BetResponseHandlers).to(BetResponseHandlers as any);
    container.bind(OldBetResponseHandlers).to(BetResponseHandlers as any);
    // container.bind(GameConfigStore).to(GameConfigStore as any);
    // container.bind(OldGameConfigStore).toService(GameConfigStore as any);


    container.bind(ProvablyFairStore).to(ProvablyFairStore as any);
    container.bind(OldProvablyFairStore).to(ProvablyFairStore as any);

    container.bind(BetStore).to(BetStore as any);
    container.bind(OldBetStore).to(BetStore as any);

};
