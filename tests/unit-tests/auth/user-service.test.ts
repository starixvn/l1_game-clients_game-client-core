import { UserService } from "../../../src/auth";
import { UrlUtils } from "../../../src/shared/utils";
import { siteConfigs } from "../container.test";

jest.mock("../../../src/shared/utils");

describe("UserService tests", () => {
    describe("constructor", () => {
        describe("environment Dev", () => {
            it("should create UserServiceClient with expected url", () => {
                // arrange
                const configs = { ...siteConfigs, subDirectory: "" };
                const expectedUrl = `${siteConfigs.userServiceUrlDev}`;

                // act
                const userService = new UserService(configs);

                // assert
                expect(userService.auth.axiosInstance.defaults.baseURL).toBe(expectedUrl);
            });
        });
        describe("environment not Dev", () => {
            it("should create UserServiceClient with expected url when subDirectory empty", () => {
                // arrange
                const configs = { ...siteConfigs, isDev: false, subDirectory: "" };
                const expectedUrl = "userServiceUrl";
                // @ts-ignore
                UrlUtils.buildUrlWithPath = jest.fn().mockReturnValue(expectedUrl);

                // act
                const userService = new UserService(configs);

                // assert
                expect(UrlUtils.buildUrlWithPath).toHaveBeenCalledWith("/user", configs);
                expect(userService.auth.axiosInstance.defaults.baseURL).toBe(expectedUrl);
            });
            it("should create UserServiceClient with expected url when subDirectory not empty", () => {
                // arrange
                const configs = { ...siteConfigs, isDev: false, subDirectory: "uat" };
                const expectedUrl = "UATUserServiceUrl";
                // @ts-ignore
                UrlUtils.buildUrlWithPath = jest.fn().mockReturnValue(expectedUrl);

                // act
                const userService = new UserService(configs);

                // assert
                expect(UrlUtils.buildUrlWithPath).toHaveBeenCalledWith("/uat/user", configs);
                expect(userService.auth.axiosInstance.defaults.baseURL).toBe(expectedUrl);
            });
        });
    });

    describe("sso", () => {
        it("should return expected", () => {
            // arrange
            const token = "token";
            const system = 1;
            const userService = new UserService(siteConfigs);
            const expected = Promise.resolve({ isAuthenticated: false });
            userService.auth.sso = jest.fn().mockReturnValue(expected);

            // act
            const actual = userService.sso(token, system);

            // assert
            expect(userService.auth.sso).toHaveBeenCalledWith(token, system);
            expect(actual).toBe(expected);
        });
    });

    describe("authorize", () => {
        it("should return expected", () => {
            // arrange
            const session = "session";
            const username = "name";
            const userService = new UserService(siteConfigs);
            const expected = Promise.resolve({ isAuthorized: false });
            userService.auth.authorize = jest.fn().mockReturnValue(expected);

            // act
            const actual = userService.authorize(session, username);

            // assert
            expect(userService.auth.authorize).toHaveBeenCalledWith(session, username);
            expect(actual).toBe(expected);
        });
    });

    describe("reCheckIn", () => {
        it("should return expected", () => {
            // arrange
            const session = "session";
            const username = "name";
            const userService = new UserService(siteConfigs);
            const expected = Promise.resolve({ isAuthorized: false });
            userService.auth.reCheckIn = jest.fn().mockReturnValue(expected);

            // act
            const actual = userService.reCheckIn(session, username);

            // assert
            expect(userService.auth.reCheckIn).toHaveBeenCalledWith(session, username);
            expect(actual).toBe(expected);
        });
    });

    describe("getBalance", () => {
        it("should return expected", () => {
            // arrange
            const session = "session";
            const username = "name";
            const userService = new UserService(siteConfigs);
            const expected = Promise.resolve({ red: 0 });
            userService.auth.getBalance = jest.fn().mockReturnValue(expected);

            // act
            const actual = userService.getBalance(session, username);

            // assert
            expect(userService.auth.getBalance).toHaveBeenCalledWith(session, username);
            expect(actual).toBe(expected);
        });
    });

    describe("signName", () => {
        it("should return expected", () => {
            // arrange
            const session = "session";
            const username = "name";
            const nickName = "nickname";
            const userService = new UserService(siteConfigs);
            const expected = Promise.resolve({ isAuthorized: false });
            userService.auth.signName = jest.fn().mockReturnValue(expected);

            // act
            const actual = userService.signName(session, username, nickName);

            // assert
            expect(userService.auth.signName).toHaveBeenCalledWith(session, username, nickName);
            expect(actual).toBe(expected);
        });
    });
});
