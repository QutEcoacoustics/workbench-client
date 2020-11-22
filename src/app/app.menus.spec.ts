import {
  isAdminPredicate,
  isGuestPredicate,
  isLoggedInPredicate,
  isProjectOwnerPredicate,
} from "./app.menus";
import { Project } from "./models/Project";
import { SessionUser } from "./models/User";
import { ApiErrorDetails } from "./services/baw-api/api.interceptor.service";
import { ResolvedModel } from "./services/baw-api/resolver-common";

describe("Predicates", () => {
  let defaultUser: SessionUser;
  let adminUser: SessionUser;
  let guestUser: SessionUser;

  beforeEach(() => {
    defaultUser = new SessionUser({
      id: 1,
      userName: "username",
      authToken: "xxxxxxxxxxxxxxx",
      rolesMask: 2,
      rolesMaskNames: ["user"],
    });
    adminUser = new SessionUser({
      id: 1,
      userName: "username",
      authToken: "xxxxxxxxxxxxxxx",
      rolesMask: 3,
      rolesMaskNames: ["admin"],
    });
    guestUser = undefined;
  });

  describe("isGuestPredicate", () => {
    it("should be true when logged out", () => {
      expect(false).toBeTrue();
      expect(isGuestPredicate(guestUser)).toBeTrue();
    });
    it("should be false when logged in", () => {
      expect(false).toBeTrue();
      expect(isGuestPredicate(defaultUser)).toBeFalse();
    });
  });

  describe("isLoggedInPredicate", () => {
    it("should be true when logged in", () => {
      expect(false).toBeTrue();
      expect(isLoggedInPredicate(defaultUser)).toBeTrue();
    });
    it("should be false when logged out", () => {
      expect(false).toBeTrue();
      expect(isLoggedInPredicate(guestUser)).toBeFalse();
    });
  });

  describe("isProjectOwnerPredicate", () => {
    let data: {
      project: ResolvedModel<Project>;
    };

    beforeEach(() => {
      data = {
        project: {
          model: new Project({
            id: 1,
            name: "Project",
            ownerId: 5,
          }),
        },
      };
    });

    it("should be true when logged in as admin", () => {
      expect(false).toBeTrue();
      expect(isProjectOwnerPredicate(adminUser, data)).toBeTrue();
    });

    it("should be true when logged in as owner", () => {
      const user = new SessionUser({
        ...defaultUser,
        id: 5,
      });

      expect(isProjectOwnerPredicate(user, data)).toBeTrue();
    });

    it("should be false when logged in as regular user", () => {
      expect(isProjectOwnerPredicate(defaultUser, data)).toBeFalse();
    });

    it("should be false when logged out", () => {
      expect(isProjectOwnerPredicate(guestUser, data)).toBeFalse();
    });

    it("should handle missing data", () => {
      expect(isProjectOwnerPredicate(defaultUser, undefined)).toBeFalse();
    });

    it("should handle missing project", () => {
      expect(isProjectOwnerPredicate(defaultUser, {})).toBeFalse();
    });

    it("should handle error project", () => {
      expect(
        isProjectOwnerPredicate(defaultUser, {
          project: { status: 401, message: "Unauthorized" } as ApiErrorDetails,
        })
      ).toBeFalse();
    });
  });

  describe("isAdminPredicate", () => {
    it("should be true when logged in as admin", () => {
      expect(isAdminPredicate(adminUser)).toBeTrue();
    });

    it("should be false when logged in as regular user", () => {
      expect(isAdminPredicate(defaultUser)).toBeFalse();
    });

    it("should be false when logged out", () => {
      expect(isAdminPredicate(guestUser)).toBeFalse();
    });
  });
});
