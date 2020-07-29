import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormComponent } from "@shared/form/form.component";
import { ToastrService } from "ngx-toastr";
import { testFormlyFields } from "src/app/test/helpers/formly";
import { testBawServices, testFormImports } from "src/app/test/helpers/testbed";
import { ConfirmPasswordComponent } from "./confirm-account.component";
import { fields } from "./confirm-account.schema.json";

describe("ConfirmPasswordComponent", () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;
  let notifications: ToastrService;

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
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: testFormImports,
        declarations: [ConfirmPasswordComponent, FormComponent],
        providers: testBawServices,
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
