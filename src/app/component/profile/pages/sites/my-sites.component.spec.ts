import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MySitesComponent } from "./my-sites.component";

describe("MySitesComponent", () => {
  let component: MySitesComponent;
  let fixture: ComponentFixture<MySitesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MySitesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
