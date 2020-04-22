import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { async, TestBed } from "@angular/core/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { shouldNotFail, shouldNotSucceed } from "@baw-api/baw-api.service.spec";
import { MockModel as ChildModel } from "@baw-api/mock/baseApiMock.service";
import {
  MOCK,
  MockStandardApiService,
} from "@baw-api/mock/standardApiMock.service";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { testBawServices } from "../test.helper";
import {
  AbstractModel,
  BawCollection,
  BawDateTime,
  BawDuration,
  BawPersistAttr,
  HasMany,
} from "./AbstractModel";

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

    it("should handle undefined", () => {
      const model = createModel(["name"], { id: 1 });
      expect(model.toJSON()).toEqual({ name: undefined });
    });

    it("should handle null", () => {
      const model = createModel(["name"], { id: 1, name: null });
      expect(model.toJSON()).toEqual({ name: null });
    });

    it("should handle string", () => {
      const model = createModel(["name"], { id: 1, name: "name" });
      expect(model.toJSON()).toEqual({ name: "name" });
    });

    it("should handle empty string", () => {
      const model = createModel(["name"], { id: 1, name: "" });
      expect(model.toJSON()).toEqual({ name: "" });
    });

    it("should handle number", () => {
      const model = createModel(["id"], { id: 1, name: "name" });
      expect(model.toJSON()).toEqual({ id: 1 });
    });

    it("should handle zero", () => {
      const model = createModel(["id"], { id: 0, name: "name" });
      expect(model.toJSON()).toEqual({ id: 0 });
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
      expect(model["_attributes"]).toEqual(["name"]);
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
      expect(model["_attributes"]).toEqual(["name", "value"]);
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
      expect(model["_attributes"]).toEqual(["name"]);
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
      expect(model["_attributes"]).toEqual(["date"]);
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
      expect(model["_attributes"]).toEqual(["duration"]);
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

describe("Association Decorators", () => {
  let injector: Injector;
  let api: MockStandardApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ...testBawServices,
        MockStandardApiService,
        { provide: MOCK.token, useExisting: MockStandardApiService },
      ],
    });

    api = TestBed.inject(MockStandardApiService);
    injector = TestBed.inject(Injector);
  }));

  describe("HasMany", () => {
    function createModel(data: object, modelInjector: Injector, key?: string) {
      class MockModel extends AbstractModel {
        public readonly ids: Ids;
        @HasMany(MOCK, (m: MockModel) => m.ids, key)
        public readonly models: Observable<ChildModel[]>;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }
      }

      return new MockModel(data, modelInjector);
    }

    function interceptApiRequest(
      models?: ChildModel[],
      error?: ApiErrorDetails
    ) {
      spyOn(api, "filter").and.callFake(() => {
        if (!error) {
          return new BehaviorSubject<ChildModel[]>(models);
        } else {
          const subject = new Subject<ChildModel[]>();
          subject.error(error);
          return subject;
        }
      });
    }

    it("should handle undefined modelIdentifier", (done) => {
      const model = createModel({ ids: undefined }, injector);
      model.models.subscribe((models) => {
        expect(models).toEqual([]);
        done();
      }, shouldNotFail);
    });

    [
      {
        type: "Set",
        empty: new Set([]),
        single: new Set([1]),
        multiple: new Set([1, 2]),
      },
      { type: "Array", empty: [], single: [1], multiple: [1, 2] },
    ].forEach((idsType) => {
      describe(idsType.type, () => {
        it("should handle empty", (done) => {
          interceptApiRequest([]);
          const model = createModel({ ids: idsType.empty }, injector);
          model.models.subscribe((models) => {
            expect(models).toEqual([]);
            done();
          }, shouldNotFail);
        });

        it("should handle single modelIdentifier", (done) => {
          interceptApiRequest([new ChildModel({ id: 1 })]);
          const model = createModel({ ids: idsType.single }, injector);
          model.models.subscribe((models) => {
            expect(models).toEqual([new ChildModel({ id: 1 })]);
            done();
          }, shouldNotFail);
        });

        it("should handle multiple modelIdentifiers", (done) => {
          const response = [
            new ChildModel({ id: 1 }),
            new ChildModel({ id: 2 }),
          ];
          interceptApiRequest(response);
          const model = createModel({ ids: idsType.multiple }, injector);
          model.models.subscribe((models) => {
            expect(models).toEqual(response);
            done();
          }, shouldNotFail);
        });

        it("should handle error", (done) => {
          interceptApiRequest(undefined, {
            status: 401,
            message: "Unauthorized",
          });
          const model = createModel({ ids: idsType.empty }, injector);
          model.models.subscribe(shouldNotSucceed, (error) => {
            expect(error).toEqual({ status: 401, message: "Unauthorized" });
            done();
          });
        });

        it("should handle default primary key", () => {
          interceptApiRequest([]);
          const model = createModel({ ids: idsType.multiple }, injector);
          model.models.subscribe();
          expect(api.filter).toHaveBeenCalledWith({
            filter: { id: { in: [1, 2] } },
          });
        });

        it("should handle custom primary key", () => {
          interceptApiRequest([]);
          const model = createModel(
            { ids: idsType.multiple },
            injector,
            "customKey"
          );
          model.models.subscribe();
          expect(api.filter).toHaveBeenCalledWith({
            filter: { customKey: { in: [1, 2] } },
          });
        });
      });
    });
  });

  xdescribe("HasOne", () => {
    it("should handle undefined", () => {});
    it("should handle response", () => {});
    it("should handle no additional ids", () => {});
    it("should handle single additional id", () => {});
    it("should handle multiple additional ids", () => {});
    it("should handle error", () => {});
    it("should handle additional keys", () => {});
  });
});
