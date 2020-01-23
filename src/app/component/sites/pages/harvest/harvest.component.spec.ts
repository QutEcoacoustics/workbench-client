import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { HarvestComponent } from "./harvest.component";

describe("SiteHarvestComponent", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let component: HarvestComponent;
  let fixture: ComponentFixture<HarvestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [HarvestComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/harvest.html"
    );
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/harvest.html"
    );

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
