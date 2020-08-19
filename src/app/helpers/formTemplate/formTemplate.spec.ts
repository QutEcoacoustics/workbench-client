import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { AbstractModel } from "@models/AbstractModel";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import {
  mockActivatedRoute,
  MockData,
  MockResolvers,
} from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import {
  defaultErrorMsg,
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate,
} from "./formTemplate";

class MockModel extends AbstractModel {
  public kind: "MockModel" = "MockModel";

  public get viewUrl(): string {
    return "";
  }
  public toJSON(): object {
    return this;
  }
}

@Component({
  selector: "app-test-component",
  template: `<div><baw-form></baw-form></div>`,
})
class MockComponent extends FormTemplate<MockModel> {
  constructor(
    protected notifications: ToastrService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, undefined);
  }

  protected apiAction(model: Partial<MockModel>) {
    return new BehaviorSubject<MockModel>(new MockModel(model));
  }
}

describe("formTemplate", () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let defaultError: ApiErrorDetails;
  let defaultModel: MockModel;
  let notifications: ToastrService;
  let router: Router;
  let successResponse: (model: Partial<MockModel>) => Observable<MockModel>;
  let errorResponse: (model: Partial<MockModel>) => Observable<MockModel>;

  function configureTestingModule(
    resolvers?: MockResolvers,
    data: MockData = {}
  ) {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [SharedModule, RouterTestingModule, ...appLibraryImports],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(resolvers, data),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    notifications = TestBed.inject(ToastrService);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;

    spyOn(notifications, "success").and.stub();
    spyOn(notifications, "error").and.stub();
    spyOn(router, "navigateByUrl").and.stub();
  }

  function makeResolvedModel(
    model?: AbstractModel | AbstractModel[],
    error?: ApiErrorDetails
  ): ResolvedModel {
    return model ? { model } : { error };
  }

  beforeEach(() => {
    defaultError = generateApiErrorDetails();
    defaultModel = new MockModel({ id: 1 });
    successResponse = (model) => {
      return new BehaviorSubject<MockModel>(new MockModel(model));
    };
    errorResponse = () => {
      const subject = new Subject<MockModel>();
      subject.error(defaultError);
      return subject;
    };
  });

  describe("resolvers", () => {
    it("should handle no resolvers", () => {
      configureTestingModule();
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
    });

    it("should handle empty resolvers", () => {
      configureTestingModule({});
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
    });

    it("should handle single resolver", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver" },
        { mockModel: makeResolvedModel(defaultModel) }
      );
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
    });

    it("should handle multiple resolvers", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver", mockModels: "MockModelsResolver" },
        {
          mockModel: makeResolvedModel(defaultModel),
          mockModels: makeResolvedModel([defaultModel]),
        }
      );
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
    });

    it("should handle single resolver failure", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver" },
        { mockModel: makeResolvedModel(undefined, defaultError) }
      );
      fixture.detectChanges();

      expect(component.failure).toBeTruthy();
    });

    it("should handle any resolver failure", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver", mockModels: "MockModelsResolver" },
        {
          mockModel: makeResolvedModel(defaultModel),
          mockModels: makeResolvedModel(undefined, defaultError),
        }
      );
      fixture.detectChanges();

      expect(component.failure).toBeTruthy();
    });
  });

  describe("modelKey", () => {
    it("should handle undefined modelKey", () => {
      configureTestingModule();
      component["modelKey"] = undefined;
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
      expect(component.model).toEqual({} as MockModel);
    });

    it("should find model with single resolver", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver" },
        { mockModel: makeResolvedModel(defaultModel) }
      );
      component["modelKey"] = "mockModel";
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
      expect(component.model).toBe(defaultModel);
    });

    it("should find model with multiple resolvers", () => {
      configureTestingModule(
        { mockModels: "MockModelsResolver", mockModel: "MockModelResolver" },
        {
          mockModels: makeResolvedModel([defaultModel]),
          mockModel: makeResolvedModel(defaultModel),
        }
      );
      component["modelKey"] = "mockModel";
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
      expect(component.model).toBe(defaultModel);
    });

    it("should handle failure to find model", () => {
      configureTestingModule(
        { mockModels: "MockModelsResolver" },
        { mockModels: makeResolvedModel([defaultModel]) }
      );
      component["modelKey"] = "mockModel";
      fixture.detectChanges();

      expect(component.failure).toBeTruthy();
    });

    it("should handle failure to find resolver", () => {
      configureTestingModule({ mockModel: "MockModelsResolver" });
      component["modelKey"] = "mockModel";
      fixture.detectChanges();

      expect(component.failure).toBeTruthy();
    });
  });

  describe("hasFormCheck", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should extend WithFormCheck", () => {
      fixture.detectChanges();

      expect(component.isFormTouched).toBeTruthy();
      expect(component.resetForms).toBeTruthy();
    });

    it("should have isFormTouched when hasFormCheck is true", () => {
      component["hasFormCheck"] = true;
      fixture.detectChanges();
      component.appForms.first.form.markAsDirty();
      fixture.detectChanges();

      expect(component.isFormTouched()).toBeTruthy();
    });

    it("should disable isFormTouched when hasFormCheck is false", () => {
      component["hasFormCheck"] = false;
      fixture.detectChanges();
      component.appForms.first.form.markAsDirty();
      fixture.detectChanges();

      expect(component.isFormTouched()).toBeFalsy();
    });

    it("should have resetForms when hasFormCheck is true", () => {
      component["hasFormCheck"] = true;
      fixture.detectChanges();
      const spy = spyOn(component.appForms.first.form, "markAsPristine");
      fixture.detectChanges();

      component.resetForms();
      expect(spy).toHaveBeenCalled();
    });

    it("should disable resetForms when hasFormCheck is false", () => {
      component["hasFormCheck"] = false;
      fixture.detectChanges();
      const spy = spyOn(component.appForms.first.form, "markAsPristine");
      fixture.detectChanges();

      component.resetForms();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("submit", () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = jasmine.createSpy();
      configureTestingModule();
      spyOn(component, "resetForms").and.stub();
    });

    it("should call apiAction on submit", () => {
      component["apiAction"] = spy.and.callFake(successResponse);
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(spy).toHaveBeenCalled();
    });

    it("should reset form on successful submission", () => {
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(component.resetForms).toHaveBeenCalled();
    });

    it("should not reset form on failed submission", () => {
      component["apiAction"] = spy.and.callFake(errorResponse);
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(component.resetForms).not.toHaveBeenCalled();
    });

    it("should redirect user on successful submission", () => {
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe("successMessage", () => {
    it("should handle update form success message", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver" },
        { mockModel: makeResolvedModel(defaultModel) }
      );
      spyOn(component, "resetForms").and.stub();
      component["modelKey"] = "mockModel";
      component["successMsg"] = (model) =>
        "custom success message with id: " + model.id;
      fixture.detectChanges();

      // ID should not match the output because the success
      // message is calculated with the original model
      component.submit({ id: 5 });
      expect(component["successMessage"]).toBe(
        "custom success message with id: 1"
      );
    });

    it("should handle new form success message", () => {
      configureTestingModule();
      spyOn(component, "resetForms").and.stub();
      component["successMsg"] = (model) =>
        "custom success message with id: " + model.id;
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(component["successMessage"]).toBe(
        "custom success message with id: 1"
      );
    });
  });

  describe("notifications", () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = jasmine.createSpy();
      configureTestingModule();
      spyOn(component, "resetForms").and.stub();
    });

    it("should display success notification on successful submission", () => {
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(notifications.success).toHaveBeenCalled();
    });

    it("should display success message on successful submission", () => {
      component["successMsg"] = (model) =>
        "custom success message with id: " + model.id;
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(notifications.success).toHaveBeenCalledWith(
        "custom success message with id: 1"
      );
    });

    it("should display error notification on failed submission", () => {
      component["apiAction"] = spy.and.callFake(errorResponse);
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(notifications.error).toHaveBeenCalled();
    });

    it("should display error message on failed submission", () => {
      component["apiAction"] = spy.and.callFake(errorResponse);
      component["errorMsg"] = (err) => "custom error message: " + err.message;
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(notifications.error).toHaveBeenCalledWith(
        "custom error message: " + defaultError.message
      );
    });
  });

  describe("loading", () => {
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = jasmine.createSpy();
      configureTestingModule();
    });

    it("should be false initially", () => {
      fixture.detectChanges();

      expect(component.loading).toBeFalsy();
    });

    it("should be set true on submit", () => {
      component["apiAction"] = spy.and.callFake(() => new Subject<MockModel>());
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(component.loading).toBeTruthy();
    });

    it("should be set false on successful submission", () => {
      component["apiAction"] = spy.and.callFake(successResponse);
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(component.loading).toBeFalsy();
    });

    it("should be set false on failed submit", () => {
      component["apiAction"] = spy.and.callFake(errorResponse);
      fixture.detectChanges();

      component.submit({ id: 1 });
      expect(component.loading).toBeFalsy();
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
