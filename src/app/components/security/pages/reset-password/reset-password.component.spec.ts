import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { FormComponent } from "@shared/form/form.component";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports } from "@test/helpers/testbed";
import { ToastsService } from "@services/toasts/toasts.service";
import { ResetPasswordComponent } from "./reset-password.component";
import schema from "./reset-password.schema.json";

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let notifications: ToastsService;
  const { fields } = schema;

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Username/Email Address Input",
        field: fields[0],
        key: "login",
        label: "Username or Email Address",
        type: "input",
        inputType: "text",
        required: true,
      },
    ]);
  });

  describe("component", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [...testFormImports, MockBawApiModule],
        declarations: [ResetPasswordComponent, FormComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ResetPasswordComponent);
      component = fixture.componentInstance;
      notifications = TestBed.inject(ToastsService);
      fixture.detectChanges();

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    assertPageInfo(ResetPasswordComponent, "Reset Password");

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    // TODO should call api
    xit("should call api", () => {});
  });
});
