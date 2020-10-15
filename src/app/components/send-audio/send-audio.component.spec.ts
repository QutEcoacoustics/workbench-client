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
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let httpMock: HttpTestingController;
  let component: SendAudioComponent;
  let fixture: ComponentFixture<SendAudioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [SendAudioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendAudioComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  assertCms<SendAudioComponent>(
    () => ({ fixture, component, httpMock }),
    CMS.DATA_UPLOAD
  );
});
