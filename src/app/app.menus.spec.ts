import { PermissionLevel } from "@interfaces/apiInterfaces";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateUser } from "@test/fakes/User";
import { UNAUTHORIZED } from "http-status";
import { isAdminPredicate, isGuestPredicate, isLoggedInPredicate, isProjectEditorPredicate } from "./app.menus";
import { Project } from "./models/Project";
import { User } from "./models/User";

describe("Predicates", () => {
  let defaultUser: User;
  let adminUser: User;
  let guestUser: User;

  beforeEach(() => {
    defaultUser = new User(generateUser({}, false));
    adminUser = new User(generateUser({}, true));
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
    function createData(accessLevel: PermissionLevel = PermissionLevel.owner) {
      return {
        resolvers: { project: "resolver" },
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
      { accessLevel: PermissionLevel.owner, hasPermission: true },
      { accessLevel: PermissionLevel.writer, hasPermission: false },
      { accessLevel: PermissionLevel.reader, hasPermission: false },
      { accessLevel: PermissionLevel.unknown, hasPermission: false },
      { accessLevel: PermissionLevel.unresolved, hasPermission: false },
    ].forEach(({ accessLevel, hasPermission }) => {
      it(`should return ${hasPermission} when access level is ${accessLevel}`, () => {
        expect(isProjectEditorPredicate(defaultUser, createData(accessLevel))).toBe(hasPermission);
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
          project: generateBawApiError(UNAUTHORIZED),
        }),
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
