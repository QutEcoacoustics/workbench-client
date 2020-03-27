import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminTagsDeleteComponent } from "./delete.component";

describe("AdminTagsDeleteComponent", () => {
  let component: AdminTagsDeleteComponent;
  let fixture: ComponentFixture<AdminTagsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTagsDeleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTagsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
