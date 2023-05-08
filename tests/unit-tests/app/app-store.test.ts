import { UMInfo } from "sc-user-service-client/dist/auth";
import { AppStore } from "../../../src/app/app-store";

describe("appStore tests", () => {
    describe("setUM", () => {
        it("should set isUM true", () => {
            // arrange
            const store = new AppStore();
            const umInfo: UMInfo = { startTime: new Date(1000), endTime: new Date(2000), operatorId: "" };

            // act
            store.setUM(umInfo);

            // assert
            expect(store.isUM).toBe(true);
        });

        it("should set umInfo", () => {
            // arrange
            const store = new AppStore();
            const umInfo: UMInfo = { startTime: new Date(1000), endTime: new Date(2000), operatorId: "" };

            // act
            store.setUM(umInfo);

            // assert
            expect(store.umInfo).toEqual(umInfo);
        });
    });
});
