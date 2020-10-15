import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { SharedModule } from "@shared/shared.module";
import { SiteHarvestComponent } from "./site.component";

describe("SiteHarvestComponent", () => {
  let httpMock: HttpTestingController;
  let component: SiteHarvestComponent;
  let fixture: ComponentFixture<SiteHarvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, MockAppConfigModule],
      declarations: [SiteHarvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHarvestComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
