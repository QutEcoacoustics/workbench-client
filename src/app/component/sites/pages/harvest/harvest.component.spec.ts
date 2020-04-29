import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { testAppInitializer } from "src/app/test/helpers/testbed";
import { HarvestComponent } from "./harvest.component";

describe("SiteHarvestComponent", () => {
  let httpMock: HttpTestingController;
  let component: HarvestComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<HarvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [HarvestComponent],
      providers: [...testAppInitializer],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(AppConfigService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(env.environment.cmsRoot + "/harvest.html");
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(env.environment.cmsRoot + "/harvest.html");

    req.flush(
      "<h1>Test Header</h1><p class='description'>Test Description</p>"
    );
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("h1");
    const body = fixture.nativeElement.querySelector("p.description");

    expect(header).toBeTruthy();
    expect(header.innerText.trim()).toBe("Test Header");
    expect(body).toBeTruthy();
    expect(body.innerText.trim()).toBe("Test Description");
  });
});
