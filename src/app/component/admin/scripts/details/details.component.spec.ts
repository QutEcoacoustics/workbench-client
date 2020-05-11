import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminScriptComponent } from "./details.component";

describe("AdminScriptComponent", () => {
  let component: AdminScriptComponent;
  let fixture: ComponentFixture<AdminScriptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
