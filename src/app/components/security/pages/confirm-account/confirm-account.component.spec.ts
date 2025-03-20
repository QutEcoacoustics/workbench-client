import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { FormComponent } from "@shared/form/form.component";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { ConfirmPasswordComponent } from "./confirm-account.component";
import schema from "./confirm-account.schema.json";

describe("ConfirmPasswordComponent", () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;
  let notifications: ToastService;
  const { fields } = schema;

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Username/Email Address Input",
        field: fields[0],
        label: "Username or Email Address",
        key: "login",
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
        declarations: [ConfirmPasswordComponent, FormComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(ConfirmPasswordComponent);
      component = fixture.componentInstance;
      notifications = TestBed.inject(ToastService);
      fixture.detectChanges();

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    assertPageInfo(ConfirmPasswordComponent, "Confirm Account");

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    // TODO should call api
    xit("should call api", () => {});
  });
});
