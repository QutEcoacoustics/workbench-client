import { generateApiErrorDetailsV2 } from "@test/fakes/ApiErrorDetails";
import { MockModel } from "./mock/baseApiMock.service";
import { retrieveResolvers } from "./resolver-common";

// TODO Write unit tests
xdescribe("API Resolvers", () => {
  describe("BawResolvers", () => {});
  describe("Resolvers", () => {});
  describe("ListResolver", () => {});
  describe("ShowResolver", () => {});
});

describe("retrieveResolvers", () => {
  it("should handle single resolver", () => {
    const data: any = {
      resolvers: { resolvedModel: "customResolver" },
      resolvedModel: { model: new MockModel({ id: 1 }) },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel: new MockModel({ id: 1 }),
    });
  });

  it("should handle array resolver", () => {
    const data: any = {
      resolvers: { resolvedModel: "customResolver" },
      resolvedModel: { model: [new MockModel({ id: 1 })] },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel: [new MockModel({ id: 1 })],
    });
  });

  it("should handle multiple resolvers", () => {
    const data: any = {
      resolvers: {
        resolvedModel1: "customResolver1",
        resolvedModel2: "customResolver2",
      },
      resolvedModel1: { model: new MockModel({ id: 1 }) },
      resolvedModel2: { model: [new MockModel({ id: 2 })] },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel1: new MockModel({ id: 1 }),
      resolvedModel2: [new MockModel({ id: 2 })],
    });
  });

  it("should handle single errored resolver", () => {
    const error = generateApiErrorDetailsV2();
    const data: any = {
      resolvers: {
        resolvedModel1: "customResolver1",
        resolvedModel2: "customResolver2",
        resolvedModel3: "customResolver3",
      },
      resolvedModel1: { model: [new MockModel({ id: 1 })] },
      resolvedModel2: { error },
      resolvedModel3: { model: [new MockModel({ id: 2 })] },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel1: new MockModel({ id: 1 }),
      resolvedModel2: error,
      resolvedModel3: [new MockModel({ id: 2 })],
    });
  });

  it("should handle multiple errored resolver", () => {
    const error = generateApiErrorDetailsV2();
    const data: any = {
      resolvers: {
        resolvedModel1: "customResolver1",
        resolvedModel2: "customResolver2",
        resolvedModel3: "customResolver2",
      },
      resolvedModel1: { error },
      resolvedModel2: { error },
      resolvedModel3: { error },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel1: error,
      resolvedModel2: error,
      resolvedModel3: error,
    });
  });
});
