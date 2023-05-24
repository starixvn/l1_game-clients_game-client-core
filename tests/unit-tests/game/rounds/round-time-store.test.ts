import { GameSetting } from "../../../../src/game/game-configs";
import { ROUND_STATE, RoundTimeSetting, RoundTimeStore } from "../../../../src/game/rounds";

describe("RoundTimeStore Unit Tests", () => {
    let roundTimeStore: RoundTimeStore;
    let gameSetting = new GameSetting();

    const setting: RoundTimeSetting = {
        wholeRound: 39,
        placingBet: 30,
        lockingBet: 5,
        generatingResult: 2,
        startRound: 1,
    };

    gameSetting.durations = setting;

    beforeEach(() => {
        roundTimeStore = new RoundTimeStore(gameSetting);
    });

    it("should be able to set Round Time Setting", () => {
        // Arrange
        const newSetting: RoundTimeSetting = {
            wholeRound: 39,
            placingBet: 30,
            lockingBet: 5,
            generatingResult: 2,
            startRound: 1,
        };

        // Act
        roundTimeStore.setRoundTimeSetting(newSetting);

        // Assert
        expect(roundTimeStore.wholeRound).toEqual(newSetting.wholeRound);
        expect(roundTimeStore.placingBet).toEqual(newSetting.placingBet);
        expect(roundTimeStore.lockingBet).toEqual(newSetting.lockingBet);
        expect(roundTimeStore.genResult).toEqual(newSetting.generatingResult);
        expect(roundTimeStore.startRound).toEqual(newSetting.startRound);
    });

    it("should be able to count down the round time", () => {
        // Arrange
        roundTimeStore.roundTime = roundTimeStore.wholeRound;

        // Act
        roundTimeStore.countdown();

        // Assert
        expect(roundTimeStore.roundTime).toEqual(roundTimeStore.wholeRound - 1);
    });

    describe("isWaiting", () => {
        it("should return true if roundTime is greater than placingBet and wholeRound is not equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 7;
            roundTimeStore.placingBet = 5;
            roundTimeStore.wholeRound = 2;

            // Assert
            expect(roundTimeStore.isWaiting).toBeTruthy();
        });
        it("should return false if roundTime is less than or equal to placingBet", () => {
            // Arrange
            roundTimeStore.roundTime = 5;
            roundTimeStore.placingBet = 7;
            roundTimeStore.wholeRound = 2;

            // Assert
            expect(roundTimeStore.isWaiting).toBeFalsy();
        });

        it("should return false if wholeRound is equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 7;
            roundTimeStore.placingBet = 5;
            roundTimeStore.wholeRound = 0;

            // Assert
            expect(roundTimeStore.isWaiting).toBeFalsy();
        });
    });

    describe("isStartWaiting", () => {
        it("should return true if roundTime is equal to wholeRound and wholeRound is not equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 2;
            roundTimeStore.wholeRound = 2;

            // Assert
            expect(roundTimeStore.isStartWaiting).toBeTruthy();
        });
        it("should return false if roundTime is less than or greater than wholeRound", () => {
            // Arrange
            roundTimeStore.roundTime = 3;
            roundTimeStore.wholeRound = 2;

            // Assert
            expect(roundTimeStore.isStartWaiting).toBeFalsy();
        });
        it("should return false if wholeRound is equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 2;
            roundTimeStore.wholeRound = 0;

            // Assert
            expect(roundTimeStore.isStartWaiting).toBeFalsy();
        });
    });

    describe("isLocking", () => {
        it("should return true when roundTime is less than or equal to lockingBet and wholeRound is not zero", () => {
            // Arrange
            roundTimeStore.roundTime = 1;
            roundTimeStore.wholeRound = 1;

            // Assert
            expect(roundTimeStore.isLocking).toBeTruthy();
        });

        it("should return false when roundTime is greater than lockingBet", () => {
            // Arrange
            roundTimeStore.roundTime = 20;
            roundTimeStore.wholeRound = 1;

            // Assert
            expect(roundTimeStore.isLocking).toBeFalsy();
        });

        it("should return false when wholeRound is zero", () => {
            // Arrange
            roundTimeStore.roundTime = 2;
            roundTimeStore.wholeRound = 0;

            // Assert
            expect(roundTimeStore.isLocking).toBeFalsy();
        });
    });

    describe("isStaringLocking", () => {
        it("should return true when roundTime equals lockingBet and wholeRound is not zero", () => {
            // Arrange
            roundTimeStore.roundTime = 5;
            roundTimeStore.wholeRound = 1;

            // Assert
            expect(roundTimeStore.isStaringLocking).toBeTruthy();
        });

        it("should return false when roundTime does not equal lockingBet", () => {
            // Arrange
            roundTimeStore.roundTime = 20;
            roundTimeStore.wholeRound = 1;

            // Assert
            expect(roundTimeStore.isStaringLocking).toBeFalsy();
        });

        it("should return false when wholeRound is zero", () => {
            // Arrange
            roundTimeStore.roundTime = 2;
            roundTimeStore.wholeRound = 0;

            // Assert
            expect(roundTimeStore.isStaringLocking).toBeFalsy();
        });
    });

    describe("isPlacingBet", () => {
        it("should return true if roundTime is <= placingBet AND roundTime is > lockingBet AND wholeRound is not equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 6;

            // Assert
            expect(roundTimeStore.isPlacingBet).toBeTruthy();
        });

        it("should return false if roundTime is > placingBet OR roundTime is <= lockingBet OR wholeRound is equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 35;

            // Assert
            expect(roundTimeStore.isPlacingBet).toBeFalsy();
        });
    });

    describe("isStartPlacingBet", () => {
        it("should return true if roundTime is equal to placingBet AND wholeRound is not equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 30;

            // Assert
            expect(roundTimeStore.isStartPlacingBet).toBeTruthy();
        });

        it("should return false if roundTime is not equal to placingBet OR wholeRound is equal to 0", () => {
            // Arrange
            roundTimeStore.roundTime = 5;

            // Assert
            expect(roundTimeStore.isStartPlacingBet).toBeFalsy();
        });
    });

    describe("isShowResult", () => {
        it("should return true when round time is less than (wholeRound - genResult) and greater than placing bet", () => {
            roundTimeStore.roundTime = 10;
            roundTimeStore.wholeRound = 20;
            roundTimeStore.genResult = 5;
            roundTimeStore.placingBet = 5;
            expect(roundTimeStore.isShowResult).toBeTruthy();
        });

        it("should return true when round time equals (wholeRound - genResult)", () => {
            roundTimeStore.roundTime = 15;
            roundTimeStore.wholeRound = 20;
            roundTimeStore.genResult = 5;
            roundTimeStore.placingBet = 5;
            expect(roundTimeStore.isShowResult).toBeTruthy();
        });

        it("should return false when round time equals placing bet", () => {
            roundTimeStore.roundTime = 5;
            roundTimeStore.wholeRound = 20;
            roundTimeStore.genResult = 5;
            roundTimeStore.placingBet = 5;
            expect(roundTimeStore.isShowResult).toBeFalsy();
        });

        it("should return false when round time is greater than (wholeRound - genResult)", () => {
            roundTimeStore.roundTime = 18;
            roundTimeStore.wholeRound = 20;
            roundTimeStore.genResult = 5;
            roundTimeStore.placingBet = 5;
            expect(roundTimeStore.isShowResult).toBeFalsy();
        });
    });

    describe("isStartingRound", () => {
        it("should return true if roundTime is equal to placingBet + startRound", () => {
            // Arrange
            roundTimeStore.roundTime = 10;
            roundTimeStore.startRound = 2;
            roundTimeStore.placingBet = 8;

            // Act
            const result = roundTimeStore.isStartingRound;

            // Assert
            expect(result).toBe(true);
        });

        it("should return false if roundTime is less than placingBet + startRound", () => {
            // Arrange
            roundTimeStore.roundTime = 5;

            // Act
            const result = roundTimeStore.isStartingRound;

            // Assert
            expect(result).toBe(false);
        });

        it("should return false if roundTime is greater than placingBet + startRound", () => {
            // Arrange
            roundTimeStore.roundTime = 35;
            roundTimeStore.startRound = 2;
            roundTimeStore.placingBet = 30;

            // Act
            const result = roundTimeStore.isStartingRound;

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("calculateBeginStatus", () => {
        it("should switch beginState to BEGIN_PLACING_BET if isStartPlacingBet is true and current beginState is not BEGIN_PLACING_BET", () => {
            // Arrange
            const mockObject = {
                isStartPlacingBet: true,
                _beginState: ROUND_STATE.BEGIN_WAITING,
            };

            // Act
            roundTimeStore.calculateBeginStatus.call(mockObject);

            // Assert
            expect(mockObject._beginState).toBe(ROUND_STATE.BEGIN_PLACING_BET);
        });

        it("should switch beginState to BEGIN_LOCKING_BET if isStaringLocking is true and current beginState is not BEGIN_LOCKING_BET", () => {
            // Arrange
            const mockObject = {
                isStaringLocking: true,
                _beginState: ROUND_STATE.BEGIN_WAITING,
            };

            // Act
            roundTimeStore.calculateBeginStatus.call(mockObject);

            // Assert
            expect(mockObject._beginState).toBe(ROUND_STATE.BEGIN_LOCKING_BET);
        });

        it("should switch beginState to BEGIN_WAITING if isStartWaiting is true and current beginState is not BEGIN_WAITING", () => {
            // Arrange
            const mockObject = {
                isStartWaiting: true,
                _beginState: ROUND_STATE.BEGIN_PLACING_BET,
            };

            // Act
            roundTimeStore.calculateBeginStatus.call(mockObject);

            // Assert
            expect(mockObject._beginState).toBe(ROUND_STATE.BEGIN_WAITING);
        });

        it("should not switch beginState if none of the conditions are met", () => {
            // Arrange
            const obj = {
                isStartPlacingBet: false,
                isStaringLocking: false,
                isStartWaiting: false,
                _beginState: ROUND_STATE.BEGIN_PLACING_BET,
            };

            // Act
            roundTimeStore.calculateBeginStatus.call(obj);

            // Assert
            expect(obj._beginState).toBe(ROUND_STATE.BEGIN_PLACING_BET);
        });
    });

    describe("calculateRoundStatus", () => {
        test("set round state to WAITING if round time is negative", () => {
            // Arrange
            roundTimeStore.roundTime = -1;

            // Act
            roundTimeStore.calculateRoundStatus();

            // Assert
            expect(roundTimeStore.roundState).toBe(ROUND_STATE.WAITING);
        });

        describe("check round state is SHOW_ANIMATION_RESULT", () => {
            test("set round state to SHOW_ANIMATION_RESULT if isShowAnimationResult is true (roundTime=0)`", () => {
                // Arrange
                roundTimeStore.roundTime = 0;

                // Act
                roundTimeStore.calculateRoundStatus();

                // Assert
                expect(roundTimeStore.roundState).toBe(ROUND_STATE.SHOW_ANIMATION_RESULT);
            });

            for (let roundTime = setting.wholeRound + 2 - setting.generatingResult; roundTime <= setting.wholeRound; roundTime++) {
                test(`set round state to SHOW_ANIMATION_RESULT if isShowAnimationResult is true (roundTime=${roundTime})`, () => {
                    // Arrange
                    roundTimeStore.roundTime = roundTime;

                    // Act
                    roundTimeStore.calculateRoundStatus();

                    // Assert
                    expect(roundTimeStore.roundState).toBe(ROUND_STATE.SHOW_ANIMATION_RESULT);
                });
            }
        });

        describe("check round state is LOCKING_BET", () => {
            for (let roundTime = 1; roundTime <= setting.lockingBet; roundTime++) {
                test(`set round state to LOCKING_BET if isLocking is true (roundTime=${roundTime})`, () => {
                    // Arrange
                    roundTimeStore.roundTime = roundTime;

                    // Act
                    roundTimeStore.calculateRoundStatus();

                    // Assert
                    expect(roundTimeStore.roundState).toBe(ROUND_STATE.LOCKING_BET);
                });
            }
        });

        describe("check round state is SHOW_RESULT ", () => {
            for (
                let roundTime = setting.placingBet + setting.startRound + 1;
                roundTime <= setting.wholeRound - setting.generatingResult + 1;
                roundTime++
            ) {
                test(`set round state to SHOW_RESULT if isShowResult is true (roundTime=${roundTime})`, () => {
                    // Arrange
                    roundTimeStore.roundTime = roundTime;

                    // Act
                    roundTimeStore.calculateRoundStatus();

                    // Assert
                    expect(roundTimeStore.roundState).toBe(ROUND_STATE.SHOW_RESULT);
                });
            }
        });

        test("set round state to STARTING_ROUND if isStartingRound is true", () => {
            // Arrange
            roundTimeStore.roundTime = setting.placingBet + setting.startRound;

            // Act
            roundTimeStore.calculateRoundStatus();

            // Assert
            expect(roundTimeStore.roundState).toBe(ROUND_STATE.STARTING_ROUND);
        });

        describe("check round state is PLACING_BET", () => {
            for (let roundTime = setting.lockingBet + 1; roundTime <= setting.placingBet; roundTime++) {
                test(`set round state to PLACING_BET if isPlacingBet is true (roundTime=${roundTime})`, () => {
                    // Arrange
                    roundTimeStore.roundTime = roundTime;

                    // Act
                    roundTimeStore.calculateRoundStatus();

                    // Assert
                    expect(roundTimeStore.roundState).toBe(ROUND_STATE.PLACING_BET);
                });
            }
        });
    });

    describe("setJoinGameState", () => {
        test("should set join game state to the current round state", () => {
            roundTimeStore.roundTime = 10;

            roundTimeStore.setJoinGameState();

            expect(roundTimeStore.joinGameState).toBe(ROUND_STATE.PLACING_BET);
        });

        test('should set join game state to "waiting" when round time is negative', () => {
            roundTimeStore.roundTime = -1;

            roundTimeStore.setJoinGameState();

            expect(roundTimeStore.joinGameState).toBe(ROUND_STATE.WAITING);
        });

        test("should reset join game state when stop is called", () => {
            roundTimeStore.joinGameState = ROUND_STATE.SHOW_RESULT;

            roundTimeStore.stop();

            expect(roundTimeStore.joinGameState).toBe("");
        });
    });
});
