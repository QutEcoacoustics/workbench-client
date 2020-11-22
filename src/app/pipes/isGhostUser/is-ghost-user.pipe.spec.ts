import { User } from "@models/User";
import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import { IsGhostUserPipe } from "./is-ghost-user.pipe";

describe("IsGhostUserPipe", () => {
  let spec: SpectatorPipe<IsGhostUserPipe>;
  const createPipe = createPipeFactory(IsGhostUserPipe);

  function assertPipe(val: boolean) {
    if (val) {
      expect(spec.element).toHaveText("true");
    } else {
      expect(spec.element).toHaveText("false");
    }
  }

  function setup(value: User, type: "unknown" | "deleted" | "all") {
    spec = createPipe("<p>{{ value | isGhostUser:type }}</p>", {
      hostProps: { value, type },
    });
  }

  [
    {
      type: "unknown" as "unknown",
      unknown: true,
      deleted: false,
    },
    {
      type: "deleted" as "deleted",
      unknown: false,
      deleted: true,
    },
    {
      type: "all" as "all",
      unknown: true,
      deleted: true,
    },
  ].forEach((testCase) => {
    describe(testCase.type, () => {
      it("should return true for undefined value", () => {
        setup(undefined, testCase.type);
        assertPipe(true);
      });

      it("should return true for null value", () => {
        setup(null, testCase.type);
        assertPipe(true);
      });

      it(`should return ${testCase.unknown} for unknown user`, () => {
        setup(User.unknownUser, testCase.type);
        assertPipe(testCase.unknown);
      });

      it(`should return ${testCase.deleted} for deleted user`, () => {
        setup(User.deletedUser, testCase.type);
        assertPipe(testCase.deleted);
      });

      it("should return false for normal user", () => {
        setup(new User(generateUser()), testCase.type);
        assertPipe(false);
      });
    });
  });
});
