import { AccessLevel } from "@interfaces/apiInterfaces";
import {
  isAdminPredicate,
  isGuestPredicate,
  isLoggedInPredicate,
  isProjectEditorPredicate,
} from "./app.menus";
import { Project } from "./models/Project";
import { SessionUser } from "./models/User";
import { ApiErrorDetails } from "./services/baw-api/api.interceptor.service";

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
      expect(isGuestPredicate(guestUser)).toBeTrue();
    });
    it("should be false when logged in", () => {
      expect(isGuestPredicate(defaultUser)).toBeFalse();
    });
  });

  describe("isLoggedInPredicate", () => {
    it("should be true when logged in", () => {
      expect(isLoggedInPredicate(defaultUser)).toBeTrue();
    });
    it("should be false when logged out", () => {
      expect(isLoggedInPredicate(guestUser)).toBeFalse();
    });
  });

  describe("isProjectEditorPredicate", () => {
    function createData(accessLevel: AccessLevel = AccessLevel.owner) {
      return {
        project: {
          model: new Project({
            id: 1,
            name: "Project",
            ownerIds: [5],
            accessLevel,
          }),
        },
      };
    }

    it("should be true when logged in as admin", () => {
      expect(isProjectEditorPredicate(adminUser, createData())).toBeTrue();
    });

    [
      { accessLevel: AccessLevel.owner, hasPermission: true },
      { accessLevel: AccessLevel.reader, hasPermission: false },
      { accessLevel: AccessLevel.unknown, hasPermission: false },
      { accessLevel: AccessLevel.unresolved, hasPermission: false },
      { accessLevel: AccessLevel.writer, hasPermission: true },
    ].forEach(({ accessLevel, hasPermission }) => {
      it(`should return ${hasPermission} when access level is ${accessLevel}`, () => {
        expect(
          isProjectEditorPredicate(defaultUser, createData(accessLevel))
        ).toBe(hasPermission);
      });
    });

    it("should handle missing data", () => {
      expect(isProjectEditorPredicate(defaultUser, undefined)).toBeFalse();
    });

    it("should handle missing project", () => {
      expect(isProjectEditorPredicate(defaultUser, {})).toBeFalse();
    });

    it("should handle error project", () => {
      expect(
        isProjectEditorPredicate(defaultUser, {
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
