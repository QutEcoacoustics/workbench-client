import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { DisclaimersComponent } from "./disclaimers.component";

describe("AboutDisclaimersComponent", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let component: DisclaimersComponent;
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
    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/disclaimers.html"
    );
    expect(component).toBeTruthy();
  });
});
