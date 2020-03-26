import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Resolvers } from "src/app/interfaces/menusInterfaces";
import { AbstractModel } from "src/app/models/AbstractModel";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import {
  mockActivatedRoute,
  MockData,
  MockResolvers
} from "src/app/test.helper";
import {
  defaultErrorMsg,
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate
} from "./formTemplate";

class MockModel extends AbstractModel {
  public redirectPath(): string {
    return "";
  }
  public toJSON(): object {
    return this;
  }
}

@Component({
  selector: "app-test-component",
  template: `
    <div></div>
  `
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
  let defaultResolvers: Resolvers;

  function configureTestingModule(
    resolvers: MockResolvers = {},
    data: MockData = {}
  ) {
    TestBed.configureTestingModule({
      declarations: [MockComponent],
      imports: [SharedModule, RouterTestingModule, ...appLibraryImports],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(resolvers, data)
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
  }

  function makeResolvedModel(
    model?: AbstractModel | AbstractModel[],
    error?: ApiErrorDetails
  ): ResolvedModel {
    return model ? { model } : { error };
  }

  beforeEach(() => {
    defaultError = { status: 401, message: "Unauthorized" } as ApiErrorDetails;
    defaultModel = new MockModel({ id: 1 });
    defaultResolvers = { mockModel: "MockModelResolver" };
  });

  describe("resolvers", () => {
    it("should handle no resolvers", () => {
      configureTestingModule();
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
          mockModels: makeResolvedModel([defaultModel])
        }
      );
      fixture.detectChanges();

      expect(component.failure).toBeFalsy();
    });

    it("should handle single resolver failure", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver" },
        {
          mockModel: makeResolvedModel(undefined, defaultError)
        }
      );
      fixture.detectChanges();

      expect(component.failure).toBeTruthy();
    });

    it("should handle any resolver failure", () => {
      configureTestingModule(
        { mockModel: "MockModelResolver", mockModels: "MockModelsResolver" },
        {
          mockModel: makeResolvedModel(defaultModel),
          mockModels: makeResolvedModel(undefined, defaultError)
        }
      );
      fixture.detectChanges();

      expect(component.failure).toBeTruthy();
    });
  });

  xdescribe("modelKey", () => {
    it("should handle undefined modelKey", () => {});
    it("should find model with single resolver", () => {});
    it("should find model with multiple resolvers", () => {});
    it("should handle failure to find model", () => {});
    it("should handle failure to find resolvers", () => {});
  });

  xdescribe("hasFormCheck", () => {
    it("should extend WithFormCheck", () => {});
    it("should disable isFormTouched", () => {});
    it("should disable resetForms", () => {});
  });

  xdescribe("submit", () => {
    it("should call apiAction on submit", () => {});
    it("should reset form on successful submission", () => {});
    it("should redirect user on successful submission", () => {});
  });

  xdescribe("successMessage", () => {
    it("should handle update form success message", () => {});
    it("should handle new form success message", () => {});
  });

  xdescribe("notifications", () => {
    it("should display notification on successful submission", () => {});
    it("should display notification on failed submission", () => {});
  });

  xdescribe("loading", () => {
    it("should be false initially", () => {});
    it("should be set true on submit", () => {});
    it("should be set true on successful submission", () => {});
    it("should be set true on failed submit", () => {});
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
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message"
    } as ApiErrorDetails;

    expect(defaultErrorMsg(apiError)).toBe("Custom Message");
  });
});

describe("extendedErrorMsg", () => {
  it("should return error message", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message"
    } as ApiErrorDetails;

    expect(extendedErrorMsg(apiError, {})).toBe("Custom Message");
  });

  it("should return error message with single info field", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message",
      info: {
        name: "this name already exists"
      }
    } as ApiErrorDetails;

    expect(
      extendedErrorMsg(apiError, { name: value => "custom message: " + value })
    ).toBe("Custom Message<br />custom message: this name already exists");
  });

  it("should return error message with multiple info fields", () => {
    const apiError: ApiErrorDetails = {
      status: 400,
      message: "Custom Message",
      info: {
        name: "this name already exists",
        foo: "bar"
      }
    } as ApiErrorDetails;

    expect(
      extendedErrorMsg(apiError, {
        name: () => "custom message",
        foo: value => value
      })
    ).toBe("Custom Message<br />custom message<br />bar");
  });
});
