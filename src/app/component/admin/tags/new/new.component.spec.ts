import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagsNewComponent } from "./new.component";

describe("AdminTagsNewComponent", () => {
  let component: AdminTagsNewComponent;
  let fixture: ComponentFixture<AdminTagsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagsNewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
