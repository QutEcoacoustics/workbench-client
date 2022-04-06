import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DownloadTableComponent } from "./download-table.component";

// TODO
xdescribe("DownloadTableComponent", () => {
  let component: DownloadTableComponent;
  let fixture: ComponentFixture<DownloadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
