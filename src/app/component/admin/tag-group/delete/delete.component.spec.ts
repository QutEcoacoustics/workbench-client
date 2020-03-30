import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagGroupsDeleteComponent } from "./delete.component";

xdescribe("AdminTagGroupsDeleteComponent", () => {
  let component: AdminTagGroupsDeleteComponent;
  let fixture: ComponentFixture<AdminTagGroupsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagGroupsDeleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagGroupsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
