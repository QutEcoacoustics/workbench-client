import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CMS } from "@baw-api/cms/cms.service";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { assertCms } from "@test/helpers/api-common";
import { DisclaimersComponent } from "./disclaimers.component";

describe("AboutDisclaimersComponent", () => {
  let httpMock: HttpTestingController;
  let component: DisclaimersComponent;
  let fixture: ComponentFixture<DisclaimersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [DisclaimersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisclaimersComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  assertCms<DisclaimersComponent>(
    () => ({ fixture, component, httpMock }),
    CMS.PRIVACY
  );
});
