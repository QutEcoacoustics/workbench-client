import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { AbstractModel, getUnknownViewUrl } from "@models/AbstractModel";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpectatorRoutingOverrides,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import {
  defaultErrorMsg,
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate,
  FormTemplateOptions as TemplateOptions,
} from "./formTemplate";

class MockModel extends AbstractModel {
  public kind: "MockModel" = "MockModel";

  public get viewUrl(): string {
    return getUnknownViewUrl("MockModel does not have a viewUrl");
  }
  public getJsonAttributes(): any {
    return this;
  }
}

@Component({
  selector: "baw-test-component",
  template: "<div><baw-form></baw-form></div>",
})
class MockComponent extends FormTemplate<MockModel> {
  public constructor(
    protected notifications: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, formTemplateOptions);
  }

  protected apiAction(model: Partial<MockModel>) {
    return new BehaviorSubject<MockModel>(new MockModel(model));
  }
}

const formTemplateOptions: Partial<TemplateOptions<MockModel>> = {};

describe("formTemplate", () => {
  let defaultError: ApiErrorDetails;
  let defaultModel: MockModel;
  let notifications: ToastrService;
  let spec: SpectatorRouting<MockComponent>;
  let successResponse: (model: Partial<MockModel>) => Observable<MockModel>;
  let errorResponse: (model: Partial<MockModel>) => Observable<MockModel>;
  const createComponent = createRoutingFactory({
    component: MockComponent,
    imports: [SharedModule, ...appLibraryImports],
    mocks: [ToastrService],
  });

  function setup(
    componentOptions?: SpectatorRoutingOverrides<MockComponent>,
    templateOptions?: Partial<TemplateOptions<MockModel>>
  ) {
    // Set new formTemplateOptions without losing reference
    for (const key of Object.keys(formTemplateOptions)) {
      delete formTemplateOptions[key];
    }
    Object.assign(formTemplateOptions, templateOptions);
    spec = createComponent(componentOptions);

    notifications = spec.inject(ToastrService);
  }

  function makeResolvedModel(
    model?: AbstractModel | AbstractModel[],
    error?: ApiErrorDetails
  ): ResolvedModel {
    return model ? { model } : { error };
  }

  function createResolvers(resolvers: string[], models: ResolvedModel[]) {
    const routeData = { data: { resolvers: {} } };
    resolvers.forEach((resolver, index) => {
      routeData.data.resolvers[resolver] = `${resolver}Resolver`;
      routeData.data[resolver] = models[index];
    });
    return routeData;
  }

  function stubFormResets() {
    spyOn(spec.component, "resetForms").and.stub();
  }

  function submitForm(data: any) {
    spec.component.submit(data);
  }

  function interceptApiAction(fakeFunc: jasmine.Func) {
    spec.component["apiAction"] = jasmine.createSpy().and.callFake(fakeFunc);
  }

  beforeEach(() => {
    defaultError = generateApiErrorDetails();
    defaultModel = new MockModel({ id: 1 });
    successResponse = (model) =>
      new BehaviorSubject<MockModel>(new MockModel(model));
    errorResponse = () => {
      const subject = new Subject<MockModel>();
      subject.error(defaultError);
      return subject;
    };
  });

  describe("resolvers", () => {
    it("should not set failure flag if no resolvers", () => {
      setup();
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
    });

    it("should not set failure flag if empty list of resolvers", () => {
      setup(createResolvers([], []));
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
    });

    it("should not set failure flag if single successful resolver", () => {
      setup(createResolvers(["mockModel"], [makeResolvedModel(defaultModel)]));
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
    });

    it("should not set failure flag if multiple successful", () => {
      setup(
        createResolvers(
          ["mockModel", "mockModels"],
          [makeResolvedModel(defaultModel), makeResolvedModel([defaultModel])]
        )
      );
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
    });

    it("should set failure flag if single resolver fails", () => {
      setup(
        createResolvers(
          ["mockModel"],
          [makeResolvedModel(undefined, defaultError)]
        )
      );
      spec.detectChanges();
      expect(spec.component.failure).toBeTruthy();
    });

    it("should set failure flag if resolver fails in list", () => {
      setup(
        createResolvers(
          ["mockModel", "mockModels"],
          [
            makeResolvedModel(defaultModel),
            makeResolvedModel(undefined, defaultError),
          ]
        )
      );
      spec.detectChanges();
      expect(spec.component.failure).toBeTruthy();
    });
  });

  describe("getModel", () => {
    it("should handle no getModel function", () => {
      setup();
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
      expect(spec.component.model).toEqual({} as MockModel);
    });

    it("should use getModel function to retrieve model from single resolved model", () => {
      setup(createResolvers(["mockModel"], [makeResolvedModel(defaultModel)]), {
        getModel: (models) => models["mockModel"] as MockModel,
      });
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
      expect(spec.component.model).toBe(defaultModel);
    });

    it("should use getModel function to retrieve model from multiple resolved models", () => {
      setup(
        createResolvers(
          ["mockModels", "mockModel"],
          [makeResolvedModel([defaultModel]), makeResolvedModel(defaultModel)]
        ),
        { getModel: (models) => models["mockModel"] as MockModel }
      );
      spec.detectChanges();
      expect(spec.component.failure).toBeFalsy();
      expect(spec.component.model).toBe(defaultModel);
    });

    it("should set failure flag if failure to find model", () => {
      setup(
        createResolvers(["mockModels"], [makeResolvedModel(defaultModel)]),
        { getModel: (models) => models["unknownModel"] as MockModel }
      );
      spec.detectChanges();
      expect(spec.component.failure).toBeTruthy();
    });
  });

  describe("hasFormCheck", () => {
    function modifyForm() {
      spec.component.appForms.first.form.markAsDirty();
    }

    function isFormTouched(isTouched: boolean) {
      expect(spec.component.isFormTouched()).toBe(isTouched);
    }

    it("should extend WithFormCheck", () => {
      setup();
      spec.detectChanges();
      expect(spec.component.isFormTouched).toBeTruthy();
      expect(spec.component.resetForms).toBeTruthy();
    });

    it("should default to having form checks enabled", () => {
      setup();
      expect(spec.component["opts"].hasFormCheck).toBeTrue();
    });

    it("should have isFormTouched when hasFormCheck is true", () => {
      setup();
      spec.detectChanges();
      modifyForm();
      spec.detectChanges();
      isFormTouched(true);
    });

    it("should disable isFormTouched when hasFormCheck is false", () => {
      setup(undefined, { hasFormCheck: false });
      spec.detectChanges();
      modifyForm();
      spec.detectChanges();
      isFormTouched(false);
    });

    it("should have resetForms when hasFormCheck is true", () => {
      setup();
      spec.detectChanges();
      const form = spec.component.appForms.first.form;
      const spy = spyOn(form, "markAsPristine");
      spec.detectChanges();
      spec.component.resetForms();
      expect(spy).toHaveBeenCalled();
    });

    it("should disable resetForms when hasFormCheck is false", () => {
      setup(undefined, { hasFormCheck: false });
      spec.detectChanges();
      const form = spec.component.appForms.first.form;
      const spy = spyOn(form, "markAsPristine");
      spec.detectChanges();
      spec.component.resetForms();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("submit", () => {
    it("should call apiAction on submit", () => {
      setup();
      stubFormResets();
      interceptApiAction(successResponse);
      spec.detectChanges();
      submitForm({ id: 1 });
      expect(spec.component["apiAction"]).toHaveBeenCalled();
    });

    it("should reset form on successful submission", () => {
      setup();
      stubFormResets();
      spec.detectChanges();
      submitForm({ id: 1 });
      expect(spec.component.resetForms).toHaveBeenCalled();
    });

    it("should not reset form on failed submission", () => {
      setup();
      stubFormResets();
      interceptApiAction(errorResponse);
      spec.detectChanges();
      submitForm({ id: 1 });
      expect(spec.component.resetForms).not.toHaveBeenCalled();
    });

    it("should call onSuccess on successful submission", (done) => {
      const modelData = { id: 1 };
      setup(undefined, {
        onSuccess: (model) => {
          expect(model).toEqual(new MockModel(modelData));
          done();
        },
      });
      stubFormResets();
      spec.detectChanges();
      submitForm(modelData);
    });

    it("should call redirectUser on successful submission", (done) => {
      const modelData = { id: 1 };
      setup(undefined, {
        redirectUser: (model) => {
          expect(model).toEqual(new MockModel(modelData));
          done();
        },
      });
      stubFormResets();
      spec.detectChanges();
      submitForm(modelData);
    });
  });

  describe("successMessage", () => {
    function assertSuccessMessage(msg: string) {
      expect(spec.component["successMessage"]).toBe(msg);
    }

    it("should handle update form success message", () => {
      setup(createResolvers(["mockModel"], [makeResolvedModel(defaultModel)]), {
        getModel: (models) => models["mockModel"] as MockModel,
        successMsg: (model) => "custom success message with id: " + model.id,
      });
      stubFormResets();
      spec.detectChanges();

      // ID should not match the output because the success
      // message is calculated with the original model
      submitForm({ id: 5 });
      assertSuccessMessage("custom success message with id: 1");
    });

    it("should handle new form success message", () => {
      setup(undefined, {
        successMsg: (model) => "custom success message with id: " + model.id,
      });
      stubFormResets();
      spec.detectChanges();

      submitForm({ id: 1 });
      assertSuccessMessage("custom success message with id: 1");
    });
  });

  describe("notifications", () => {
    function assertNotification(type: keyof ToastrService, msg: string) {
      expect(notifications[type]).toHaveBeenCalledWith(msg);
    }

    it("should display default success notification on successful submission", () => {
      setup();
      stubFormResets();
      spec.detectChanges();
      submitForm({ id: 1 });
      assertNotification("success", defaultSuccessMsg("updated", "model"));
    });

    it("should display success notification on successful submission", () => {
      const modelData = { id: 1 };
      const successMsg = (model: MockModel) =>
        "custom success message with id: " + model.id;
      setup(undefined, { successMsg });
      stubFormResets();
      spec.detectChanges();
      submitForm(modelData);
      assertNotification("success", successMsg(new MockModel(modelData)));
    });

    it("should display default failure notification on failed submission", () => {
      setup();
      stubFormResets();
      interceptApiAction(errorResponse);
      spec.detectChanges();

      submitForm({ id: 1 });
      assertNotification("error", defaultErrorMsg(defaultError));
    });

    it("should display failure notification on failed submission", () => {
      const failureMsg = (err: ApiErrorDetails) =>
        "custom failure message with message: " + err.message;
      setup(undefined, { failureMsg });
      stubFormResets();
      interceptApiAction(errorResponse);
      spec.detectChanges();

      submitForm({ id: 1 });
      assertNotification("error", failureMsg(defaultError));
    });
  });

  describe("loading", () => {
    beforeEach(() => setup());

    function assertLoading(loading: boolean = true) {
      if (loading) {
        expect(spec.component.loading).toBeTruthy();
      } else {
        expect(spec.component.loading).toBeFalsy();
      }
    }

    it("should be false initially", () => {
      spec.detectChanges();
      assertLoading(false);
    });

    it("should be set true on submit", () => {
      interceptApiAction(() => new Subject<MockModel>());
      spec.detectChanges();
      submitForm({ id: 1 });
      assertLoading();
    });

    it("should be set false on successful submission", () => {
      interceptApiAction(successResponse);
      spec.detectChanges();
      submitForm({ id: 1 });
      assertLoading(false);
    });

    it("should be set false on failed submit", () => {
      interceptApiAction(errorResponse);
      spec.detectChanges();
      submitForm({ id: 1 });
      assertLoading(false);
    });
  });
});

describe("defaultSuccessMsg", () => {
  it("should handle model name", () => {
    expect(defaultSuccessMsg("created", "custom name")).toBe(
      "Successfully created custom name"
    );
  });

  it("should handle created action", () => {
    expect(defaultSuccessMsg("created", "name")).toBe(
      "Successfully created name"
    );
  });

  it("should handle updated action", () => {
    expect(defaultSuccessMsg("updated", "name")).toBe(
      "Successfully updated name"
    );
  });

  it("should handle destroyed action", () => {
    expect(defaultSuccessMsg("destroyed", "name")).toBe(
      "Successfully destroyed name"
    );
  });
});

describe("defaultErrorMsg", () => {
  it("should return error message", () => {
    const apiError = generateApiErrorDetails("Bad Request", {
      message: "Custom Message",
    });

    expect(defaultErrorMsg(apiError)).toBe("Custom Message");
  });
});

describe("extendedErrorMsg", () => {
  it("should return error message", () => {
    const apiError = generateApiErrorDetails("Bad Request", {
      message: "Custom Message",
    });

    expect(extendedErrorMsg(apiError, {})).toBe("Custom Message");
  });

  it("should return error message with single info field", () => {
    const apiError = generateApiErrorDetails("Bad Request", {
      message: "Custom Message",
      info: { name: "this name already exists" },
    });

    expect(
      extendedErrorMsg(apiError, {
        name: (value) => "custom message: " + value,
      })
    ).toBe("Custom Message<br />custom message: this name already exists");
  });

  it("should return error message with multiple info fields", () => {
    const apiError = generateApiErrorDetails("Bad Request", {
      message: "Custom Message",
      info: { name: "this name already exists", foo: "bar" },
    });

    expect(
      extendedErrorMsg(apiError, {
        name: () => "custom message",
        foo: (value) => value,
      })
    ).toBe("Custom Message<br />custom message<br />bar");
  });
});
