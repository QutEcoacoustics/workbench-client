import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UserLinkComponent } from "./user-link.component";

// TODO
xdescribe("UserLinkComponent", () => {
  let component: UserLinkComponent;
  let fixture: ComponentFixture<UserLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
