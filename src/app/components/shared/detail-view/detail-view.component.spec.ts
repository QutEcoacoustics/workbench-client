import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as AssociatedModel } from "@baw-api/mock/baseApiMock.service";
import { MockModelWithDecorators as MockModel } from "@models/AssociationLoadingInComponents.spec";
import { nStepObservable, viewports } from "@test/helpers/general";
import { Subject } from "rxjs";
import { DetailViewComponent } from "./detail-view.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

describe("DetailViewComponent", () => {
  let api: MockStandardApiService;
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;
  let injector: Injector;

  function getWrapper() {
    return (fixture.nativeElement as HTMLElement).querySelector("div");
  }

  function getFields() {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dt");
  }

  function getValues() {
    return (fixture.nativeElement as HTMLElement).querySelectorAll("dl");
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailViewComponent, RenderFieldComponent],
      imports: [HttpClientTestingModule, MockBawApiModule],
      providers: [
        MockStandardApiService,
        { provide: MOCK.token, useExisting: MockStandardApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailViewComponent);
    api = TestBed.inject(MockStandardApiService);
    injector = TestBed.inject(Injector);
    component = fixture.componentInstance;
  });

  afterAll(() => {
    viewport.reset();
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("fields", () => {
    it("should handle missing fields", () => {
      fixture.detectChanges();
      expect(getFields().length).toBe(0);
    });

    it("should handle empty fields", () => {
      component.fields = [];
      fixture.detectChanges();
      expect(getFields().length).toBe(0);
    });

    describe("single field", () => {
      beforeEach(() => {
        component.fields = [
          {
            key: "id",
            templateOptions: {
              label: "custom label",
            },
          },
        ];
        component.model = new MockModel({ id: 0 });
        fixture.detectChanges();
      });

      it("should handle single field", () => {
        expect(getFields().length).toBe(1);
      });

      it("should handle single value", () => {
        expect(getValues().length).toBe(1);
      });

      it("should create field", () => {
        const fields = getFields();
        expect(fields[0].innerText.trim()).toBe("custom label");
      });

      it("should create value", () => {
        const values = getValues();
        expect(values[0].innerText.trim()).toBe("0");
      });
    });

    describe("multiple fields", () => {
      beforeEach(() => {
        component.fields = [
          {
            key: "id",
            templateOptions: {
              label: "custom label 0",
            },
          },
          {
            key: "text",
            templateOptions: {
              label: "custom label 1",
            },
          },
          {
            key: "object",
            templateOptions: {
              label: "custom label 2",
            },
          },
        ];
        component.model = new MockModel({
          id: 5,
          text: "10",
          object: { test: "value" },
        });
        fixture.detectChanges();
      });

      it("should handle multiple fields", () => {
        expect(getFields().length).toBe(3);
      });

      it("should handle multiple values", () => {
        expect(getValues().length).toBe(3);
      });

      it("should create fields", () => {
        const fields = getFields();
        expect(fields[0].innerText.trim()).toBe("custom label 0");
        expect(fields[1].innerText.trim()).toBe("custom label 1");
        expect(fields[2].innerText.trim()).toBe("custom label 2");
      });

      it("should create values", () => {
        const values = getValues();
        expect(values[0].innerText.trim()).toBe("5");
        expect(values[1].innerText.trim()).toBe("10");
        expect(values[2].innerText.trim()).toBe('{"test":"value"}');
      });
    });

    describe("abstract models", () => {
      function setupComponent(key: string) {
        component.fields = [
          {
            key,
            templateOptions: { label: "custom label" },
          },
        ];
        component.model = new MockModel({ id: 0, ids: 0 }, injector);
        fixture.detectChanges();
      }

      it("should handle hasOne unresolved model", () => {
        setupComponent("childModel");
        expect(getFields().length).toBe(1);
        expect(getValues().length).toBe(1);
      });

      it("should display hasOne unresolved model", () => {
        setupComponent("childModel");
        const value = getValues()[0];
        expect(value.innerText.trim()).toBe("(loading)");
      });

      it("should handle hasOne associated model", async () => {
        const subject = new Subject<AssociatedModel>();
        const promise = nStepObservable(
          subject,
          () => new AssociatedModel({ id: 1 })
        );
        spyOn(api, "show").and.callFake(() => subject);

        setupComponent("childModel");
        await promise;
        fixture.detectChanges();

        const value = getValues()[0];
        expect(value.innerText.trim()).toBe("Mock Model: 1");
      });

      it("should handle hasMany unresolved model", () => {
        setupComponent("childModels");
        expect(getFields().length).toBe(1);
        expect(getValues().length).toBe(1);
      });

      it("should display hasMany unresolved model", () => {
        setupComponent("childModels");
        const value = getValues()[0];
        expect(value.innerText.trim()).toBe("(no value)");
      });

      it("should handle hasMany associated model", async () => {
        const subject = new Subject<AssociatedModel[]>();
        const promise = nStepObservable(subject, () => [
          new AssociatedModel({ id: 1 }),
          new AssociatedModel({ id: 2 }),
        ]);
        spyOn(api, "filter").and.callFake(() => subject);

        setupComponent("childModels");
        await promise;
        fixture.detectChanges();

        const values = getValues();
        expect(values.length).toBe(2);
        expect(values[0].innerText.trim()).toBe("Mock Model: 1");
        expect(values[1].innerText.trim()).toBe("Mock Model: 2");
      });
    });
  });

  describe("screen size", () => {
    beforeEach(() => {
      component.fields = [
        {
          key: "id",
          templateOptions: {
            label: "custom label",
          },
        },
      ];
      component.model = new MockModel({ id: 0 });
      fixture.detectChanges();
    });

    it("should inline field and value on small screen", () => {
      const parentEl = getWrapper();
      const leftCol = parentEl.firstElementChild;
      const rightCol = parentEl.lastElementChild;

      expect(parentEl).toHaveClass("row");
      expect(leftCol).toHaveClass("col-sm-3");
      expect(rightCol).toHaveClass("col-sm-9");
    });

    it("should right align field on small screen", () => {
      viewport.set(viewports.small);
      const fieldStyle = window.getComputedStyle(getFields()[0]);
      expect(fieldStyle.textAlign).toBe("right");
    });

    it("should left align field on smallest screen", () => {
      viewport.set(viewports.extraSmall);
      const fieldStyle = window.getComputedStyle(getFields()[0]);
      expect(fieldStyle.textAlign).toBe("left");
    });
  });
});
