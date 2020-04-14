import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TheirProjectsComponent } from "./their-projects.component";

describe("TheirProjectsComponent", () => {
  let component: TheirProjectsComponent;
  let fixture: ComponentFixture<TheirProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TheirProjectsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheirProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
