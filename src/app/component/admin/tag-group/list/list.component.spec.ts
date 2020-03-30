import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagGroupsComponent } from "./list.component";

describe("AdminTagGroupsComponent", () => {
  let component: AdminTagGroupsComponent;
  let fixture: ComponentFixture<AdminTagGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagGroupsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
