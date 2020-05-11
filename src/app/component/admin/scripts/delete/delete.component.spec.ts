import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminScriptsDeleteComponent } from "./delete.component";

describe("AdminScriptsDeleteComponent", () => {
  let component: AdminScriptsDeleteComponent;
  let fixture: ComponentFixture<AdminScriptsDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptsDeleteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScriptsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
