import { DateTime, Duration } from "luxon";
import { AbstractModel } from "./AbstractModel";

describe("AbstractModel", () => {
  // TODO
  describe("toJSON", () => {
    function createModel(attributes: string[], data: any) {
      class MockModel extends AbstractModel {
        public constructor(modelData: any) {
          super(modelData);
          // this[AbstractModel.attributeKey] = attributes;
        }

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data);
    }

    it("should handle undefined", () => {
      const model = createModel(["name"], { id: 1 });
      expect<any>(model.toJSON()).toEqual({ name: undefined });
    });

    it("should handle null", () => {
      const model = createModel(["name"], { id: 1, name: null });
      expect<any>(model.toJSON()).toEqual({ name: null });
    });

    it("should handle string", () => {
      const model = createModel(["name"], { id: 1, name: "name" });
      expect<any>(model.toJSON()).toEqual({ name: "name" });
    });

    it("should handle empty string", () => {
      const model = createModel(["name"], { id: 1, name: "" });
      expect<any>(model.toJSON()).toEqual({ name: "" });
    });

    it("should handle number", () => {
      const model = createModel(["id"], { id: 1, name: "name" });
      expect<any>(model.toJSON()).toEqual({ id: 1 });
    });

    it("should handle zero", () => {
      const model = createModel(["id"], { id: 0, name: "name" });
      expect<any>(model.toJSON()).toEqual({ id: 0 });
    });

    it("should handle Set", () => {
      const model = createModel(["set"], { id: 1, set: new Set([1, 2, 3]) });
      expect<any>(model.toJSON()).toEqual({ set: [1, 2, 3] });
    });

    it("should handle DateTime", () => {
      const date = DateTime.fromISO("2019-01-01T00:00:00");
      const model = createModel(["date"], {
        id: 1,
        date,
      });
      expect<any>(model.toJSON()).toEqual({ date: date.toISO() });
    });

    it("should handle Duration", () => {
      const seconds = 100;
      const duration = Duration.fromMillis(seconds * 1000);
      const model = createModel(["duration"], {
        id: 1,
        duration,
      });
      expect<any>(model.toJSON()).toEqual({ duration: seconds });
    });

    it("should handle multiple", () => {
      const model = createModel(["name", "value", "set"], {
        id: 1,
        name: "name",
        value: 5,
        set: new Set([1, 2, 3]),
      });
      expect<any>(model.toJSON()).toEqual({
        name: "name",
        value: 5,
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
