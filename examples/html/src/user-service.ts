import { Auth } from "game-client-base";

export const USER_SERVICE_URL = "http://localhost:3000/user";

export const userService = new Auth.UserService(USER_SERVICE_URL);
