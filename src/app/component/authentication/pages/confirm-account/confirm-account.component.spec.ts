import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { validationMessages } from "src/app/app.helper";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { ConfirmPasswordComponent } from "./confirm-account.component";

describe("ConfirmPasswordComponent", () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [ConfirmPasswordComponent, HomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load form", () => {
    expect(fixture.nativeElement.querySelector("button")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button").disabled).toBeFalsy();
  });

  it("should only contain one input", () => {
    expect(fixture.nativeElement.querySelectorAll("input").length).toBe(1);
  });

  it("should contain username/email input", () => {
    expect(fixture.nativeElement.querySelector("input")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("input").type).toBe("text");

    // API route expects email as id
    expect(fixture.nativeElement.querySelector("input").id).toContain("email");
  });

  it("should call submit function on submit", async(() => {
    spyOn(component, "submit");

    const email = fixture.debugElement.nativeElement.querySelector("input");
    email.value = "email";
    email.dispatchEvent(new Event("input"));

    const button = fixture.debugElement.nativeElement.querySelector("button");
    button.click();

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.submit).toHaveBeenCalled();
    });
  }));

  xit("should confirm account on submit", () => {});
});
