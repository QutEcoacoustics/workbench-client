import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DefaultDatatableComponent } from "./datatable.component";

describe("DefaultDatatableComponent", () => {
  let component: DefaultDatatableComponent;
  let fixture: ComponentFixture<DefaultDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultDatatableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
