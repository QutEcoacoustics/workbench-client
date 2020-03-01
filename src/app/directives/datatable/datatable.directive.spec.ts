import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DatatableDirective } from "./datatable.directive";

describe("DefaultDatatableComponent", () => {
  let component: DatatableDirective;
  let fixture: ComponentFixture<DatatableDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatatableDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableDirective);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
