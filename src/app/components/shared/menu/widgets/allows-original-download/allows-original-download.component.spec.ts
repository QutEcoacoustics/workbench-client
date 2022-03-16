import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AllowsOriginalDownloadComponent } from "./allows-original-download.component";

describe("AllowsOriginalDownloadComponent", () => {
  let component: AllowsOriginalDownloadComponent;
  let fixture: ComponentFixture<AllowsOriginalDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllowsOriginalDownloadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowsOriginalDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
