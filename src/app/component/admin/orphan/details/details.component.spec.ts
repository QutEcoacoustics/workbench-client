import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminOrphanComponent } from "./details.component";

describe("AdminOrphanComponent", () => {
  let component: AdminOrphanComponent;
  let fixture: ComponentFixture<AdminOrphanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminOrphanComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrphanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
