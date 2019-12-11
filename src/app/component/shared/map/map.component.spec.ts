import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MapComponent } from "./map.component";

describe("MapComponent", () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.sites = [];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
