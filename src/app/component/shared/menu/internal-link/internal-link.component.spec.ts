import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MenuInternalLinkComponent } from "./internal-link.component";

describe("MenuInternalLinkComponent", () => {
  let component: MenuInternalLinkComponent;
  let fixture: ComponentFixture<MenuInternalLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuInternalLinkComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuInternalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
