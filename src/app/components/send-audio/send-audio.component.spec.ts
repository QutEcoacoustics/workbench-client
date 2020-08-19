import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppConfigService } from "@services/app-config/app-config.service";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let httpMock: HttpTestingController;
  let component: SendAudioComponent;
  let fixture: ComponentFixture<SendAudioComponent>;
  let env: AppConfigService;
  let cmsUrl: string;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockAppConfigModule,
      ],
      declarations: [SendAudioComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAudioComponent);
    httpMock = TestBed.inject(HttpTestingController);
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;

    cmsUrl = env.environment.cmsRoot + "/sendAudio.html";

    fixture.detectChanges();
  });

  it("should create", () => {
    httpMock.expectOne(cmsUrl);
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(cmsUrl);

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
