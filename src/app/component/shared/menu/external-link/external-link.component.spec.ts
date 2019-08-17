import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MenuExternalLinkComponent } from "./external-link.component";

describe("MenuExternalLinkComponent", () => {
  let component: MenuExternalLinkComponent;
  let fixture: ComponentFixture<MenuExternalLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuExternalLinkComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuExternalLinkComponent);
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
