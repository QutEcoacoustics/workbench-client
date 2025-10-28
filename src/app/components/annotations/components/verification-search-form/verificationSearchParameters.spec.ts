import { Params } from "@angular/router";
import { VerificationParameters } from "../verification-form/verificationParameters";
import { generateUser } from "@test/fakes/User";
import { User } from "@models/User";

describe("VerificationSearchParameters", () => {
  let mockUser: User;

  function createParameterModel(params?: Params): VerificationParameters {
    mockUser = new User(generateUser({ id: 42 }));
    return new VerificationParameters(params, mockUser);
  }

  it("should create", () => {
    const dataModel = new VerificationParameters();
    expect(dataModel).toBeInstanceOf(VerificationParameters);
  });

  describe("tag priority", () => {
    it("should handle an empty array of tags", () => {
      const dataModel = createParameterModel();
      const realizedResult = dataModel.tagPriority;
      expect(realizedResult).toEqual([]);
    });

    it("should handle an array of tags with no task tag", () => {
      const dataModel = createParameterModel({ tags: "1,2,3,4" });
      const realizedResult = dataModel.tagPriority;
      expect(realizedResult).toEqual([1, 2, 3, 4]);
    });

    it("should handle an array of tags with a task tag", () => {
      const dataModel = createParameterModel({ tags: "1,2,3,4", taskTag: "3" });
      const realizedResult = dataModel.tagPriority;
      expect(realizedResult).toEqual([3, 1, 2, 4]);
    });
  });
});
