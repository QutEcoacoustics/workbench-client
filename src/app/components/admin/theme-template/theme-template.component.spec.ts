import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminThemeTemplateComponent } from "./theme-template.component";

describe("AdminThemeTemplateComponent", () => {
  let component: AdminThemeTemplateComponent;
  let fixture: ComponentFixture<AdminThemeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminThemeTemplateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminThemeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
