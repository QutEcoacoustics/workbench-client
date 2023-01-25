import { ComponentFixture, TestBed } from "@angular/core/testing";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { UploadAnnotationsComponent } from "./upload-annotations.component";

describe("UploadAnnotationsComponent", () => {
  let component: UploadAnnotationsComponent;
  let fixture: ComponentFixture<UploadAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAnnotationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  assertPageInfo(UploadAnnotationsComponent, "Batch Upload Annotations");

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
