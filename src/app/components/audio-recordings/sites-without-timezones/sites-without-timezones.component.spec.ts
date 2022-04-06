import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SitesWithoutTimezonesComponent } from "./sites-without-timezones.component";

// TODO
xdescribe("SitesWithoutTimezonesComponent", () => {
  let component: SitesWithoutTimezonesComponent;
  let fixture: ComponentFixture<SitesWithoutTimezonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SitesWithoutTimezonesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SitesWithoutTimezonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
