import { DateTime, Duration } from "luxon";
import { AbstractModel } from "./AbstractModel";

describe("AbstractModel", () => {
  describe("toJSON", () => {
    function createModel(attributes: string[], data: any) {
      class MockModel extends AbstractModel {
        constructor(modelData: any) {
          super(modelData);
          this["_attributes"] = attributes;
        }

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data);
    }

    it("should handle string", () => {
      const model = createModel(["name"], { id: 1, name: "name" });
      expect(model.toJSON()).toEqual({ name: "name" });
    });

    it("should handle Set", () => {
      const model = createModel(["set"], { id: 1, set: new Set([1, 2, 3]) });
      expect(model.toJSON()).toEqual({ set: [1, 2, 3] });
    });

    it("should handle DateTime", () => {
      const date = DateTime.fromISO("2019-01-01T00:00:00");
      const model = createModel(["date"], {
        id: 1,
        date,
      });
      expect(model.toJSON()).toEqual({ date: date.toISO() });
    });

    it("should handle Duration", () => {
      const duration = Duration.fromMillis(100000);
      const model = createModel(["duration"], {
        id: 1,
        duration,
      });
      expect(model.toJSON()).toEqual({ duration: 100 });
    });

    it("should handle multiple", () => {
      const model = createModel(["name", "value", "set"], {
        id: 1,
        name: "name",
        value: 5,
        set: new Set([1, 2, 3]),
      });
      expect(model.toJSON()).toEqual({
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
        constructor() {
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

describe("Attribute Decorators", () => {
  xdescribe("BawPersistAttr", () => {
    it("should append key to model attributes", () => {});
  });

  xdescribe("BawCollection", () => {
    it("should handle persist option", () => {});
    it("should handle override key option", () => {});
    it("should convert undefined", () => {});
    it("should convert empty array", () => {});
    it("should convert single value array", () => {});
    it("should convert multi value array", () => {});
  });

  xdescribe("BawDateTime", () => {
    it("should handle persist option", () => {});
    it("should handle override key option", () => {});
    it("should convert undefined", () => {});
    it("should convert timestamp string", () => {});
  });

  xdescribe("BawDuration", () => {
    it("should handle persist option", () => {});
    it("should handle override key option", () => {});
    it("should convert undefined", () => {});
    it("should convert duration string", () => {});
  });
});

describe("Association Decorators", () => {
  xdescribe("HasMany", () => {
    it("should handle undefined", () => {});
    it("should handle single", () => {});
    it("should handle multiple", () => {});
    it("should handle error", () => {});
    it("should handle default primary key", () => {});
    it("should handle custom primary key", () => {});
  });

  xdescribe("HasOne", () => {
    it("should handle undefined", () => {});
    it("should handle response", () => {});
    it("should handle error", () => {});
    it("should handle additional keys", () => {});
  });
});
