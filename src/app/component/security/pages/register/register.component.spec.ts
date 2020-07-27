import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
} from "@angular/core/testing";
import { SecurityService } from "@baw-api/security/security.service";
import { ToastrService } from "ngx-toastr";
import { testFormlyFields } from "src/app/test/helpers/formly";
import {
  assertValidationMessage,
  getInputs,
  inputValue,
  submitForm,
} from "src/app/test/helpers/html";
import { testBawServices, testFormImports } from "src/app/test/helpers/testbed";
import { RegisterComponent } from "./register.component";
import { fields } from "./register.schema.json";
import { FormComponent } from "@shared/form/form.component";
import { WIPComponent } from "@shared/wip/wip.component";

describe("RegisterComponent", () => {
  let api: SecurityService;
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let notifications: ToastrService;

  const usernameIndex = 1;
  const emailIndex = 2;
  const passwordIndex = 3;
  const passwordConfIndex = 4;

  function isSignedIn(signedIn: boolean = true) {
    spyOn(api, "isLoggedIn").and.callFake(() => signedIn);
  }

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Username Input",
        field: fields[0],
        key: "username",
        type: "input",
        required: true,
        label: "Username",
        inputType: "text",
      },
      {
        testGroup: "Email Input",
        field: fields[1],
        key: "email",
        type: "input",
        required: true,
        label: "Email Address",
        inputType: "email",
      },
      {
        testGroup: "Password",
        field: fields[2],
        key: "confirmation",
        required: true,
        type: "passwordConfirmation",
      },
    ]);
  });

  describe("component", () => {
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: testFormImports,
        declarations: [RegisterComponent, FormComponent, WIPComponent],
        providers: testBawServices,
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(RegisterComponent);
      component = fixture.componentInstance;
      api = TestBed.inject(SecurityService);
      notifications = TestBed.inject(ToastrService);

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    it("should create", () => {
      isSignedIn(false);
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    // TODO
    xit("should call api", () => {});

    describe("authenticated user", () => {
      it("should show error for authenticated user", () => {
        isSignedIn(true);
        fixture.detectChanges();

        expect(notifications.error).toHaveBeenCalledWith(
          "You are already logged in."
        );
      });

      it("should disable submit button for authenticated user", () => {
        isSignedIn(true);
        fixture.detectChanges();

        const button = fixture.nativeElement.querySelector(
          "button[type='submit']"
        );
        expect(button).toBeTruthy();
        expect(button.disabled).toBeTruthy();
      });
    });
  });
});
