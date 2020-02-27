import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { testAppInitializer } from "src/app/test.helper";
import { DisclaimersComponent } from "./disclaimers.component";

describe("AboutDisclaimersComponent", () => {
  let httpMock: HttpTestingController;
  let component: DisclaimersComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<DisclaimersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [DisclaimersComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclaimersComponent);
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(env.environment.cmsRoot + "/disclaimers.html");
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(
      env.environment.cmsRoot + "/disclaimers.html"
    );

    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("h1");
    const body = fixture.nativeElement.querySelector("p");

    expect(header).toBeTruthy();
    expect(header.innerText.trim()).toBe("Test Header");
    expect(body).toBeTruthy();
    expect(body.innerText.trim()).toBe("Test Description");
  });
});
