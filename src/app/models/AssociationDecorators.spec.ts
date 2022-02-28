import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as ChildModel } from "@baw-api/mock/baseApiMock.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { nStepObservable } from "@test/helpers/general";
import { UNAUTHORIZED } from "http-status";
import { Subject } from "rxjs";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { hasMany, hasOne } from "./AssociationDecorators";

describe("Association Decorators", () => {
  let injector: Injector;
  let api: MockStandardApiService;

  function updateDecorator<T extends Record<string, any>>(
    model: T,
    key: keyof T
  ) {
    return model[key];
  }

  /**
   * Assert model matches output. Assumes observable will take 0 milliseconds to return
   */
  async function assertModel(
    promise: Promise<any>,
    model: any,
    key: string,
    output: AbstractModel | AbstractModel[]
  ) {
    updateDecorator(model, key);
    await promise;
    expect(model[key]).toEqual(output);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockBawApiModule],
      providers: [
        MockStandardApiService,
        { provide: MOCK.token, useExisting: MockStandardApiService },
      ],
    });

    api = TestBed.inject(MockStandardApiService);
    injector = TestBed.inject(Injector);
  });

  describe("HasMany", () => {
    function createModel(
      data: any,
      modelInjector: Injector,
      key?: string,
      ...modelParameters: string[]
    ) {
      class MockModel extends AbstractModel {
        public readonly ids: Ids;
        public readonly param1: Id;
        public readonly param2: Id;
        @hasMany<MockModel, AbstractModel>(
          MOCK,
          "ids",
          key as any,
          modelParameters as any
        )
        public readonly childModels: AbstractModel[];

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }

        public toString(): string {
          return "Mock Model ";
        }
      }

      return new MockModel(data, modelInjector);
    }

    function interceptApiRequest(models?: ChildModel[], error?: BawApiError) {
      const subject = new Subject<ChildModel[]>();
      const promise = nStepObservable(
        subject,
        () => (models ? models : error),
        !models
      );
      spyOn(api, "filter").and.callFake(() => subject);
      return promise;
    }

    it("should handle undefined modelIdentifier", () => {
      const model = createModel({ ids: undefined }, injector);
      expect(model.childModels).toEqual([]);
    });

    it("should handle unresolved", () => {
      const model = createModel({ ids: [1] }, injector);
      expect(model.childModels).toEqual(UnresolvedModel.many);
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
        it("should handle empty", async () => {
          const promise = interceptApiRequest([]);
          const model = createModel({ ids: idsType.empty }, injector);
          await assertModel(promise, model, "childModels", []);
        });

        it("should handle single modelIdentifier", async () => {
          const childModels = [new ChildModel({ id: 1 })];
          const promise = interceptApiRequest(childModels);
          const model = createModel({ ids: idsType.single }, injector);
          await assertModel(promise, model, "childModels", childModels);
        });

        it("should handle multiple modelIdentifiers", async () => {
          const response = [
            new ChildModel({ id: 1 }),
            new ChildModel({ id: 2 }),
          ];
          const promise = interceptApiRequest(response);
          const model = createModel({ ids: idsType.multiple }, injector);
          await assertModel(promise, model, "childModels", response);
        });

        it("should handle single parameter", () => {
          interceptApiRequest([]);
          const model = createModel(
            { ids: idsType.multiple, param1: 5 },
            injector,
            undefined,
            "param1"
          );
          updateDecorator(model, "childModels");
          expect(api.filter).toHaveBeenCalledWith(
            { filter: { id: { in: [1, 2] } } },
            5
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
          updateDecorator(model, "childModels");
          expect(api.filter).toHaveBeenCalledWith(
            { filter: { id: { in: [1, 2] } } },
            5,
            10
          );
        });

        it("should handle error", async () => {
          const promise = interceptApiRequest(
            undefined,
            generateBawApiError(UNAUTHORIZED)
          );
          const model = createModel({ ids: idsType.empty }, injector);
          await assertModel(promise, model, "childModels", []);
        });

        it("should handle default primary key", () => {
          interceptApiRequest([]);
          const model = createModel({ ids: idsType.multiple }, injector);
          updateDecorator(model, "childModels");
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
          updateDecorator(model, "childModels");
          expect(api.filter).toHaveBeenCalledWith({
            filter: { customKey: { in: [1, 2] } },
          });
        });

        it("should load cached data", async () => {
          const childModels = [new ChildModel({ id: 1 })];
          const subject = new Subject<ChildModel[]>();
          const promise = nStepObservable(subject, () => childModels);

          spyOn(api, "filter").and.callFake(() => subject);

          const model = createModel({ ids: idsType.single }, injector);
          for (let i = 0; i < 5; i++) {
            updateDecorator(model, "childModels");
          }

          await assertModel(promise, model, "childModels", childModels);
          expect(api.filter).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("HasOne", () => {
    function createModel(
      data: any,
      modelInjector: Injector,
      modelParameters?: string[],
      failureValue?: any
    ) {
      class MockModel extends AbstractModel {
        public readonly id: Id;
        public readonly param1: Id;
        public readonly param2: Id;
        @hasOne<MockModel, AbstractModel>(
          MOCK,
          "id",
          modelParameters as any,
          failureValue
        )
        public readonly childModel: AbstractModel;

        public get viewUrl(): string {
          throw new Error("Method not implemented.");
        }

        public toString(): string {
          return "Mock Model ";
        }
      }

      return new MockModel(data, modelInjector);
    }

    function interceptApiRequest(model?: ChildModel, error?: BawApiError) {
      const subject = new Subject<ChildModel>();
      const promise = nStepObservable(
        subject,
        () => (model ? model : error),
        !model
      );
      spyOn(api, "show").and.callFake(() => subject);
      return promise;
    }

    it("should handle undefined modelIdentifier", () => {
      const model = createModel({ id: undefined }, injector);
      expect(model.childModel).toEqual(null);
    });

    it("should handle unresolved", () => {
      const model = createModel({ id: 1 }, injector);
      expect(model.childModel).toEqual(UnresolvedModel.one);
    });

    it("should handle response", async () => {
      const promise = interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1 }, injector);
      await assertModel(
        promise,
        model,
        "childModel",
        new ChildModel({ id: 1 })
      );
    });

    it("should handle single parameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5 }, injector, ["param1"]);
      updateDecorator(model, "childModel");
      expect(api.show).toHaveBeenCalledWith(1, 5);
    });

    it("should handle multiple parameters", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5, param2: 10 }, injector, [
        "param1",
        "param2",
      ]);
      updateDecorator(model, "childModel");
      expect(api.show).toHaveBeenCalledWith(1, 5, 10);
    });

    it("should handle undefined modelParameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5 }, injector, [
        "param1",
        "param2",
      ]);
      updateDecorator(model, "childModel");
      expect(api.show).toHaveBeenCalledWith(1, 5, undefined);
    });

    it("should handle error", async () => {
      const promise = interceptApiRequest(
        undefined,
        generateBawApiError(UNAUTHORIZED)
      );
      const model = createModel({ id: 1 }, injector);
      await assertModel(promise, model, "childModel", null);
    });

    it("should load cached data", async () => {
      const childModel = new ChildModel({ id: 1 });
      const subject = new Subject<ChildModel>();
      const promise = nStepObservable(subject, () => childModel);

      spyOn(api, "show").and.callFake(() => subject);

      const model = createModel({ id: 1 }, injector);
      for (let i = 0; i < 5; i++) {
        updateDecorator(model, "childModel");
      }

      await assertModel(promise, model, "childModel", childModel);
      expect(api.show).toHaveBeenCalledTimes(1);
    });

    it("should return failure value", async () => {
      const promise = interceptApiRequest(
        undefined,
        generateBawApiError(UNAUTHORIZED)
      );
      const model = createModel({ id: 1 }, injector, [], true);
      await assertModel(promise, model, "childModel", true as any);
    });
  });
});
