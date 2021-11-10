import { PageInfo } from "@helpers/page/pageInfo";
import { generateApiErrorDetailsV2 } from "@test/fakes/ApiErrorDetails";
import { generatePageInfo } from "@test/helpers/general";
import { MockModel } from "./mock/baseApiMock.service";
import { hasResolvedSuccessfully, retrieveResolvers } from "./resolver-common";

// TODO Write unit tests
xdescribe("API Resolvers", () => {
  describe("BawResolvers", () => {});
  describe("Resolvers", () => {});
  describe("ListResolver", () => {});
  describe("ShowResolver", () => {});
});

describe("hasResolvedSuccessfully", () => {
  it("should return true if empty object", () => {
    expect(hasResolvedSuccessfully({})).toBeTrue();
  });

  it("should return true if single model", () => {
    const resolvedList = { model0: new MockModel({ id: 1 }) };
    expect(hasResolvedSuccessfully(resolvedList)).toBeTrue();
  });

  it("should return true if multiple models", () => {
    const resolvedList = {
      model0: new MockModel({ id: 1 }),
      model1: new MockModel({ id: 2 }),
    };
    expect(hasResolvedSuccessfully(resolvedList)).toBeTrue();
  });

  it("should return false if any model fails", () => {
    const resolvedList = {
      model0: new MockModel({ id: 1 }),
      model1: generateApiErrorDetailsV2(),
    };
    expect(hasResolvedSuccessfully(resolvedList)).toBeFalse();
  });

  it("should return false if undefined model", () => {
    expect(hasResolvedSuccessfully({ model0: undefined })).toBeFalse();
  });
});

describe("retrieveResolvers", () => {
  it("should handle single resolver", () => {
    const model = new MockModel({ id: 1 });
    const data = generatePageInfo({ model });
    expect(retrieveResolvers(new PageInfo(data))).toEqual({ model0: model });
  });

  it("should handle array resolver", () => {
    const models = [new MockModel({ id: 1 })];
    const data = generatePageInfo({ model: models });
    expect(retrieveResolvers(new PageInfo(data))).toEqual({ model0: models });
  });

  it("should handle multiple resolvers", () => {
    const model0 = new MockModel({ id: 1 });
    const model1 = [new MockModel({ id: 2 })];
    const data = generatePageInfo({ model: model0 }, { model: model1 });
    expect(retrieveResolvers(new PageInfo(data))).toEqual({ model0, model1 });
  });

  it("should handle single errored resolver", () => {
    const model0 = new MockModel({ id: 1 });
    const model1 = generateApiErrorDetailsV2();
    const model2 = [new MockModel({ id: 2 })];
    const data = generatePageInfo(
      { model: model0 },
      { error: model1 },
      { model: model2 }
    );
    expect(retrieveResolvers(new PageInfo(data))).toEqual({
      model0,
      model1,
      model2,
    });
  });

  it("should handle multiple errored resolver", () => {
    const model0 = generateApiErrorDetailsV2();
    const model1 = generateApiErrorDetailsV2();
    const model2 = generateApiErrorDetailsV2();
    const data = generatePageInfo(
      { error: model0 },
      { error: model1 },
      { error: model2 }
    );
    expect(retrieveResolvers(new PageInfo(data))).toEqual({
      model0,
      model1,
      model2,
    });
  });
});
