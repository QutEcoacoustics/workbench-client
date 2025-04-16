import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminDashboardComponent } from "./dashboard.component";

describe("AdminDashboardComponent", () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
