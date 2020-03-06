import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { testAppInitializer } from "src/app/test.helper";
import { SharedModule } from "../shared.module";
import { ErrorHandlerComponent } from "./error-handler.component";

@Component({
  template: "<app-error-handler [error]='error'></app-error-handler>"
})
class MockComponent implements OnInit {
  error: ApiErrorDetails;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.error = {
      status: 401,
      message: "You need to log in or register before continuing."
    } as ApiErrorDetails;
    this.ref.detectChanges();
  }

  setError(error: ApiErrorDetails) {
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
      imports: [SharedModule, RouterTestingModule],
      declarations: [ErrorHandlerComponent, MockComponent],
      providers: [...testAppInitializer]
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

  it("should handle unauthorized code", () => {
    component.error = {
      status: 401,
      message: "You need to log in or register before continuing."
    } as ApiErrorDetails;
    fixture.detectChanges();

    assertTitle("Unauthorized Access");
    assertDescription("You need to log in or register before continuing.");
  });

  it("should handle not found code", () => {
    component.error = {
      status: 404,
      message: "Could not find the requested item."
    } as ApiErrorDetails;
    fixture.detectChanges();

    assertTitle("Not Found");
    assertDescription("Could not find the requested item.");
  });

  it("should handle zero code", () => {
    component.error = {
      status: 0,
      message: "Unknown error has occurred."
    } as ApiErrorDetails;
    fixture.detectChanges();

    assertTitle("Unknown Error");
    assertDescription("Unknown error has occurred.");
  });

  it("should handle unknown code", () => {
    component.error = {
      status: -1,
      message: "Unknown error has occurred."
    } as ApiErrorDetails;
    fixture.detectChanges();

    assertTitle("Unknown Error");
    assertDescription("Unknown error has occurred.");
  });

  it("should handle undefined code", () => {
    component.error = undefined;
    fixture.detectChanges();

    assertTitle(undefined);
    assertDescription(undefined);
  });

  it("should handle null code", () => {
    component.error = null;
    fixture.detectChanges();

    assertTitle(undefined);
    assertDescription(undefined);
  });

  it("should detect changes", () => {
    mockFixture.detectChanges();

    const nativeElement = mockFixture.nativeElement;
    assertTitle("Unauthorized Access", nativeElement);
    assertDescription(
      "You need to log in or register before continuing.",
      nativeElement
    );

    mockComponent.setError({
      status: 404,
      message: "Could not find the requested item."
    });
    mockFixture.detectChanges();

    assertTitle("Not Found", nativeElement);
    assertDescription("Could not find the requested item.", nativeElement);
  });
});
