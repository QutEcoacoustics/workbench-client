import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Component, Injector, Input } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as AssociatedModel } from "@baw-api/mock/baseApiMock.service";
import { Id } from "@interfaces/apiInterfaces";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { nStepObservable } from "@test/helpers/general";
import { Subject } from "rxjs";
import { AbstractModel, UnresolvedModel } from "./AbstractModel";
import { HasMany, HasOne } from "./AssociationDecorators";

class MockModel extends AbstractModel {
  public id: Id;
  @HasOne<MockModel>(MOCK, "id")
  public readonly childModel: AssociatedModel;
  @HasMany<MockModel>(MOCK, "id")
  public readonly childModels: AssociatedModel[];

  constructor(opts: any, injector?: Injector) {
    super(opts, injector);
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
  public toJSON(): object {
    throw new Error("Method not implemented.");
  }
}

@Component({
  selector: "app-test",
  template: `
    <ng-container *ngIf="hasMany && model.childModels">
      <li *ngFor="let item of model.childModels">
        {{ item }}
      </li>
    </ng-container>
    <ng-container *ngIf="!hasMany && model.childModel">
      <p>{{ model.childModel }}</p>
    </ng-container>
    <ng-container
      *ngIf="(hasMany && !model.childModels) || (!hasMany && !model.childModel)"
    >
      <p>Error</p>
    </ng-container>
  `,
})
class MockComponent {
  @Input() public model: MockModel;
  @Input() public hasMany: boolean;
}

describe("Association Decorators Loading In Components", () => {
  let api: MockStandardApiService;
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let injector: Injector;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [HttpClientTestingModule, MockBawApiModule],
      providers: [
        MockStandardApiService,
        { provide: MOCK.token, useExisting: MockStandardApiService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    api = TestBed.inject(MockStandardApiService);
    injector = TestBed.inject(Injector);
    component = fixture.componentInstance;
  });

  function interceptSingleModel(
    model: AssociatedModel,
    error?: ApiErrorDetails
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
    error: ApiErrorDetails,
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

  function assertOutput(model?: AbstractModel | AbstractModel[]) {
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
      generateApiErrorDetails("Not Found")
    );
    component.model = new MockModel({ id: 0 }, injector);
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays error
    assertOutput(); // hasOne error returns null
  });

  it("should display hasMany unresolved model", () => {
    component.model = new MockModel({ id: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModels
    fixture.detectChanges(); // Displays childModels
    assertOutput(UnresolvedModel.many);
  });

  it("should display empty hasMany resolved model", async () => {
    const associatedModels = [];
    const promise = interceptMultipleModels(undefined, associatedModels);
    component.model = new MockModel({ id: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput(associatedModels);
  });

  it("should display single hasMany resolved model", async () => {
    const associatedModels = [new AssociatedModel({ id: 1 })];
    const promise = interceptMultipleModels(undefined, associatedModels);
    component.model = new MockModel({ id: 0 }, injector);
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
    component.model = new MockModel({ id: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput(associatedModels);
  });

  it("should display hasMany multiple responses", async () => {
    const associatedModels = [
      [new AssociatedModel({ id: 1 })],
      [new AssociatedModel({ id: 2 })],
      [new AssociatedModel({ id: 3 })],
    ];
    const promise = interceptMultipleModels(undefined, ...associatedModels);
    component.model = new MockModel({ id: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays childModel
    assertOutput([
      new AssociatedModel({ id: 1 }),
      new AssociatedModel({ id: 2 }),
      new AssociatedModel({ id: 3 }),
    ]);
  });

  it("should display hasMany error", async () => {
    const promise = interceptMultipleModels(
      generateApiErrorDetails("Not Found")
    );
    component.model = new MockModel({ id: 0 }, injector);
    component.hasMany = true;
    fixture.detectChanges(); // Load childModel
    await promise;
    fixture.detectChanges(); // Displays error
    assertOutput([]); // hasMany error returns an array
  });
});
