import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AnnotationDownloadComponent } from "./annotation-download.component";

describe("AnnotationDownloadComponent", () => {
  let component: AnnotationDownloadComponent;
  let fixture: ComponentFixture<AnnotationDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotationDownloadComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
