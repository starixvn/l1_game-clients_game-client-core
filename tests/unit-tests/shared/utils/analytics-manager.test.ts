import { AnalyticsManager, TrackingParameter } from "./../../../../src/shared/utils/analytics-manager";

global.gtag = jest.fn();

describe("AnalyticsManager", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("trackEvent", () => {
        it("should call gtag with the correct arguments", () => {
            // Arrange
            const event = "test_event";
            const params: TrackingParameter = {
                location: "test_location",
                action: "test_action",
                object_name: "test_object_name",
                game_name: "test_game_name",
            };

            // Act
            AnalyticsManager.trackEvent(event, params);

            // Assert
            expect(global.gtag).toHaveBeenCalledWith("event", event, params);
        });

        it("should call gtag with the correct arguments when params are undefined", () => {
            // Arrange
            const event = "test_event";

            // Act
            AnalyticsManager.trackEvent(event, {});

            // Assert
            expect(global.gtag).toHaveBeenCalledWith("event", event, {});
        });
    });
});
