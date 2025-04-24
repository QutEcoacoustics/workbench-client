import { Component, Input } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as AssociatedModel } from "@baw-api/mock/baseApiMock.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Id, Ids } from "@interfaces/apiInterfaces";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { nStepObservable } from "@test/helpers/general";
import { NOT_FOUND } from "http-status";
import { Subject } from "rxjs";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { hasMany, hasOne } from "./AssociationDecorators";
import { AssociationInjector } from "./ImplementsInjector";

class MockModel extends AbstractModel {
  public id: Id;
  public ids: Ids;
  @hasOne<MockModel, AbstractModel>(MOCK, "id")
  public readonly childModel: AssociatedModel;
  @hasMany<MockModel, AbstractModel>(MOCK, "ids")
  public readonly childModels: AssociatedModel[];

  public constructor(opts: any, injector?: AssociationInjector) {
    super(opts, injector);
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }

  public override getJsonAttributesForCreate(): any {
    throw new Error("Method not implemented.");
  }

  public override getJsonAttributesForUpdate(): any {
    throw new Error("Method not implemented.");
  }
}

export { MockModel as MockModelWithDecorators };

@Component({
  selector: "baw-test",
  template: `
    @if (hasMany && model.childModels) {
      @for (item of model.childModels; track item) {
        <li>{{ item }}</li>
      }
    }

    @if (!hasMany && model.childModel) {
      <p>{{ model.childModel }}</p>
    }

    @if ((hasMany && !model.childModels) || (!hasMany && !model.childModel)) {
      <p>Error</p>
    }
  `,
  providers: [provideMockBawApi()],
})
class MockComponent {
  @Input() public model: MockModel;
  @Input() public hasMany: boolean;
}

describe("Association Decorators Loading In Components", () => {
  let api: MockStandardApiService;
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let injector: AssociationInjector;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [MockComponent],
    providers: [
        MockStandardApiService,
        provideMockBawApi(),
        { provide: MOCK.token, useExisting: MockStandardApiService },
    ],
}).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    api = TestBed.inject(MockStandardApiService);
    injector = TestBed.inject(ASSOCIATION_INJECTOR);
    component = fixture.componentInstance;
  });

  function interceptSingleModel(
    model: AssociatedModel,
    error?: BawApiError
  ): Promise<void> {
    const subject = new Subject<AssociatedModel>();
    const promise = nStepObservable(
      subject,
      () => (model ? model : error),
      !model
    );
    spyOn(api, "show").and.callFake(() => subject);
    return promise;
  }

  function interceptMultipleModels(
    error: BawApiError,
    ...models: Array<Array<AssociatedModel>>
  ): Promise<any> {
    const subject = new Subject<AssociatedModel[]>();
    const promise = Promise.all(
      models.map((model) =>
        nStepObservable(subject, () => (model ? model : error), !model)
      )
    );
    spyOn(api, "filter").and.callFake(() => subject);
    return promise;
  }

  function assertOutput(
    model?: Readonly<AbstractModel> | Readonly<AbstractModel[]>
  ) {
    if (model instanceof Array) {
      const listItems = fixture.nativeElement.querySelectorAll("li");

      if (model.length === 0) {
        expect(listItems.length).toBe(0);
      } else {
        listItems.forEach((item, index) => {
          expect(item.innerText.trim()).toBe(model[index].toString());
        });
      }
    } else if (model instanceof AbstractModel) {
      expect(fixture.nativeElement.querySelector("p").innerText.trim()).toBe(
        model.toString()
      );
    } else {
      expect(fixture.nativeElement.querySelector("p").innerText.trim()).toBe(
        "Error"
      );
    }
  }

  it("should display hasOne unresolved model", () => {
    component.model = new MockModel({ id: 0 }, injector);
    fixture.detectChanges(); // Load childModel
    fixture.detectChanges(); // Displays childModel
    assertOutput(UnresolvedModel.one);
  });

  it("should display hasOne resolved model", async () => {
    const associatedModel = new AssociatedModel({ id: 1 });
    const promise = interceptSingleModel(associatedModel);
    component.model = new MockModel({ id: 0 }, injector);
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput(associatedModel);
  });

  it("should display hasOne error", async () => {
    const promise = interceptSingleModel(
      undefined,
      generateBawApiError(NOT_FOUND)
    );
    component.model = new MockModel({ id: 0 }, injector);
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays error
    assertOutput(); // hasOne error returns null
  });

  it("should display hasMany unresolved model", () => {
    component.model = new MockModel({ id: 0, ids: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModels
    fixture.detectChanges(); // Displays childModels
    assertOutput(UnresolvedModel.many);
  });

  it("should display empty hasMany resolved model", async () => {
    const associatedModels = [];
    const promise = interceptMultipleModels(undefined, associatedModels);
    component.model = new MockModel({ id: 0, ids: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput(associatedModels);
  });

  it("should display single hasMany resolved model", async () => {
    const associatedModels = [new AssociatedModel({ id: 1 })];
    const promise = interceptMultipleModels(undefined, associatedModels);
    component.model = new MockModel({ id: 0, ids: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput(associatedModels);
  });

  it("should display many hasMany resolved model", async () => {
    const associatedModels = [
      new AssociatedModel({ id: 1 }),
      new AssociatedModel({ id: 2 }),
      new AssociatedModel({ id: 3 }),
    ];
    const promise = interceptMultipleModels(undefined, associatedModels);
    component.model = new MockModel({ id: 0, ids: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput(associatedModels);
  });

  it("should display hasMany error", async () => {
    const promise = interceptMultipleModels(generateBawApiError(NOT_FOUND));
    component.model = new MockModel({ id: 0, ids: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays error
    assertOutput([]); // hasMany error returns an array
  });
});
