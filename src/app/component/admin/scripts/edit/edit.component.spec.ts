import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminScriptsEditComponent } from "./edit.component";

describe("AdminScriptsEditComponent", () => {
  let component: AdminScriptsEditComponent;
  let fixture: ComponentFixture<AdminScriptsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptsEditComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScriptsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
