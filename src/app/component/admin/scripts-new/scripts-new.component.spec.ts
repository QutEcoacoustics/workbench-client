import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminScriptsNewComponent } from "./scripts-new.component";

describe("AdminScriptsNewComponent", () => {
  let component: AdminScriptsNewComponent;
  let fixture: ComponentFixture<AdminScriptsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminScriptsNewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScriptsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
