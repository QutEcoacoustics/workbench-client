import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { MOCK, MockStandardApiService } from "@baw-api/mock/apiMocks.service";
import { MockModel as AssociatedModel } from "@baw-api/mock/baseApiMock.service";
import { MockDirectivesModule } from "@directives/directives.mock.module";
import { MockModelWithDecorators as MockModel } from "@models/AssociationLoadingInComponents.spec";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { CheckboxModule } from "@shared/checkbox/checkbox.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { interceptShowApiRequest, nStepObservable, viewports } from "@test/helpers/general";
import { Subject } from "rxjs";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Id } from "@interfaces/apiInterfaces";
import { DetailViewComponent } from "./detail-view.component";
import { ModelLinkComponent } from "./model-link/model-link.component";
import { RenderFieldComponent } from "./render-field/render-field.component";

describe("DetailViewComponent", () => {
  let injector: AssociationInjector;
  let api: MockStandardApiService;
  let spec: Spectator<DetailViewComponent>;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    declarations: [RenderFieldComponent, ModelLinkComponent],
    imports: [
      CheckboxModule,
      MockDirectivesModule,
      LoadingModule,
      MockBawApiModule,
      MockBawApiModule,
      RouterTestingModule,
      PipesModule,
    ],
    providers: [MockStandardApiService, { provide: MOCK.token, useExisting: MockStandardApiService }],
  });

  function getWrapper() {
    return spec.query<HTMLDivElement>("div");
  }

  function getFields() {
    return spec.queryAll<HTMLDataElement>("dt");
  }

  function getValues() {
    return spec.queryAll<HTMLDListElement>("dl");
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });

    api = spec.inject(MockStandardApiService);
    injector = spec.inject(ASSOCIATION_INJECTOR);

    spec.detectChanges();
  });

  afterAll(() => {
    viewport.reset();
  });

  describe("fields", () => {
    it("should handle missing fields", () => {
      spec.detectChanges();
      expect(getFields().length).toBe(0);
    });

    it("should handle empty fields", () => {
      spec.setInput({ fields: [] });
      spec.detectChanges();
      expect(getFields().length).toBe(0);
    });

    describe("single field", () => {
      beforeEach(() => {
        spec.setInput({
          fields: [{ key: "id", props: { label: "custom label" } }],
          model: new MockModel({ id: 0 }),
        });
        spec.detectChanges();
      });

      it("should handle single field", () => {
        expect(getFields().length).toBe(1);
      });

      it("should handle single value", () => {
        expect(getValues().length).toBe(1);
      });

      it("should create field", () => {
        expect(getFields()[0]).toHaveExactText("custom label");
      });

      it("should create value", () => {
        expect(getValues()[0]).toHaveExactText("0");
      });
    });

    describe("multiple fields", () => {
      beforeEach(() => {
        spec.setInput({
          fields: [
            {
              key: "id",
              props: { label: "custom label 0" },
            },
            {
              key: "text",
              props: { label: "custom label 1" },
            },
            {
              key: "object",
              props: { label: "custom label 2" },
            },
          ],
          model: new MockModel({
            id: 5,
            text: "10",
            object: { test: "value" },
          }),
        });
        spec.detectChanges();
      });

      it("should handle multiple fields", () => {
        expect(getFields().length).toBe(3);
      });

      it("should handle multiple values", () => {
        expect(getValues().length).toBe(3);
      });

      it("should create fields", () => {
        const fields = getFields();
        expect(fields[0]).toHaveExactText("custom label 0");
        expect(fields[1]).toHaveExactText("custom label 1");
        expect(fields[2]).toHaveExactText("custom label 2");
      });

      it("should create values", () => {
        const values = getValues();
        expect(values[0]).toHaveExactText("5");
        expect(values[1]).toHaveExactText("10");
        expect(values[2].innerText).toContain(JSON.stringify({ test: "value" }, null, 4));
      });
    });

    describe("abstract models", () => {
      function setupComponent(key: string) {
        spec.setInput({
          fields: [{ key, props: { label: "custom label" } }],
          model: new MockModel({ id: 0, ids: [1, 2] }, injector),
        });
        spec.detectChanges();
      }

      it("should handle hasOne unresolved model", () => {
        setupComponent("childModel");
        expect(getFields().length).toBe(1);
        expect(getValues().length).toBe(1);
      });

      it("should display hasOne unresolved model", () => {
        setupComponent("childModel");
        expect(getValues()[0]).toHaveExactText("(loading)");
      });

      it("should handle hasOne associated model", async () => {
        const subject = new Subject<AssociatedModel>();
        const promise = nStepObservable(subject, () => new AssociatedModel({ id: 1 }));
        spyOn(api, "show").and.callFake(() => subject);

        setupComponent("childModel");
        await promise;
        spec.detectChanges();

        expect(getValues()[0]).toHaveExactText("Mock Model: 1");
      });

      it("should handle hasMany unresolved model", () => {
        setupComponent("childModels");
        expect(getFields().length).toBe(1);
        expect(getValues().length).toBe(1);
      });

      it("should display hasMany unresolved model", () => {
        setupComponent("childModels");
        expect(getValues()[0]).toHaveExactText("(no value)");
      });

      it("should handle hasMany associated model", async () => {
        const mockApiResponses = new Map<Id, AssociatedModel>([
          [1, new AssociatedModel({ id: 1 })],
          [2, new AssociatedModel({ id: 2 })],
        ]);

        api.show = jasmine.createSpy("show");

        const response = interceptShowApiRequest(
          api as any,
          injector,
          (id: Id) => mockApiResponses.get(id),
          AssociatedModel,
        );

        setupComponent("childModels");
        spec.detectChanges();
        await response;
        spec.detectChanges();

        const values = getValues();
        expect(values.length).toBe(2);
        expect(values[0]).toHaveExactText("Mock Model: 1");
        // expect(values[1]).toHaveExactText("Mock Model: 2");
      });
    });
  });

  describe("screen size", () => {
    beforeEach(() => {
      spec.setInput({
        fields: [{ key: "id", props: { label: "custom label" } }],
        model: new MockModel({ id: 0 }),
      });
      spec.detectChanges();
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
      expect(getFields()[0]).toHaveComputedStyle({ textAlign: "right" });
    });

    it("should left align field on smallest screen", () => {
      viewport.set(viewports.extraSmall);
      expect(getFields()[0]).toHaveComputedStyle({ textAlign: "left" });
    });
  });
});
