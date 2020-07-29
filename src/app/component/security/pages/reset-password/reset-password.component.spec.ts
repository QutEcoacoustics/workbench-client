import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormComponent } from "@shared/form/form.component";
import { ToastrService } from "ngx-toastr";
import { testFormlyFields } from "src/app/test/helpers/formly";
import { testBawServices, testFormImports } from "src/app/test/helpers/testbed";
import { ResetPasswordComponent } from "./reset-password.component";
import { fields } from "./reset-password.schema.json";

describe("ResetPasswordComponent", () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let notifications: ToastrService;

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
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: testFormImports,
        declarations: [ResetPasswordComponent, FormComponent],
        providers: testBawServices,
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ResetPasswordComponent);
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
