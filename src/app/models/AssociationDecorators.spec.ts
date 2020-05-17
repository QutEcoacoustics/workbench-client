import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { shouldNotFail, shouldNotSucceed } from "@baw-api/baw-api.service.spec";
import { MockModel as ChildModel } from "@baw-api/mock/baseApiMock.service";
import {
  MOCK,
  MockStandardApiService,
} from "@baw-api/mock/standardApiMock.service";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { testBawServices } from "../test/helpers/testbed";
import { AbstractModel } from "./AbstractModel";
import { HasMany, HasOne } from "./AssociationDecorators";

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
    function createModel(
      data: object,
      modelInjector: Injector,
      key?: string,
      ...modelParameters: string[]
    ) {
      class MockModel extends AbstractModel {
        public readonly ids: Ids;
        public readonly param1: Id;
        public readonly param2: Id;
        @HasMany<MockModel>(
          MOCK,
          "ids",
          key as any,
          ...(modelParameters as any)
        )
        public readonly childModels: Observable<ChildModel[]>;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }

        public toString(): string {
          return "MockModel ";
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
      model.childModels.subscribe((models) => {
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
          model.childModels.subscribe((models) => {
            expect(models).toEqual([]);
            done();
          }, shouldNotFail);
        });

        it("should handle single modelIdentifier", (done) => {
          interceptApiRequest([new ChildModel({ id: 1 })]);
          const model = createModel({ ids: idsType.single }, injector);
          model.childModels.subscribe((models) => {
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
          model.childModels.subscribe((models) => {
            expect(models).toEqual(response);
            done();
          }, shouldNotFail);
        });

        it("should handle single parameter", () => {
          interceptApiRequest([]);
          const model = createModel(
            { ids: idsType.multiple, param1: 5 },
            injector,
            undefined,
            "param1"
          );
          model.childModels.subscribe();
          expect(api.filter).toHaveBeenCalledWith(
            {
              filter: { id: { in: [1, 2] } },
            },
            [5]
          );
        });

        it("should handle multiple parameters", () => {
          interceptApiRequest([]);
          const model = createModel(
            { ids: idsType.multiple, param1: 5, param2: 10 },
            injector,
            undefined,
            "param1",
            "param2"
          );
          model.childModels.subscribe();
          expect(api.filter).toHaveBeenCalledWith(
            {
              filter: { id: { in: [1, 2] } },
            },
            [5, 10]
          );
        });

        it("should handle error", (done) => {
          interceptApiRequest(undefined, {
            status: 401,
            message: "Unauthorized",
          });
          const model = createModel({ ids: idsType.empty }, injector);
          model.childModels.subscribe(shouldNotSucceed, (error) => {
            expect(error).toEqual({ status: 401, message: "Unauthorized" });
            done();
          });
        });

        it("should handle default primary key", () => {
          interceptApiRequest([]);
          const model = createModel({ ids: idsType.multiple }, injector);
          model.childModels.subscribe();
          expect(api.filter).toHaveBeenCalledWith(
            {
              filter: { id: { in: [1, 2] } },
            },
            []
          );
        });

        it("should handle custom primary key", () => {
          interceptApiRequest([]);
          const model = createModel(
            { ids: idsType.multiple },
            injector,
            "customKey"
          );
          model.childModels.subscribe();
          expect(api.filter).toHaveBeenCalledWith(
            {
              filter: { customKey: { in: [1, 2] } },
            },
            []
          );
        });

        it("should load cached data", fakeAsync(() => {
          spyOn(api, "filter").and.callFake(() => {
            const subject = new Subject<ChildModel[]>();
            setTimeout(() => {
              subject.next([new ChildModel({ id: 1 })]);
            }, 100);
            return subject;
          });

          const model = createModel({ ids: idsType.single }, injector);
          for (let i = 0; i < 5; i++) {
            model.childModels.subscribe((models) => {
              expect(models).toEqual([new ChildModel({ id: 1 })]);
            }, shouldNotFail);
          }

          tick(100);
          expect(api.filter).toHaveBeenCalledTimes(1);
        }));
      });
    });
  });

  describe("HasOne", () => {
    function createModel(
      data: object,
      modelInjector: Injector,
      ...modelParameters: string[]
    ) {
      class MockModel extends AbstractModel {
        public readonly id: Id;
        public readonly param1: Id;
        public readonly param2: Id;
        @HasOne<MockModel>(MOCK, "id", ...(modelParameters as any))
        public readonly childModel: Observable<ChildModel>;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }

        public toString(): string {
          return "MockModel ";
        }
      }

      return new MockModel(data, modelInjector);
    }

    function interceptApiRequest(model?: ChildModel, error?: ApiErrorDetails) {
      spyOn(api, "show").and.callFake(() => {
        if (!error) {
          return new BehaviorSubject<ChildModel>(model);
        } else {
          const subject = new Subject<ChildModel>();
          subject.error(error);
          return subject;
        }
      });
    }

    it("should handle undefined modelIdentifier", (done) => {
      const model = createModel({ id: undefined }, injector);
      model.childModel.subscribe((response) => {
        expect(response).toBe(null);
        done();
      }, shouldNotFail);
    });

    it("should handle response", (done) => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1 }, injector);
      model.childModel.subscribe((response) => {
        expect(response).toEqual(new ChildModel({ id: 1 }));
        done();
      }, shouldNotFail);
    });

    it("should handle single parameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5 }, injector, "param1");
      model.childModel.subscribe();
      expect(api.show).toHaveBeenCalledWith(1, [5]);
    });

    it("should handle multiple parameters", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel(
        { id: 1, param1: 5, param2: 10 },
        injector,
        "param1",
        "param2"
      );
      model.childModel.subscribe();
      expect(api.show).toHaveBeenCalledWith(1, [5, 10]);
    });

    it("should handle undefined modelParameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel(
        { id: 1, param1: 5 },
        injector,
        "param1",
        "param2"
      );
      model.childModel.subscribe();
      expect(api.show).toHaveBeenCalledWith(1, [5, undefined]);
    });

    it("should handle error", (done) => {
      interceptApiRequest(undefined, {
        status: 401,
        message: "Unauthorized",
      });
      const model = createModel({ id: 1 }, injector);
      model.childModel.subscribe(shouldNotSucceed, (error) => {
        expect(error).toEqual({ status: 401, message: "Unauthorized" });
        done();
      });
    });

    it("should load cached data", fakeAsync(() => {
      spyOn(api, "show").and.callFake(() => {
        const subject = new Subject<ChildModel>();
        setTimeout(() => {
          subject.next(new ChildModel({ id: 1 }));
        }, 100);
        return subject;
      });

      const model = createModel({ id: 1 }, injector);
      for (let i = 0; i < 5; i++) {
        model.childModel.subscribe((models) => {
          expect(models).toEqual(new ChildModel({ id: 1 }));
        }, shouldNotFail);
      }

      tick(100);
      expect(api.show).toHaveBeenCalledTimes(1);
    }));
  });
});
