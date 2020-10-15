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
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let httpMock: HttpTestingController;
  let component: EthicsComponent;
  let fixture: ComponentFixture<EthicsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [EthicsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EthicsComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  assertCms<EthicsComponent>(
    () => ({ fixture, component, httpMock }),
    CMS.ETHICS
  );
});
