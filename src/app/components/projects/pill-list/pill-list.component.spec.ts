import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PillListComponent } from "./pill-list.component";

xdescribe("PillListComponent", () => {
  let component: PillListComponent;
  let fixture: ComponentFixture<PillListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PillListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
