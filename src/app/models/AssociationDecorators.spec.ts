import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as ChildModel } from "@baw-api/mock/baseApiMock.service";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { Subject } from "rxjs";
import { testBawServices } from "../test/helpers/testbed";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { HasMany, HasOne } from "./AssociationDecorators";

describe("Association Decorators", () => {
  let injector: Injector;
  let api: MockStandardApiService;

  /**
   * ! Uses fakeAsync functionality.
   * Assert model matches output. Assumes observable will take 50 milliseconds to return
   */
  function assertModel(
    model: any,
    key: string,
    output: AbstractModel | AbstractModel[]
  ) {
    // tslint:disable-next-line no-unused-expression
    model[key];
    tick(100);
    expect(model[key]).toEqual(output);
  }

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
        public readonly childModels: ChildModel[];

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
        const subject = new Subject<ChildModel[]>();
        setTimeout(() => {
          if (error) {
            subject.error(error);
          } else {
            subject.next(models);
          }
        }, 50);
        return subject;
      });
    }

    it("should handle undefined modelIdentifier", fakeAsync(() => {
      const model = createModel({ ids: undefined }, injector);
      assertModel(model, "childModels", []);
    }));

    it("should handle unresolved", fakeAsync(() => {
      const model = createModel({ ids: [1] }, injector);
      assertModel(model, "childModels", UnresolvedModel.many);
    }));

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
        it("should handle empty", fakeAsync(() => {
          interceptApiRequest([]);
          const model = createModel({ ids: idsType.empty }, injector);
          assertModel(model, "childModels", []);
        }));

        it("should handle multiple responses", fakeAsync(() => {
          const response = [
            new ChildModel({ id: 1 }),
            new ChildModel({ id: 2 }),
          ];
          spyOn(api, "filter").and.callFake(() => {
            const subject = new Subject<ChildModel[]>();
            setTimeout(() => {
              subject.next([response[0]]);
              subject.next([response[1]]);
            }, 50);
            return subject;
          });
          const model = createModel({ ids: idsType.multiple }, injector);
          assertModel(model, "childModels", response);
        }));

        it("should handle single modelIdentifier", fakeAsync(() => {
          interceptApiRequest([new ChildModel({ id: 1 })]);
          const model = createModel({ ids: idsType.single }, injector);
          assertModel(model, "childModels", [new ChildModel({ id: 1 })]);
        }));

        it("should handle multiple modelIdentifiers", fakeAsync(() => {
          const response = [
            new ChildModel({ id: 1 }),
            new ChildModel({ id: 2 }),
          ];
          interceptApiRequest(response);
          const model = createModel({ ids: idsType.multiple }, injector);
          assertModel(model, "childModels", response);
        }));

        it("should handle single parameter", () => {
          interceptApiRequest([]);
          const model = createModel(
            { ids: idsType.multiple, param1: 5 },
            injector,
            undefined,
            "param1"
          );
          // tslint:disable-next-line no-unused-expression
          model.childModels;
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
          // tslint:disable-next-line no-unused-expression
          model.childModels;
          expect(api.filter).toHaveBeenCalledWith(
            {
              filter: { id: { in: [1, 2] } },
            },
            [5, 10]
          );
        });

        it("should handle error", fakeAsync(() => {
          interceptApiRequest(undefined, {
            status: 401,
            message: "Unauthorized",
          });
          const model = createModel({ ids: idsType.empty }, injector);
          assertModel(model, "childModels", []);
        }));

        it("should handle default primary key", () => {
          interceptApiRequest([]);
          const model = createModel({ ids: idsType.multiple }, injector);
          // tslint:disable-next-line no-unused-expression
          model.childModels;
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
          // tslint:disable-next-line no-unused-expression
          model.childModels;
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
            }, 50);
            return subject;
          });

          const model = createModel({ ids: idsType.single }, injector);
          for (let i = 0; i < 5; i++) {
            // tslint:disable-next-line no-unused-expression
            model.childModels;
          }

          assertModel(model, "childModels", [new ChildModel({ id: 1 })]);
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
        public readonly childModel: ChildModel;

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
        const subject = new Subject<ChildModel>();
        setTimeout(() => {
          if (error) {
            subject.error(error);
          } else {
            subject.next(model);
          }
        }, 50);
        return subject;
      });
    }

    it("should handle undefined modelIdentifier", fakeAsync(() => {
      const model = createModel({ id: undefined }, injector);
      assertModel(model, "childModel", null);
    }));

    it("should handle unresolved", () => {
      const model = createModel({ id: 1 }, injector);
      expect(model.childModel as AbstractModel).toEqual(UnresolvedModel.one);
    });

    it("should handle response", fakeAsync(() => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1 }, injector);
      assertModel(model, "childModel", new ChildModel({ id: 1 }));
    }));

    it("should handle single parameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5 }, injector, "param1");
      // tslint:disable-next-line no-unused-expression
      model.childModel;
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
      // tslint:disable-next-line no-unused-expression
      model.childModel;
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
      // tslint:disable-next-line no-unused-expression
      model.childModel;
      expect(api.show).toHaveBeenCalledWith(1, [5, undefined]);
    });

    it("should handle error", fakeAsync(() => {
      interceptApiRequest(undefined, {
        status: 401,
        message: "Unauthorized",
      });
      const model = createModel({ id: 1 }, injector);
      // tslint:disable-next-line no-unused-expression
      model.childModel;
      assertModel(model, "childModel", null);
    }));

    it("should load cached data", fakeAsync(() => {
      spyOn(api, "show").and.callFake(() => {
        const subject = new Subject<ChildModel>();
        setTimeout(() => {
          subject.next(new ChildModel({ id: 1 }));
        }, 50);
        return subject;
      });

      const model = createModel({ id: 1 }, injector);
      for (let i = 0; i < 5; i++) {
        // tslint:disable-next-line no-unused-expression
        model.childModel;
      }

      assertModel(model, "childModel", new ChildModel({ id: 1 }));
      expect(api.show).toHaveBeenCalledTimes(1);
    }));
  });
});
