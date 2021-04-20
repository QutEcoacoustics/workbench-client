import { DateTime, Duration } from "luxon";
import { AbstractModel } from "./AbstractModel";

describe("AbstractModel", () => {
  describe("toJSON", () => {
    function createModel(
      data: any,
      opts?: { create?: string[]; update?: string[] }
    ) {
      class MockModel extends AbstractModel {
        public constructor(modelData: any) {
          super(modelData);
          this[AbstractModel.createAttributesKey] = opts?.create ?? [];
          this[AbstractModel.updateAttributesKey] = opts?.update ?? [];
        }

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data);
    }

    [
      { type: "undefined", value: undefined, output: undefined },
      { type: "null", value: null, output: null },
      { type: "string", value: "example", output: "example" },
      { type: "empty string", value: "", output: "" },
      { type: "number", value: 42, output: 42 },
      { type: "zero", value: 0, output: 0 },
      { type: "Set", value: new Set([1, 2, 3]), output: [1, 2, 3] },
      // Duration should output in seconds
      { type: "Duration", value: Duration.fromMillis(100000), output: 100 },
      {
        type: "DateTime",
        value: DateTime.fromISO("2019-01-01T00:00:00"),
        output: DateTime.fromISO("2019-01-01T00:00:00").toISO(),
      },
    ].forEach(({ type, value, output }) => {
      it(`should handle ${type} on basic toJSON() request`, () => {
        const model = createModel({ id: 1, test: value });
        expect<any>(model.toJSON()).toEqual({ id: 1, test: output });
        expect<any>(model.toJSON({ create: true })).toEqual({});
        expect<any>(model.toJSON({ update: true })).toEqual({});
      });

      it(`should handle ${type} on toJSON({create: true}) request`, () => {
        const model = createModel({ id: 1, test: value }, { create: ["test"] });
        expect<any>(model.toJSON()).toEqual({ id: 1, test: output });
        expect<any>(model.toJSON({ create: true })).toEqual({ test: output });
        expect<any>(model.toJSON({ update: true })).toEqual({});
      });

      it(`should handle ${type} on toJSON({update: true}) request`, () => {
        const model = createModel({ id: 1, test: value }, { update: ["test"] });
        expect<any>(model.toJSON()).toEqual({ id: 1, test: output });
        expect<any>(model.toJSON({ create: true })).toEqual({});
        expect<any>(model.toJSON({ update: true })).toEqual({ test: output });
      });
    });

    let defaultModel: any;
    beforeEach(() => {
      defaultModel = { id: 1, name: "name", set: new Set([1, 2, 3]) };
    });

    it("should handle multiple on basic toJSON() request", () => {
      const model = createModel(defaultModel);
      expect<any>(model.toJSON()).toEqual({
        id: 1,
        name: "name",
        set: [1, 2, 3],
      });
    });

    it("should handle multiple on toJSON({create: true}) request", () => {
      const model = createModel(defaultModel, { create: ["name", "set"] });
      expect<any>(model.toJSON({ create: true })).toEqual({
        name: "name",
        set: [1, 2, 3],
      });
    });

    it("should handle multiple on toJSON({update: true}) request", () => {
      const model = createModel(defaultModel, { update: ["name", "set"] });
      expect<any>(model.toJSON({ update: true })).toEqual({
        name: "name",
        set: [1, 2, 3],
      });
    });
  });

  describe("metadata", () => {
    let model: AbstractModel;
    beforeEach(() => {
      class MockModel extends AbstractModel {
        public constructor() {
          super({ id: 1 });
        }

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }
      model = new MockModel();
    });

    it("should store metadata", () => {
      model.addMetadata({ status: 200, message: "OK" });
      expect(model[AbstractModel["metaKey"]]).toEqual({
        status: 200,
        message: "OK",
      });
    });

    it("should retrieve metadata", () => {
      model.addMetadata({ status: 200, message: "OK" });
      expect(model.getMetadata()).toEqual({
        status: 200,
        message: "OK",
      });
    });

    it("should retrieve empty metadata", () => {
      expect(model.getMetadata()).toBe(undefined);
    });
  });
});
