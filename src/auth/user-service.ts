import { injectable } from "inversify";
import UserServiceClient from "sc-user-service-client";
import Auth from "sc-user-service-client/dist/auth";

@injectable()
export class UserService {
  readonly auth: Auth;
  readonly userServiceClient: UserServiceClient;

  constructor(url: string) {
    this.userServiceClient = new UserServiceClient(url);
    this.auth = this.userServiceClient.auth;
  }

  public sso(token: string, system?: number) {
    return this.auth.sso(token, system);
  }

  public authorize(session: string, username: string) {
    return this.auth.authorize(session, username);
  }

  public reCheckIn(session: string, username: string) {
    return this.auth.reCheckIn(session, username);
  }

  public getBalance(session: string, username: string) {
    return this.auth.getBalance(session, username);
  }
}
