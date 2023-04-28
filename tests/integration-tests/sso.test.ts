import { AuthHandlers, AuthStore, ISessionInfo } from "../../src/auth";
import { PlayerStore } from "../../src/players";
import { StorageManager, localStorageKeys } from "../../src/shared/utils";
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
            it("Auth store should has username, language, session", async () => {
                // arrange
                const urlParams = new URLSearchParams({ token: normalPlayer.token });
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle({ urlParams, system: 1 });

                // assert
                expect(authStore.isAuthenticated).toBe(true);
                expect(authStore.username).toBe(normalPlayer.username);
                expect(authStore.language).toBe(normalPlayer.language);
                expect(authStore.session).toBe(normalPlayer.ss);
            });
            it("Store manager should has session info", async () => {
                // arrange
                const urlParams = new URLSearchParams({ token: normalPlayer.token });
                const ssoHandler = container.resolve(AuthHandlers.SSO);

                // act
                await ssoHandler.handle({ urlParams, system: 1 });

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
                    const urlParams = new URLSearchParams({ token: normalPlayer.token });
                    const ssoHandler = container.resolve(AuthHandlers.SSO);

                    // act
                    await ssoHandler.handle({ urlParams, system: 1 });

                    // assert
                    const playerStore = container.resolve(PlayerStore);
                    expect(playerStore.UID).toBe(normalPlayer.UID);
                    expect(playerStore.name).toBe(normalPlayer.name);
                    expect(playerStore.balance).toBe(normalPlayer.red);
                    expect(playerStore.currency).toBe(normalPlayer.currency);
                    expect(playerStore.offerGames).not.toBeNull();
                    expect(playerStore.offerGames).not.toBeUndefined();
                });

                it("Auth Store should has authorize equal true", async () => {
                    // arrange
                    const urlParams = new URLSearchParams({ token: normalPlayer.token });
                    const ssoHandler = container.resolve(AuthHandlers.SSO);

                    // act
                    await ssoHandler.handle({ urlParams, system: 1 });

                    // assert
                    expect(authStore.isAuthorized).toBe(true);
                });
            });
        });
    });
};
