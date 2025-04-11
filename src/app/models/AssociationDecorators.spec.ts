import { provideHttpClientTesting } from "@angular/common/http/testing";
import { fakeAsync, TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as ChildModel } from "@baw-api/mock/baseApiMock.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { nStepObservable } from "@test/helpers/general";
import { UNAUTHORIZED } from "http-status";
import { of, Subject } from "rxjs";
import { ToastService } from "@services/toasts/toasts.service";
import { mockProvider } from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { modelData } from "@test/helpers/faker";
import { Errorable } from "@helpers/advancedTypes";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { hasMany, hasOne } from "./AssociationDecorators";
import { AssociationInjector } from "./ImplementsInjector";

describe("Association Decorators", () => {
  let injector: AssociationInjector;
  let api: MockStandardApiService;
  let toastSpy: ToastService;

  function updateDecorator<T extends Record<string, any>>(model: T, key: keyof T) {
    return model[key];
  }

  /**
   * Assert model matches output. Assumes observable will take 0 milliseconds to return
   */
  async function assertModel(promise: Promise<any>, model: any, key: string, output: AbstractModel | AbstractModel[]) {
    updateDecorator(model, key);
    await promise;
    expect(model[key]).toEqual(output);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockBawApiModule],
      providers: [
        MockStandardApiService,
        { provide: MOCK.token, useExisting: MockStandardApiService },
        mockProvider(ToastService),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    api = TestBed.inject(MockStandardApiService);
    injector = TestBed.inject(ASSOCIATION_INJECTOR);

    toastSpy = TestBed.inject(ToastService);
    toastSpy.error = jasmine.createSpy("error");
  });

  describe("HasMany", () => {
    let mockApiResponses: Map<Id, Errorable<ChildModel>>;
    let apiShowSpy: jasmine.Spy;

    const responseWait = (): Promise<void> =>
      new Promise((resolve) => {
        setTimeout(() => resolve(), 0);
      });

    function createModel(data: any, modelInjector: AssociationInjector, ...modelParameters: string[]) {
      class MockModel extends AbstractModel {
        public readonly ids: Ids;
        public readonly param1: Id;
        public readonly param2: Id;
        @hasMany<MockModel, AbstractModel>(MOCK, "ids", modelParameters as any)
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

    function interceptApiRequest(modelId: Id, response: ChildModel | BawApiError): Promise<void> {
      mockApiResponses.set(modelId, response);
      return responseWait();
    }

    function mockApiModel(model: ChildModel): Promise<void> {
      return interceptApiRequest(model.id, model);
    }

    beforeEach(() => {
      mockApiResponses = new Map();
      apiShowSpy = spyOn(api, "show");
      apiShowSpy.and.callFake((id: Id) => of(mockApiResponses.get(id)));
    });

    it("should handle undefined modelIdentifier", () => {
      const model = createModel({ ids: undefined }, injector);
      expect(model.childModels).toEqual([]);
    });

    it("should handle unresolved", () => {
      const model = createModel({ ids: [1] }, injector);
      expect(model.childModels).toEqual(UnresolvedModel.many);
    });

    it("should not raise a failure to the user", fakeAsync(() => {
      interceptApiRequest(undefined, generateBawApiError(UNAUTHORIZED));
      createModel({ id: 1 }, injector);
      expect(toastSpy.error).not.toHaveBeenCalled();
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
        it("should handle empty", async () => {
          const model = createModel({ ids: idsType.empty }, injector);
          await assertModel(responseWait(), model, "childModels", []);
        });

        it("should handle single modelIdentifier", async () => {
          const childModel = new ChildModel({ id: 1 });
          const promise = mockApiModel(childModel);

          const model = createModel({ ids: idsType.single }, injector);
          await assertModel(promise, model, "childModels", [childModel]);
        });

        it("should handle multiple modelIdentifiers", async () => {
          const response = [new ChildModel({ id: 1 }), new ChildModel({ id: 2 })];

          const mockedApiResponses = [mockApiModel(response[0]), mockApiModel(response[1])];

          const promise = Promise.allSettled(mockedApiResponses);

          const model = createModel({ ids: idsType.multiple }, injector);
          await assertModel(promise, model, "childModels", response);
        });

        it("should handle single parameter", () => {
          const testedIds = idsType.multiple;
          const parameterValue = modelData.datatype.number();

          const model = createModel({ ids: testedIds, param1: parameterValue }, injector, "param1");
          updateDecorator(model, "childModels");

          for (const associatedId of testedIds) {
            expect(api.show).toHaveBeenCalledWith(associatedId, parameterValue);
          }
        });

        it("should handle multiple parameters", () => {
          const testedIds = idsType.multiple;
          const param1 = modelData.datatype.number();
          const param2 = modelData.datatype.number();

          const model = createModel({ ids: testedIds, param1, param2 }, injector, "param1", "param2");
          updateDecorator(model, "childModels");

          for (const associatedId of testedIds) {
            expect(api.show).toHaveBeenCalledWith(associatedId, param1, param2);
          }
        });

        it("should handle error", async () => {
          const promise = interceptApiRequest(undefined, generateBawApiError(UNAUTHORIZED));
          const model = createModel({ ids: idsType.empty }, injector);
          await assertModel(promise, model, "childModels", []);
        });

        it("should load cached data", async () => {
          const testedIds = idsType.single;

          const childModel = new ChildModel({ id: 1 });
          const promise = mockApiModel(childModel);

          // request the associated models multiple times without changing the
          // association ids on the parent model
          // because we have not change the associated ids on the parent model
          // we should see that the api is only called once
          const model = createModel({ ids: testedIds }, injector);
          for (let i = 0; i < 5; i++) {
            updateDecorator(model, "childModels");
          }

          await assertModel(promise, model, "childModels", [childModel]);
          expect(api.show).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("HasOne", () => {
    function createModel(
      data: any,
      modelInjector: AssociationInjector,
      modelParameters?: string[],
      failureValue?: any,
    ) {
      class MockModel extends AbstractModel {
        public readonly id: Id;
        public readonly param1: Id;
        public readonly param2: Id;
        @hasOne<MockModel, AbstractModel>(MOCK, "id", modelParameters as any, failureValue)
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
      const promise = nStepObservable(subject, () => (model ? model : error), !model);
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
      await assertModel(promise, model, "childModel", new ChildModel({ id: 1 }));
    });

    it("should handle single parameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5 }, injector, ["param1"]);
      updateDecorator(model, "childModel");
      expect(api.show).toHaveBeenCalledWith(1, 5);
    });

    it("should handle multiple parameters", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5, param2: 10 }, injector, ["param1", "param2"]);
      updateDecorator(model, "childModel");
      expect(api.show).toHaveBeenCalledWith(1, 5, 10);
    });

    it("should handle undefined modelParameter", () => {
      interceptApiRequest(new ChildModel({ id: 1 }));
      const model = createModel({ id: 1, param1: 5 }, injector, ["param1", "param2"]);
      updateDecorator(model, "childModel");
      expect(api.show).toHaveBeenCalledWith(1, 5, undefined);
    });

    it("should handle error", async () => {
      const promise = interceptApiRequest(undefined, generateBawApiError(UNAUTHORIZED));
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
      const promise = interceptApiRequest(undefined, generateBawApiError(UNAUTHORIZED));
      const model = createModel({ id: 1 }, injector, [], true);
      await assertModel(promise, model, "childModel", true as any);
    });

    it("should not raise a failure to the user", fakeAsync(() => {
      interceptApiRequest(undefined, generateBawApiError(UNAUTHORIZED));
      createModel({ id: 1 }, injector, [], false);
      expect(toastSpy.error).not.toHaveBeenCalled();
    }));
  });
});
