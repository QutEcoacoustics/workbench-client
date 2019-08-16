import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { HomeComponent } from "src/app/component/home/home.component";
import { SharedModule } from "src/app/component/shared/shared.module";
import { environment } from "src/environments/environment";
import { ConfirmPasswordComponent } from "./confirm-account.component";

describe("ConfirmPasswordComponent", () => {
  let component: ConfirmPasswordComponent;
  let fixture: ComponentFixture<ConfirmPasswordComponent>;
  let httpMock: HttpTestingController;
  let originalTimeout;
  const url = environment.baw_api_url;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
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
      declarations: [ConfirmPasswordComponent, HomeComponent]
    }).compileComponents();

    httpMock = TestBed.get(HttpTestingController);
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  }));

  afterEach(() => {
    httpMock.verify();
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should eventually load form", done => {
    expect(fixture.nativeElement.querySelector("button")).toBeTruthy();
    expect(fixture.nativeElement.querySelector("button").disabled).toBeTruthy();

    const req = httpMock.expectOne("assets/templates/confirm-account.json");
    expect(req.request.method).toBe("GET");

    req.flush({
      model: {
        email: ""
      },
      fields: [
        {
          key: "email",
          type: "input",
          templateOptions: {
            label: "Username or Email Address",
            required: true
          }
        }
      ]
    });

    const interval = setInterval(() => {
      if (!fixture.nativeElement.querySelector("button").disabled) {
        expect(
          fixture.nativeElement.querySelector("button").disabled
        ).toBeFalsy();
        clearInterval(interval);
        done();
      }
    }, 100);
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
