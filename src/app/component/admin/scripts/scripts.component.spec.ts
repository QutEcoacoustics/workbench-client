import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminScriptsComponent } from "./scripts.component";

xdescribe("AdminScriptsComponent", () => {
  let component: AdminScriptsComponent;
  let fixture: ComponentFixture<AdminScriptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
