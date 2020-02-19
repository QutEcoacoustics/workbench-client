import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { testAppInitializer } from "src/app/test.helper";
import { SharedModule } from "../shared/shared.module";
import { DataRequestComponent } from "./data-request.component";

describe("DataRequestComponent", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let component: DataRequestComponent;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        FormlyModule.forRoot(formlyRoot)
      ],
      declarations: [DataRequestComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRequestComponent);
    httpMock = TestBed.inject(HttpTestingController);
    config = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/annotationsDownload.html"
    );
    httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/dataRequest.html"
    );
    expect(component).toBeTruthy();
  });
});
