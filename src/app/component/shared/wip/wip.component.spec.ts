import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { WIPComponent } from "./wip.component";

describe("WIPComponent", () => {
  let component: WIPComponent;
  let fixture: ComponentFixture<WIPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WIPComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
