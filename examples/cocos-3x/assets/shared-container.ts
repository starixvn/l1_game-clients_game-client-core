import { getSharedContainer } from "db://shared-components/startup";

const USER_SERVICE_URL = "http://localhost:3000/user";

export const sharedContainer = getSharedContainer(USER_SERVICE_URL);
