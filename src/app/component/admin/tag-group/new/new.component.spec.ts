import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagGroupsNewComponent } from "./new.component";

xdescribe("AdminTagGroupsNewComponent", () => {
  let component: AdminTagGroupsNewComponent;
  let fixture: ComponentFixture<AdminTagGroupsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagGroupsNewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagGroupsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
