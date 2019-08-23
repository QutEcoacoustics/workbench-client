import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { PermissionsShieldComponent } from "./permissions-shield.component";

describe("PermissionsShieldComponent", () => {
  let component: PermissionsShieldComponent;
  let fixture: ComponentFixture<PermissionsShieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PermissionsShieldComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionsShieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
