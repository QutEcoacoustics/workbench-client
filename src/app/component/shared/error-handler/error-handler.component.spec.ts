import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { testBawServices } from "src/app/app.helper";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
import { SharedModule } from "../shared.module";
import { ErrorHandlerComponent } from "./error-handler.component";

@Component({
  template: "<app-error-handler [error]='error'></app-error-handler>"
})
class TestErrorHandlerComponent implements OnInit {
  error: APIErrorDetails;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.error = {
      status: 401,
      message: "You need to log in or register before continuing."
    };
    this.ref.detectChanges();

    setTimeout(() => {
      this.error = {
        status: 404,
        message: "Could not find the requested item."
      };
      this.ref.detectChanges();
    }, 50);
  }
}

describe("ErrorHandlerComponent", () => {
  let api: BawApiService;
  let component: ErrorHandlerComponent;
  let fixture: ComponentFixture<ErrorHandlerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ErrorHandlerComponent, TestErrorHandlerComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorHandlerComponent);
    api = TestBed.get(BawApiService);

    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should handle unauthorized code", () => {
    component.error = {
      status: 401,
      message: "You need to log in or register before continuing."
    };
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Unauthorized access");

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe(
      "You need to log in or register before continuing."
    );
  });

  it("should handle not found code", () => {
    component.error = {
      status: 404,
      message: "Could not find the requested item."
    };
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Not found");

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe("Could not find the requested item.");
  });

  it("should handle forbidden code", () => {
    component.error = {
      status: 403,
      message: "You must request access to this resource."
    };
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Forbidden");

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe("You must request access to this resource.");
  });

  it("should handle unknown code", () => {
    component.error = { status: 0, message: "Unknown error has occurred." };
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Unknown Error");

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe("Unknown error has occurred.");
  });

  it("should handle undefined code", () => {
    component.error = undefined;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeFalsy();

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeFalsy();
  });

  it("should handle null code", () => {
    component.error = null;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeFalsy();

    const body = fixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeFalsy();
  });

  it("should handle changing code", fakeAsync(() => {
    const testFixture: ComponentFixture<TestErrorHandlerComponent> = TestBed.createComponent(
      TestErrorHandlerComponent
    );

    testFixture.detectChanges();

    const unauthorized = testFixture.debugElement.nativeElement.querySelector(
      "h1"
    );
    expect(unauthorized).toBeTruthy();
    expect(unauthorized.innerText).toBe("Unauthorized access");

    const body = testFixture.debugElement.nativeElement.querySelector("p");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe(
      "You need to log in or register before continuing."
    );

    tick(100);

    testFixture.detectChanges();

    const notFound = testFixture.debugElement.nativeElement.querySelector("h1");
    expect(notFound).toBeTruthy();
    expect(notFound.innerText).toBe("Not found");
    expect(body).toBeTruthy();
    expect(body.innerText).toBe("Could not find the requested item.");
  }));
});
