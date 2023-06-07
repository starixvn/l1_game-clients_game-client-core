import { stub } from "jest-auto-stub";
import { AuthStore } from "../../../../src/auth/auth-store";
import { SiteConfigs } from "../../../../src/configs";
import { GameConfigStore, GameSetting } from "../../../../src/game/game-configs";
import { GameGuideHandlers } from "../../../../src/game/game-guides/game-guide-handlers";
import { GameGuideStore } from "../../../../src/game/game-guides/game-guide-store";
import { RoundStore } from "../../../../src/game/rounds/round-store";
import { MainPlayerStore } from "../../../../src/players/main-player-store";
import { AppTypes } from "../../../../src/shared/constants/app-type";
import { UrlUtils } from "../../../../src/shared/utils";

jest.mock("../../../../src/shared/utils", () => ({
    UrlUtils: { buildGameGuideUrl: jest.fn() },
}));
const now = new Date(123456);
jest.useFakeTimers().setSystemTime(now);

describe("GameGuideHandlers test", () => {
    describe("GetGuideURL", () => {
        let handler: GameGuideHandlers.GetGuideURL;
        let authStore: AuthStore;
        let guideStore: GameGuideStore;
        beforeEach(() => {
            const siteConfigs = stub<SiteConfigs>();
            const gameSetting = stub<GameSetting>();
            gameSetting.id = 1;
            authStore = stub<AuthStore>();
            const playerStore = stub<MainPlayerStore>();
            playerStore.stakeLevel.minBet = 1;
            playerStore.stakeLevel.maxBet = 2000;
            playerStore.fractionalOddsFormat = false;
            const gameConfigsStore = stub<GameConfigStore>();
            gameConfigsStore.minBet = 1;
            gameConfigsStore.maxBet = 2000;
            gameConfigsStore.boostedChoices = [];
            const roundStore = new RoundStore(gameConfigsStore, playerStore);
            guideStore = stub<GameGuideStore>();
            handler = new GameGuideHandlers.GetGuideURL(
                siteConfigs,
                gameSetting,
                authStore,
                playerStore,
                roundStore,
                gameConfigsStore,
                guideStore
            );
            (UrlUtils.buildGameGuideUrl as jest.Mock).mockReturnValueOnce("guide.test");
        });

        test.each([
            {
                system: AppTypes.Club,
                language: "vi-VN",
                specialDirection: "",
                expected: "guide.test/vi?gId=1&t=blue&f=sc&p=false&v=123456&fof=false&minBet=1&maxBet=2000",
            },
            {
                system: AppTypes.Mobi,
                language: "en-US",
                specialDirection: "",
                expected: "guide.test/en?gId=1&t=blue&f=sm&p=false&v=123456&fof=false&minBet=1&maxBet=2000",
            },
            {
                system: AppTypes.Mobi,
                language: "en-UK",
                specialDirection: "",
                expected: "guide.test/en?gId=1&t=blue&f=sm&p=false&v=123456&fof=false&minBet=1&maxBet=2000",
            },
            {
                system: AppTypes.Instant,
                language: "th-TH",
                specialDirection: "",
                expected: "guide.test/th?gId=1&t=blue&f=si&p=false&v=123456&fof=false&minBet=1&maxBet=2000",
            },
            {
                system: AppTypes.MegaKeno,
                language: "id-ID",
                specialDirection: "",
                expected: "guide.test/id?gId=1&t=blue&f=sm&p=false&v=123456&fof=false&minBet=1&maxBet=2000",
            },
            {
                system: AppTypes.App,
                language: "zh-CN",
                specialDirection: "",
                expected: "guide.test/zh_cn?gId=1&t=blue&f=sc&p=false&v=123456&fof=false&minBet=1&maxBet=2000",
            },
            {
                system: AppTypes.Club,
                language: "zh-TW",
                specialDirection: "&md5=1",
                expected: "guide.test/zh_tw?gId=1&t=blue&f=sc&p=false&v=123456&fof=false&minBet=1&maxBet=2000&md5=1",
            },
        ])(
            "should get expected url when system=$system , language=$language and specialDirection=$specialDirection",
            ({ system, language, specialDirection, expected }) => {
                // arrange
                authStore.system = system;
                authStore.language = language;

                // act
                handler.handle({ theme: "blue", specialDirection });

                // assert
                expect(guideStore.url).toBe(expected);
            }
        );
    });
});
