import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { DetailsComponent } from "./details.component";

describe("SitesDetailsComponent", () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule, AgmSnazzyInfoWindowModule],
      declarations: [DetailsComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
