import { Id, Ids } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";
import {
  AbstractModel,
  BawCollection,
  BawDateTime,
  BawDuration,
  BawPersistAttr,
} from "./AbstractModel";

describe("Attribute Decorators", () => {
  describe("BawPersistAttr", () => {
    it("should append key to model attributes", () => {
      class MockModel extends AbstractModel {
        @BawPersistAttr
        public readonly name: string;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({});
      expect(model[AbstractModel.attributeKey]).toEqual(["name"]);
    });

    it("should append multiple keys to model attributes", () => {
      class MockModel extends AbstractModel {
        @BawPersistAttr
        public readonly name: string;
        @BawPersistAttr
        public readonly value: number;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({});
      expect(model[AbstractModel.attributeKey]).toEqual(["name", "value"]);
    });

    it("should output keys in model toJSON", () => {
      class MockModel extends AbstractModel {
        @BawPersistAttr
        public readonly name: string;
        @BawPersistAttr
        public readonly value: number;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({ name: "test", value: 1 });
      expect(model.toJSON()).toEqual({ name: "test", value: 1 });
    });
  });

  describe("BawCollection", () => {
    function createModel(data: Id[]) {
      class MockModel extends AbstractModel {
        @BawCollection()
        public readonly ids: Ids;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data === undefined ? {} : { ids: data });
    }

    it("should handle persist option", () => {
      class MockModel extends AbstractModel {
        @BawCollection({ persist: true })
        public readonly name: Ids;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({ ids: [1, 2, 3] });
      expect(model[AbstractModel.attributeKey]).toEqual(["name"]);
    });

    it("should handle override key option", () => {
      class MockModel extends AbstractModel {
        @BawCollection({ key: "siteIds" })
        public readonly sites: Ids;
        public readonly siteIds: Id[];

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({ siteIds: [1, 2, 3] });
      expect(model.sites).toEqual(new Set([1, 2, 3]));
      expect(model.siteIds).toEqual([1, 2, 3]);
    });

    it("should convert undefined", () => {
      const model = createModel(undefined);
      expect(model.ids).toEqual(new Set([]));
    });

    it("should convert null", () => {
      const model = createModel(null);
      expect(model.ids).toEqual(new Set([]));
    });

    it("should convert empty array", () => {
      const model = createModel([]);
      expect(model.ids).toEqual(new Set([]));
    });

    it("should convert single value array", () => {
      const model = createModel([1]);
      expect(model.ids).toEqual(new Set([1]));
    });

    it("should convert multi value array", () => {
      const model = createModel([1, 2, 3]);
      expect(model.ids).toEqual(new Set([1, 2, 3]));
    });
  });

  describe("BawDateTime", () => {
    function createModel(data: string) {
      class MockModel extends AbstractModel {
        @BawDateTime()
        public readonly date: DateTime;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data === undefined ? {} : { date: data });
    }

    it("should handle persist option", () => {
      class MockModel extends AbstractModel {
        @BawDateTime({ persist: true })
        public readonly date: DateTime;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({ date: "2019-01-01T00:00:00" });
      expect(model[AbstractModel.attributeKey]).toEqual(["date"]);
    });

    it("should handle override key option", () => {
      class MockModel extends AbstractModel {
        @BawDateTime({ key: "timestamp" })
        public readonly dateTime: DateTime;
        public readonly timestamp: string;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({ timestamp: "2019-01-01T00:00:00" });
      expect(model.dateTime).toEqual(DateTime.fromISO("2019-01-01T00:00:00"));
      expect(model.timestamp).toEqual("2019-01-01T00:00:00");
    });

    it("should convert undefined", () => {
      const model = createModel(undefined);
      expect(model.date).toEqual(null);
    });

    it("should convert null", () => {
      const model = createModel(null);
      expect(model.date).toEqual(null);
    });

    it("should convert timestamp string", () => {
      const model = createModel("2019-01-01T00:00:00");
      expect(model.date).toEqual(DateTime.fromISO("2019-01-01T00:00:00"));
    });
  });

  describe("BawDuration", () => {
    const defaultSeconds = 100;
    let defaultDuration: Duration;

    function createModel(data: number) {
      class MockModel extends AbstractModel {
        @BawDuration()
        public readonly duration: Duration;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data === undefined ? {} : { duration: data });
    }

    beforeEach(() => {
      defaultDuration = Duration.fromObject({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 40,
      });
    });

    it("should handle persist option", () => {
      class MockModel extends AbstractModel {
        @BawDuration({ persist: true })
        public readonly duration: Duration;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({
        duration: defaultSeconds,
      });
      expect(model[AbstractModel.attributeKey]).toEqual(["duration"]);
    });

    it("should handle override key option", () => {
      class MockModel extends AbstractModel {
        @BawDuration({ key: "seconds" })
        public readonly duration: Duration;
        public readonly seconds: number;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      const model = new MockModel({ seconds: defaultSeconds });
      expect(model.duration).toEqual(defaultDuration);
      expect(model.seconds).toEqual(defaultSeconds);
    });

    it("should convert undefined", () => {
      const model = createModel(undefined);
      expect(model.duration).toEqual(null);
    });

    it("should convert null", () => {
      const model = createModel(null);
      expect(model.duration).toEqual(null);
    });

    it("should convert duration string", () => {
      const model = createModel(defaultSeconds);
      expect(model.duration).toEqual(defaultDuration);
    });
  });
});
