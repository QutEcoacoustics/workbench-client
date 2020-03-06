import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed
} from "@angular/core/testing";
import { ToastrService } from "ngx-toastr";
import { appLibraryImports } from "src/app/app.module";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testAppInitializer } from "src/app/test.helper";
import {
  getInputs,
  inputValue,
  submitForm,
  testFormlyField
} from "src/testHelpers";
import { ConfirmPasswordComponent } from "./confirm-account.component";
import { fields } from "./confirm-account.json";

describe("ConfirmPasswordComponent", () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;
  let notifications: ToastrService;

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

  describe("form", () => {
    it("should load form", () => {
      expect(
        fixture.nativeElement.querySelector("button[type='submit']")
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector("button[type='submit']").disabled
      ).toBeFalsy();
    });

    it("should only contain one input", () => {
      expect(fixture.nativeElement.querySelectorAll("input").length).toBe(1);
    });

    /* Username/Email Address Input */
    testFormlyField(
      "Username/Email Address Input",
      undefined,
      fields[0],
      "login",
      "input",
      true,
      "Username or Email Address",
      "text"
    );
  });

  describe("submit logic", () => {
    it("should show error message with missing email", fakeAsync(() => {
      submitForm(fixture);

      expect(notifications.error).toHaveBeenCalledWith(
        "Please fill all required fields."
      );
    }));

    it("should call submit function with username/email", fakeAsync(() => {
      spyOn(component, "submit");

      const inputs = getInputs(fixture);
      inputValue(inputs[0], "input", "username");
      submitForm(fixture);

      expect(component.submit).toHaveBeenCalledWith({ login: "username" });
    }));
  });

  // TODO
  xit("should confirm account on submit", () => {});
});
