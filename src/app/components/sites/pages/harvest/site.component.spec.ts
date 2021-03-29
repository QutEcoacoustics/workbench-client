import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SharedModule } from "@shared/shared.module";
import { SiteHarvestComponent } from "./site.component";

describe("SiteHarvestComponent", () => {
  let component: SiteHarvestComponent;
  let fixture: ComponentFixture<SiteHarvestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MockBawApiModule,
      ],
      declarations: [SiteHarvestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHarvestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
