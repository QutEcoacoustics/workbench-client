import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { unknownErrorCode } from "@baw-api/baw-api.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import {
  generateApiErrorDetails,
  generateApiErrorDetailsV2,
} from "@test/fakes/ApiErrorDetails";
import {
  FORBIDDEN,
  NOT_FOUND,
  REQUEST_TIMEOUT,
  UNAUTHORIZED,
} from "http-status";
import { SharedModule } from "../shared.module";
import { ErrorHandlerComponent } from "./error-handler.component";

@Component({
  template: "<baw-error-handler [error]='error'></baw-error-handler>",
})
class MockComponent implements OnInit {
  public error: ApiErrorDetails;

  public constructor(private ref: ChangeDetectorRef) {}

  public ngOnInit() {
    this.error = {
      status: 401,
      message: "You need to log in or register before continuing.",
    } as ApiErrorDetails;
    this.ref.detectChanges();
  }

  public setError(error: ApiErrorDetails) {
    this.error = error;
    this.ref.detectChanges();
  }
}

describe("ErrorHandlerComponent", () => {
  let component: ErrorHandlerComponent;
  let mockComponent: MockComponent;
  let fixture: ComponentFixture<ErrorHandlerComponent>;
  let mockFixture: ComponentFixture<MockComponent>;

  function assertTitle(
    title: string,
    nativeElement: any = fixture.nativeElement
  ) {
    const titleEl = nativeElement.querySelector("h1");

    if (!title) {
      expect(titleEl).toBeFalsy();
      return;
    }

    expect(titleEl).toBeTruthy();
    expect(titleEl.innerText.trim()).toBe(title);
  }

  function assertDescription(
    description: string,
    nativeElement: any = fixture.nativeElement
  ) {
    const bodyEl = nativeElement.querySelector("p");

    if (!description) {
      expect(bodyEl).toBeFalsy();
      return;
    }

    expect(bodyEl).toBeTruthy();
    expect(bodyEl.innerText).toBe(description);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, MockAppConfigModule],
      declarations: [ErrorHandlerComponent, MockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorHandlerComponent);
    mockFixture = TestBed.createComponent(MockComponent);

    component = fixture.componentInstance;
    mockComponent = mockFixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  [
    {
      title: "Unauthorized Access",
      error: generateApiErrorDetailsV2(UNAUTHORIZED, {
        message: "You need to log in or register before continuing.",
      }),
    },
    {
      title: "Access Forbidden",
      error: generateApiErrorDetailsV2(FORBIDDEN, {
        message: "You do not have access to this resource.",
      }),
    },
    {
      title: "Request Timed Out",
      error: generateApiErrorDetailsV2(REQUEST_TIMEOUT, {
        message: "Resource request took too long to complete.",
      }),
    },
    {
      title: "Not Found",
      error: generateApiErrorDetailsV2(NOT_FOUND, {
        message: "Could not find the requested item.",
      }),
    },
    {
      title: "Unknown Error",
      error: generateApiErrorDetailsV2(0, {
        message: "Unknown error has occurred.",
      }),
    },
    {
      title: "Unknown Error",
      error: generateApiErrorDetailsV2(unknownErrorCode, {
        message: "Unknown error has occurred.",
      }),
    },
  ].forEach(({ error, title }) => {
    it(`should handle ${error.status} status code`, () => {
      component.error = error;
      fixture.detectChanges();
      assertTitle(title);
      assertDescription(error.message);
    });
  });

  [
    { test: "null", value: null },
    { test: "undefined", value: undefined },
  ].forEach(({ test, value }) => {
    it(`should handle ${test} status code`, () => {
      component.error = value;
      fixture.detectChanges();
      assertTitle(undefined);
      assertDescription(undefined);
    });
  });

  it("should detect changes", () => {
    mockFixture.detectChanges();

    const nativeElement = mockFixture.nativeElement;
    assertTitle("Unauthorized Access", nativeElement);
    assertDescription(
      "You need to log in or register before continuing.",
      nativeElement
    );

    mockComponent.setError(
      generateApiErrorDetails("Not Found", {
        message: "Could not find the requested item.",
      })
    );
    mockFixture.detectChanges();

    assertTitle("Not Found", nativeElement);
    assertDescription("Could not find the requested item.", nativeElement);
  });
});
