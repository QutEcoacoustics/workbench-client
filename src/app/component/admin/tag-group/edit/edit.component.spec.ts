import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagGroupsEditComponent } from "./edit.component";

describe("AdminTagGroupsEditComponent", () => {
  let component: AdminTagGroupsEditComponent;
  let fixture: ComponentFixture<AdminTagGroupsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagGroupsEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagGroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
