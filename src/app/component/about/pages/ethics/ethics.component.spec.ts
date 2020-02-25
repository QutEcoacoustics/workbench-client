import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testAppInitializer } from "src/app/test.helper";
import { environment } from "src/environments/environment";
import { EthicsComponent } from "./ethics.component";

describe("AboutEthicsComponent", () => {
  let httpMock: HttpTestingController;
  let component: EthicsComponent;
  let fixture: ComponentFixture<EthicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      declarations: [EthicsComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EthicsComponent);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create", () => {
    httpMock.expectOne(environment.environment.cmsRoot + "/ethics.html");
    expect(component).toBeTruthy();
  });

  it("should load cms", () => {
    const req = httpMock.expectOne(
      environment.environment.cmsRoot + "/ethics.html"
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
