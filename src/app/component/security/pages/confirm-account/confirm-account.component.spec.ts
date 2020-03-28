import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testAppInitializer } from "src/app/test.helper";
import { testFormlyFields } from "src/testHelpers";
import { ConfirmPasswordComponent } from "./confirm-account.component";
import { fields } from "./confirm-account.json";

describe("ConfirmPasswordComponent", () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;
  let notifications: ToastrService;

  const formInputs = [
    {
      testGroup: "Username/Email Address Input",
      setup: undefined,
      field: fields[0],
      key: "login",
      htmlType: "input",
      required: true,
      label: "Username or Email Address",
      type: "text",
      description: undefined
    }
  ];

  describe("form", () => {
    testFormlyFields(formInputs);
  });

  describe("component", () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [...appLibraryImports, SharedModule],
        declarations: [ConfirmPasswordComponent, HomeComponent],
        providers: [...testAppInitializer]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ConfirmPasswordComponent);
      component = fixture.componentInstance;
      notifications = TestBed.inject(ToastrService);
      fixture.detectChanges();

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    // TODO should call api
    xit("should call api", () => {});
  });
});
