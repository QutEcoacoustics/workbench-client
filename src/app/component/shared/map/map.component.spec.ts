import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GoogleMapsModule } from "@angular/google-maps";
import embedGoogleMaps from "@helpers/embedGoogleMaps/embedGoogleMaps";
import { MapComponent } from "./map.component";

describe("MapComponent", () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeAll(() => {
    embedGoogleMaps();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapComponent],
      imports: [GoogleMapsModule],
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

  it("should display placeholder", () => {
    component.sites = [];
    fixture.detectChanges();

    const placeholder: HTMLDivElement = fixture.nativeElement.querySelector(
      "div.map-placeholder"
    );
    expect(placeholder.innerText).toBe("No locations specified");
  });
});
