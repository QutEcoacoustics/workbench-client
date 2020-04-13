import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { testAppInitializer } from "src/app/test.helper";
import { SharedModule } from "../shared/shared.module";
import { DataRequestComponent } from "./data-request.component";

describe("DataRequestComponent", () => {
  let httpMock: HttpTestingController;
  let component: DataRequestComponent;
  let env: AppConfigService;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [DataRequestComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestComponent);
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    httpMock.expectOne(env.environment.cmsRoot + "/downloadAnnotations.html");
    expect(component).toBeTruthy();
  });
});
