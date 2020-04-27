import { AbstractModel } from "@models/AbstractModel";
import { ApiErrorDetails } from "../api.interceptor.service";
import { retrieveResolvers } from "../resolver-common";

class MockModel extends AbstractModel {
  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

// TODO Write unit tests
xdescribe("API Resolvers", () => {
  describe("BawResolvers", () => {});
  describe("Resolvers", () => {});
  describe("ListResolver", () => {});
  describe("ShowResolver", () => {});
});

describe("retrieveResolvers", () => {
  it("should handle single resolver", () => {
    const data = {
      resolvers: {
        resolvedModel: "customResolver",
      },
      resolvedModel: {
        model: new MockModel({ id: 1 }),
      },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel: new MockModel({ id: 1 }),
    });
  });

  it("should handle array resolver", () => {
    const data = {
      resolvers: {
        resolvedModel: "customResolver",
      },
      resolvedModel: {
        model: [new MockModel({ id: 1 })],
      },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel: [new MockModel({ id: 1 })],
    });
  });

  it("should handle multiple resolvers", () => {
    const data = {
      resolvers: {
        resolvedModel1: "customResolver1",
        resolvedModel2: "customResolver2",
      },
      resolvedModel1: {
        model: new MockModel({ id: 1 }),
      },
      resolvedModel2: {
        model: [new MockModel({ id: 2 })],
      },
    };

    expect(retrieveResolvers(data)).toEqual({
      resolvedModel1: new MockModel({ id: 1 }),
      resolvedModel2: [new MockModel({ id: 2 })],
    });
  });

  it("should handle single errored resolver", () => {
    const data = {
      resolvers: {
        resolvedModel1: "customResolver1",
        resolvedModel2: "customResolver2",
        resolvedModel3: "customResolver3",
      },
      resolvedModel1: {
        model: [new MockModel({ id: 1 })],
      },
      resolvedModel2: {
        error: { status: 401, message: "Unauthorized" } as ApiErrorDetails,
      },
      resolvedModel3: {
        model: [new MockModel({ id: 2 })],
      },
    };

    expect(retrieveResolvers(data)).toBeFalse();
  });

  it("should handle multiple errored resolver", () => {
    const data = {
      resolvers: {
        resolvedModel1: "customResolver1",
        resolvedModel2: "customResolver2",
        resolvedModel3: "customResolver2",
      },
      resolvedModel1: {
        error: { status: 401, message: "Unauthorized" } as ApiErrorDetails,
      },
      resolvedModel2: {
        error: { status: 401, message: "Unauthorized" } as ApiErrorDetails,
      },
      resolvedModel3: {
        error: { status: 401, message: "Unauthorized" } as ApiErrorDetails,
      },
    };

    expect(retrieveResolvers(data)).toBeFalse();
  });
});
