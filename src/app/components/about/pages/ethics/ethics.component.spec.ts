import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppConfigService } from "@services/app-config/app-config.service";
import { cmsRoot } from "@services/app-config/app-config.service.spec";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let httpMock: HttpTestingController;
  let component: EthicsComponent;
  let env: AppConfigService;
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
    env = TestBed.inject(AppConfigService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(`${cmsRoot}/ethics.html`);
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(`${cmsRoot}/ethics.html`);

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
