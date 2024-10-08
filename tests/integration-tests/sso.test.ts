import { AuthHandlers, AuthStore, ISessionInfo } from "../../src/auth";
import { MainPlayerStore } from "../../src/players";
import { GameUtils, StorageManager, localStorageKeys } from "../../src/shared/utils";
import { container } from "./stubs/container";
import { normalPlayer } from "./stubs/player";

export const ssoTests = () => {
    describe("sso", () => {
        let authStore: AuthStore;
        beforeAll(() => {
            authStore = container.resolve(AuthStore);
        });

        afterEach(() => {
            authStore.signOut();
        });

        describe("Player has valid token and player info existed in system", () => {
            it("Auth store should has username, language, session, system", async () => {
                // arrange
                const urlParams = new URLSearchParams(`token=${normalPlayer}&appType=1`);
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle(urlParams);

                // assert
                expect(authStore.isAuthenticated).toBe(true);
                expect(authStore.username).toBe(normalPlayer.username);
                expect(authStore.language).toBe(normalPlayer.language);
                expect(authStore.session).toBe(normalPlayer.ss);
                expect(authStore.system).toBe(1);
            });
            it("Store manager should has session info", async () => {
                // arrange
                const urlParams = new URLSearchParams(`token=${normalPlayer}&appType=1`);
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle(urlParams);

                // assert
                const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
                expect(sessionInfo.isAuthenticated).toBe(true);
                expect(sessionInfo.username).toBe(normalPlayer.username);
                expect(sessionInfo.language).toBe(normalPlayer.language);
                expect(sessionInfo.session).toBe(normalPlayer.ss);
                expect(sessionInfo.system).toBe(1);
                expect(sessionInfo.memberName).toBe(normalPlayer.memberName);
            });
            describe("after player authorize successfully", () => {
                it("Player store should has player info", async () => {
                    // arrange
                    const urlParams = new URLSearchParams(`token=${normalPlayer}&appType=1`);
                    const ssoHandler = container.resolve(AuthHandlers.SSO);

                    // act
                    await ssoHandler.handle(urlParams);

                    // assert
                    const mainPlayerStore = container.resolve(MainPlayerStore);
                    expect(mainPlayerStore.UID).toBe(normalPlayer.UID);
                    expect(mainPlayerStore.name).toBe(normalPlayer.name);
                    expect(mainPlayerStore.balance).toBe(normalPlayer.red);
                    expect(mainPlayerStore.currency).toBe(normalPlayer.currency);
                    expect(mainPlayerStore.offerGames).not.toBeNull();
                    expect(mainPlayerStore.offerGames).not.toBeUndefined();
                });

                it("Auth Store should has authorize equal true", async () => {
                    // arrange
                    const urlParams = new URLSearchParams(`token=${normalPlayer}&appType=1`);
                    const ssoHandler = container.resolve(AuthHandlers.SSO);

                    // act
                    await ssoHandler.handle(urlParams);

                    // assert
                    expect(authStore.isAuthorized).toBe(true);
                });
            });
        });

        describe("Player sso from game client V2", () => {
            const params = {
                ss: normalPlayer.ss,
                uname: normalPlayer.username,
                lang: normalPlayer.language,
                appType: 1,
                rurl: "aHR0cHM6Ly9nYW1lLmNvbQ==", // https://game.com
                purl: "aHR0cHM6Ly9nYW1lLmNvbQ==", // https://game.com
            };
            const urlSearchParams = new URLSearchParams();
            Object.keys(params).forEach((key) => params[key] && urlSearchParams.append(key, params[key]));
            const encodedQueryString = GameUtils.base64Encode(urlSearchParams.toString());
            const urlParams = new URLSearchParams(`params=${encodedQueryString}`);

            it("Auth store should has username, language, session, system", async () => {
                // arrange
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle(urlParams);

                // assert
                expect(authStore.isAuthenticated).toBe(true);
                expect(authStore.username).toBe(normalPlayer.username);
                expect(authStore.language).toBe(normalPlayer.language);
                expect(authStore.session).toBe(normalPlayer.ss);
                expect(authStore.system).toBe(params.appType);
            });

            it("Store manager should has session info", async () => {
                // arrange
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle(urlParams);

                // assert
                const sessionInfo = StorageManager.get(localStorageKeys.session) as ISessionInfo;
                expect(sessionInfo.isAuthenticated).toBe(true);
                expect(sessionInfo.username).toBe(normalPlayer.username);
                expect(sessionInfo.language).toBe(normalPlayer.language);
                expect(sessionInfo.session).toBe(normalPlayer.ss);
                expect(sessionInfo.system).toBe(params.appType);
            });

            it("Store manager should has return url", async () => {
                // arrange
                StorageManager.remove(localStorageKeys.returnUrl);
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle(urlParams);

                // assert
                const returnUrl = StorageManager.get(localStorageKeys.returnUrl)?.toString();
                expect(returnUrl).toBe(params.rurl);
            });

            describe("after player authorize successfully", () => {
                it("Player store should has player info", async () => {
                    // arrange
                    const ssoHandler = container.resolve(AuthHandlers.SSO);

                    // act
                    await ssoHandler.handle(urlParams);

                    // assert
                    const mainPlayerStore = container.resolve(MainPlayerStore);
                    expect(mainPlayerStore.UID).toBe(normalPlayer.UID);
                    expect(mainPlayerStore.name).toBe(normalPlayer.name);
                    expect(mainPlayerStore.balance).toBe(normalPlayer.red);
                    expect(mainPlayerStore.currency).toBe(normalPlayer.currency);
                    expect(mainPlayerStore.offerGames).not.toBeNull();
                    expect(mainPlayerStore.offerGames).not.toBeUndefined();
                });

                it("Auth Store should has authorize equal true", async () => {
                    // arrange
                    const ssoHandler = container.resolve(AuthHandlers.SSO);

                    // act
                    await ssoHandler.handle(urlParams);

                    // assert
                    expect(authStore.isAuthorized).toBe(true);
                });
            });
        });
    });
};
