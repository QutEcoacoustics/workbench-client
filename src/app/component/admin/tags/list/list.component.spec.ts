import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagsComponent } from "./list.component";

describe("AdminTagsComponent", () => {
  let component: AdminTagsComponent;
  let fixture: ComponentFixture<AdminTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
