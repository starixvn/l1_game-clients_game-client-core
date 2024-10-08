import { Container } from "inversify";
import * as Auth from "../auth";
import * as ChipSetting from "../chip-setting";
import { GameSetting as OldGameSetting } from "../game/game-configs/game-setting";
import * as SiteConfigs from "../configs";
import {
    RoundStore as OldRoundStore,
    RoundTimeStore as OldRoundTimeStore,
    RoundTimeHandlers as OldRoundTimeHandlers,
    RoundHandlers as OldRoundHandlers,
    RoundRunningHandlers as OldRoundRunningHandlers,
} from "../game/rounds";
import { RoundHistoryStore as OldRoundHistoryStore } from "../game/round-histories";
import { SettlementStore as OldSettlementStore, SettlementUIHandlers as OldSettlementUIHandlers } from "../game/settlements";

import * as Notification from "../notification";
import * as Players from "../players";
import * as UnderMaintenance from "../under-maintenance";
import * as GameTurnBase from "./export";
import { RoundStore, RoundTimeHandlers, RoundTimeStore, RoundHandlers, RoundRunningHandlers } from "./rounds";

import { BetHandler as OldBetHandler, BetResponseHandlers as OldBetResponseHandlers } from "../game/bets/";

import { BetHandler, BetResponseHandlers } from "./bets";
import { RoundHistoryStore } from "./round-histories";
import { SettlementStore, TurnBaseSettlementUIHandlers } from "./settlements";
import { GameSetting } from "./game-configs";

export const features = [Auth, Players, SiteConfigs, GameTurnBase, Notification, UnderMaintenance, ChipSetting];

export const onContainerCreated = (container: Container) => {
    container.bind(OldGameSetting).toService(GameSetting);

    container.bind(OldRoundStore).toService(RoundStore);

    container.bind(OldRoundTimeStore).toService(RoundTimeStore);

    container.bind(OldRoundTimeHandlers).toService(RoundTimeHandlers);

    container.bind(OldRoundHandlers).toService(RoundHandlers);

    container.bind(OldBetHandler).toService(BetHandler);

    container.bind(OldBetResponseHandlers).toService(BetResponseHandlers);

    container.bind(OldRoundRunningHandlers).toService(RoundRunningHandlers);

    container.bind(OldRoundHistoryStore).toService(RoundHistoryStore);

    container.bind(OldSettlementStore).toService(SettlementStore);

    container.bind(OldSettlementUIHandlers.FinishedShowResult).to(TurnBaseSettlementUIHandlers.FinishedShowResult);
};
