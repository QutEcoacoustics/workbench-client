import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { PermissionLevel } from "@interfaces/apiInterfaces";
import { AbstractModel, UnresolvedModel } from "@models/AbstractModel";
import { createPipeFactory, SpectatorPipe } from "@ngneat/spectator";
import { IsUnresolvedPipe } from "./is-unresolved.pipe";

describe("IsUnresolvedPipe", () => {
  let spec: SpectatorPipe<IsUnresolvedPipe>;
  const createPipe = createPipeFactory(IsUnresolvedPipe);

  function assertPipeIsFalse() {
    expect(spec.element).toHaveText("false");
  }

  function assertPipeIsTrue() {
    expect(spec.element).toHaveText("true");
  }

  function setup(value: Readonly<AbstractModel> | Readonly<AbstractModel[]> | PermissionLevel) {
    spec = createPipe("<p>{{ value | isUnresolved }}</p>", {
      hostProps: { value },
    });
  }

  it("should return false for undefined value", () => {
    setup(undefined);
    assertPipeIsFalse();
  });

  it("should return false for null value", () => {
    setup(null);
    assertPipeIsFalse();
  });

  describe("single model", () => {
    it("should return false for single abstract model", () => {
      setup(new MockModel({}));
      assertPipeIsFalse();
    });

    it("should return true for single unresolved model", () => {
      setup(UnresolvedModel.one);
      assertPipeIsTrue();
    });
  });

  describe("multiple models", () => {
    it("should return false for empty abstract model list", () => {
      setup([]);
      assertPipeIsFalse();
    });

    it("should return false for single value abstract model list", () => {
      setup([new MockModel({})]);
      assertPipeIsFalse();
    });

    it("should return false for multiple value abstract model list", () => {
      setup([new MockModel({}), new MockModel({}), new MockModel({})]);
      assertPipeIsFalse();
    });

    it("should return true for many unresolved models", () => {
      setup(UnresolvedModel.many);
      assertPipeIsTrue();
    });
  });

  describe("access level", () => {
    [PermissionLevel.reader, PermissionLevel.writer, PermissionLevel.owner, PermissionLevel.unknown].forEach(
      (accessLevel) => {
        it(`should return false for ${accessLevel} access level`, () => {
          setup(accessLevel);
          assertPipeIsFalse();
        });
      },
    );

    it(`should return true for ${PermissionLevel.unresolved} access level`, () => {
      setup(PermissionLevel.unresolved);
      assertPipeIsTrue();
    });
  });
});
