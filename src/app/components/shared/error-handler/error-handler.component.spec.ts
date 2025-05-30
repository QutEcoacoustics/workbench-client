import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CLIENT_TIMEOUT } from "@baw-api/api.interceptor.service";
import { unknownErrorCode } from "@baw-api/baw-api.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { provideMockConfig } from "@services/config/provide-configMock";
import { generateBawApiError } from "@test/fakes/BawApiError";
import {
  FORBIDDEN,
  NOT_FOUND,
  REQUEST_TIMEOUT,
  UNAUTHORIZED,
} from "http-status";
import { provideRouter } from "@angular/router";
import { ErrorHandlerComponent } from "./error-handler.component";

@Component({
  template: "<baw-error-handler [error]='error'></baw-error-handler>",
  imports: [ErrorHandlerComponent],
  providers: [provideMockConfig()],
})
class MockComponent implements OnInit {
  public error: BawApiError;

  public constructor(private ref: ChangeDetectorRef) {}

  public ngOnInit() {
    this.error = new BawApiError(
      UNAUTHORIZED,
      "You need to log in or register before continuing.",
      null
    );
    this.ref.detectChanges();
  }

  public setError(error: BawApiError) {
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
      imports: [ErrorHandlerComponent, MockComponent],
      providers: [provideRouter([]), provideMockConfig()],
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
      error: generateBawApiError(
        UNAUTHORIZED,
        "You need to log in or register before continuing."
      ),
    },
    {
      title: "Access Forbidden",
      error: generateBawApiError(
        FORBIDDEN,
        "You do not have access to this resource."
      ),
    },
    {
      title: "Request Timed Out",
      error: generateBawApiError(
        REQUEST_TIMEOUT,
        "Resource request took too long to complete."
      ),
    },
    {
      title: "Not Found",
      error: generateBawApiError(
        NOT_FOUND,
        "Could not find the requested item."
      ),
    },
    {
      title: "Connection Failure",
      error: generateBawApiError(
        CLIENT_TIMEOUT,
        "A request took longer than expected to return"
      ),
    },
    {
      title: "Unknown Error",
      error: generateBawApiError(
        unknownErrorCode,
        "Unknown error has occurred."
      ),
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
      generateBawApiError(NOT_FOUND, "Could not find the requested item.")
    );
    mockFixture.detectChanges();

    assertTitle("Not Found", nativeElement);
    assertDescription("Could not find the requested item.", nativeElement);
  });
});
