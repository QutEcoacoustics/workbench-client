import { AuthToken } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { SpectatorService, createServiceFactory } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import {
  BawSessionService,
  guestAuthToken,
  guestUser,
} from "./baw-session.service";

describe("BawSessionService", () => {
  let defaultUser: User;
  let defaultAuthToken: AuthToken;
  let spec: SpectatorService<BawSessionService>;
  const createService = createServiceFactory(BawSessionService);

  function login() {
    spec.service.setLoggedInUser(defaultUser, defaultAuthToken);
  }

  function logout() {
    spec.service.clearLoggedInUser();
  }

  beforeEach(() => {
    spec = createService();
    defaultUser = new User(generateUser());
    defaultAuthToken = modelData.authToken();
  });

  describe("initial state", () => {
    it("should not be logged in", () => {
      expect(spec.service.isLoggedIn).toBe(false);
    });

    it("should not have logged in user", () => {
      expect(spec.service.loggedInUser).toEqual(guestUser);
    });

    it("should not have auth token", () => {
      expect(spec.service.authToken).toEqual(guestAuthToken);
    });

    it("should return initial state from authTrigger", (done) => {
      spec.service.authTrigger.subscribe((data) => {
        expect(data.user).toEqual(guestUser);
        expect(data.authToken).toBeFalsy();
        done();
      });
    });
  });

  describe("login", () => {
    it("should be logged in", () => {
      login();
      expect(spec.service.isLoggedIn).toBe(true);
    });

    it("should have logged in user", () => {
      login();
      expect(spec.service.loggedInUser).toEqual(defaultUser);
    });

    it("should have auth token", () => {
      login();
      expect(spec.service.authToken).toEqual(defaultAuthToken);
    });

    it("should return state from authTrigger", (done) => {
      let count = 0;
      spec.service.authTrigger.subscribe((data) => {
        if (count < 1) {
          count++;
        } else {
          expect(data.user).toEqual(defaultUser);
          expect(data.authToken).toBe(defaultAuthToken);
          done();
        }
      });
      login();
    });
  });

  describe("logout", () => {
    beforeEach(() => {
      defaultUser = new User(generateUser());
      defaultAuthToken = modelData.authToken();
      spec.service.setLoggedInUser(defaultUser, defaultAuthToken);
    });

    it("should not be logged in", () => {
      logout();
      expect(spec.service.isLoggedIn).toBe(false);
    });

    it("should not have logged in user", () => {
      logout();
      expect(spec.service.loggedInUser).toEqual(guestUser);
    });

    it("should not have auth token", () => {
      logout();
      expect(spec.service.authToken).toEqual(guestAuthToken);
    });

    it("should return initial state from authTrigger", (done) => {
      let count = 0;
      spec.service.authTrigger.subscribe((data) => {
        if (count < 2) {
          count++;
        } else {
          expect(data.user).toEqual(guestUser);
          expect(data.authToken).toBeFalsy();
          done();
        }
      });
      login();
      logout();
    });
  });

  describe("addAuthTokenToUrl", () => {
    beforeEach(() => {
      defaultUser = new User(generateUser());
      defaultAuthToken = modelData.authToken();
      spec.service.setLoggedInUser(defaultUser, defaultAuthToken);
    });

    it("should not modify the url if the user is logged out", () => {
      logout();

      const testUrl = modelData.internet.url();
      const result = spec.service.addAuthTokenToUrl(testUrl);
      expect(result).toBe(testUrl);
    });

    it("should update the auth token if it has changed", () => {
      const testUrl = modelData.internet.url();
      const initialUrl = spec.service.addAuthTokenToUrl(testUrl);

      defaultUser = new User(generateUser());
      defaultAuthToken = modelData.authToken();
      login();

      const newUrl = spec.service.addAuthTokenToUrl(testUrl);
      expect(initialUrl).not.toEqual(newUrl);
    });

    it("should not update the auth token if it has not changed", () => {
      const testUrl = modelData.internet.url();
      const initialUrl = spec.service.addAuthTokenToUrl(testUrl);

      login();

      const newUrl = spec.service.addAuthTokenToUrl(testUrl);
      expect(initialUrl).toEqual(newUrl);
    });

    // because there are no url parameters, we expect that the auth token
    // will be added with the "?" prefix
    it("should add an auth token to a url without any parameters", () => {
      const testUrl = modelData.internet.url();
      const result = spec.service.addAuthTokenToUrl(testUrl);
      expect(result).toEqual(`${testUrl}/?user_token=${defaultAuthToken}`);
    });

    // because there are already url parameters, we expect that the auth token
    // will be added with the "&" prefix
    it("should add an auth token to a url with url parameters", () => {
      const testUrl = `${modelData.internet.url()}/?token=foo&param2=bar`;

      const expected = `${testUrl}&user_token=${defaultAuthToken}`;
      const realized = spec.service.addAuthTokenToUrl(testUrl);

      expect(realized).toEqual(expected);
    });
  });
});
