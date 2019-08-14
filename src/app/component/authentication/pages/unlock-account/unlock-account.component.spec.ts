import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UnlockPasswordComponent } from "./unlock-account.component";

describe("UnlockPasswordComponent", () => {
  let component: UnlockPasswordComponent;
  let fixture: ComponentFixture<UnlockPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnlockPasswordComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlockPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have tests", () => {
    expect(false).toBeTruthy();
  });
});
