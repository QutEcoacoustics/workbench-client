import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TheirSitesComponent } from "./their-sites.component";

xdescribe("TheirSitesComponent", () => {
  let component: TheirSitesComponent;
  let fixture: ComponentFixture<TheirSitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TheirSitesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheirSitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
