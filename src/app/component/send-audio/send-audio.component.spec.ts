import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { testAppInitializer } from "src/app/test.helper";
import { SharedModule } from "../shared/shared.module";
import { SendAudioComponent } from "./send-audio.component";

describe("SendAudioComponent", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let component: SendAudioComponent;
  let fixture: ComponentFixture<SendAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [SendAudioComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendAudioComponent);
    httpMock = TestBed.inject(HttpTestingController);
    config = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/sendAudio.html"
    );
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(
      config.getConfig().environment.cmsRoot + "/sendAudio.html"
    );

    req.flush("<h1>Test Header</h1><p>Test Description</p>");
    fixture.detectChanges();

    const header = fixture.nativeElement.querySelector("h1");
    const body = fixture.nativeElement.querySelector("p");

    expect(header).toBeTruthy();
    expect(header.innerText.trim()).toBe("Test Header");
    expect(body).toBeTruthy();
    expect(body.innerText.trim()).toBe("Test Description");
  });
});
