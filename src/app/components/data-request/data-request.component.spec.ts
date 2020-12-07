import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { DataRequestComponent } from "./data-request.component";

xdescribe("DataRequestComponent", () => {
  let httpMock: HttpTestingController;
  let component: DataRequestComponent;
  let config: ConfigService;
  let fixture: ComponentFixture<DataRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [DataRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataRequestComponent);
    httpMock = TestBed.inject(HttpTestingController);
    config = TestBed.inject(ConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
