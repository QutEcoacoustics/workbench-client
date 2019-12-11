import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChange
} from "@angular/core";
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { testBawServices } from "src/app/app.helper";
import { BawApiService } from "src/app/services/baw-api/base-api.service";
import { SharedModule } from "../shared.module";
import { ErrorHandlerComponent } from "./error-handler.component";

@Component({
  template: "<app-error-handler [errorCode]='errorCode'></app-error-handler>"
})
class TestErrorHandlerComponent implements OnInit {
  errorCode: number;

  constructor() {}

  ngOnInit() {
    this.errorCode = 401;

    setTimeout(() => {
      this.errorCode = 404;
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
    component.errorCode = api.apiReturnCodes.unauthorized;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Unauthorized access");
  });

  it("should handle not found code", () => {
    component.errorCode = api.apiReturnCodes.notFound;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Not found");
  });

  it("should handle forbidden code", () => {
    component.errorCode = api.apiReturnCodes.forbidden;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Forbidden");
  });

  it("should handle unknown code", () => {
    component.errorCode = -1;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeTruthy();
    expect(title.innerText).toBe("Unknown error");
  });

  it("should handle undefined code", () => {
    component.errorCode = undefined;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeFalsy();
  });

  it("should handle null code", () => {
    component.errorCode = null;
    fixture.detectChanges();

    const title = fixture.debugElement.nativeElement.querySelector("h1");
    expect(title).toBeFalsy();
  });

  it("should handle changing code", fakeAsync(() => {
    const testFixture: ComponentFixture<TestErrorHandlerComponent> = TestBed.createComponent(
      TestErrorHandlerComponent
    );
    const testComponent: TestErrorHandlerComponent =
      testFixture.componentInstance;

    testFixture.detectChanges();

    const unauthorized = testFixture.debugElement.nativeElement.querySelector(
      "h1"
    );
    expect(unauthorized).toBeTruthy();
    expect(unauthorized.innerText).toBe("Unauthorized access");

    tick(100);

    testFixture.detectChanges();

    const notFound = testFixture.debugElement.nativeElement.querySelector("h1");
    expect(notFound).toBeTruthy();
    expect(notFound.innerText).toBe("Not found");
  }));
});
