import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GhostUserHintComponent } from "./ghost-user-hint.component";

// TODO
describe("GhostUserHintComponent", () => {
  let component: GhostUserHintComponent;
  let fixture: ComponentFixture<GhostUserHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GhostUserHintComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostUserHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
