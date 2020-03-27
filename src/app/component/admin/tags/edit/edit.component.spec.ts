import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagsEditComponent } from "./edit.component";

describe("AdminTagsEditComponent", () => {
  let component: AdminTagsEditComponent;
  let fixture: ComponentFixture<AdminTagsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagsEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
