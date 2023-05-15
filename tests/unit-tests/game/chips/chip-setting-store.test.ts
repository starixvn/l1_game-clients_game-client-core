import { ChipSettingStore } from "./../../../../src/game/chips/chip-setting-store";

describe("ChipSettingStore", () => {
    let chipSettingStore: ChipSettingStore;

    beforeEach(() => {
        chipSettingStore = new ChipSettingStore();
    });

    test("initializes with chip setting object", () => {
        // Assert
        expect(chipSettingStore.chipSetting).toEqual({
            0: "#9ec6d3",
            1: "#848484",
            5: "#2cb400",
            10: "#ff930d",
            20: "#962bfa",
            50: "#ff48e4",
            100: "#1477ff",
            200: "#10e3ff",
            500: "#ff3818",
            1000: "#193c66",
            2000: "#8c6f01",
            3000: "#222222",
            5000: "#be000b",
            10000: "#7b004b",
            20000: "#007866",
        });
    });

    test("can update chip colors", () => {
        // Arrange

        const updatedChipInfo = [
            { time: "0001-01-01T00:00:00.000Z", text: "0", value: 0, color: "#000000" },
            { time: "0001-01-01T00:00:00.000Z", text: "50", value: 50, color: "#ffffff" },
        ];

        // Act
        chipSettingStore.updateChipColor(updatedChipInfo);

        // Assert
        expect(chipSettingStore.chipSetting).toEqual({
            0: "#000000",
            1: "#848484",
            5: "#2cb400",
            10: "#ff930d",
            20: "#962bfa",
            50: "#ffffff",
            100: "#1477ff",
            200: "#10e3ff",
            500: "#ff3818",
            1000: "#193c66",
            2000: "#8c6f01",
            3000: "#222222",
            5000: "#be000b",
            10000: "#7b004b",
            20000: "#007866",
        });
    });
});
