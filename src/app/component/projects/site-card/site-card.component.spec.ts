import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SiteCardComponent } from "./site-card.component";

describe("SiteCardComponent", () => {
  let component: SiteCardComponent;
  let fixture: ComponentFixture<SiteCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
