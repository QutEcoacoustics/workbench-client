import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormlyModule } from "@ngx-formly/core";
import { formlyRoot } from "src/app/app.helper";
import { DeploymentEnvironmentService } from "src/app/services/environment/deployment-environment.service";
import { testAppInitializer } from "src/app/test.helper";
import { SharedModule } from "../shared/shared.module";
import { DataRequestComponent } from "./data-request.component";

describe("DataRequestComponent", () => {
  let httpMock: HttpTestingController;
  let component: DataRequestComponent;
  let env: DeploymentEnvironmentService;
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
    env = TestBed.inject(DeploymentEnvironmentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    httpMock.expectOne(
      env.getEnvironment().cmsRoot + "/downloadAnnotations.html"
    );
    expect(component).toBeTruthy();
  });
});
