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
import { CreditsComponent } from "./credits.component";

describe("AboutCreditsComponent", () => {
  let httpMock: HttpTestingController;
  let component: CreditsComponent;
  let fixture: ComponentFixture<CreditsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [CreditsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditsComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  assertCms<CreditsComponent>(
    () => ({ fixture, component, httpMock }),
    CMS.CREDITS
  );
});
