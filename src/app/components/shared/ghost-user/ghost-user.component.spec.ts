import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GhostUserComponent } from "./ghost-user.component";

describe("GhostUserComponent", () => {
  let component: GhostUserComponent;
  let fixture: ComponentFixture<GhostUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GhostUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GhostUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
