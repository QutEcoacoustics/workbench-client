import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListenComponent } from "./list.component";

xdescribe("ListenComponent", () => {
  let component: ListenComponent;
  let fixture: ComponentFixture<ListenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
