import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormlyModule } from "@ngx-formly/core";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        FormlyModule.forRoot({
          validationMessages: [
            { name: "required", message: "This field is required" },
            { name: "minlength", message: minLengthValidationMessage },
            { name: "maxlength", message: maxLengthValidationMessage },
            { name: "min", message: minValidationMessage },
            { name: "max", message: maxValidationMessage }
          ]
        })
      ],
      declarations: [LoginComponent, HomeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have tests", () => {
    expect(false).toBeTruthy();
  });
});

export function minLengthValidationMessage(err, field) {
  return `Input should have at least ${
    field.templateOptions.minLength
  } characters`;
}

export function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${
    field.templateOptions.maxLength
  } characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}
