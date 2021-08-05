import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RecentAnnotationsComponent } from "./recent-annotations.component";

describe("RecentAnnotationsComponent", () => {
  let component: RecentAnnotationsComponent;
  let fixture: ComponentFixture<RecentAnnotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecentAnnotationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentAnnotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
