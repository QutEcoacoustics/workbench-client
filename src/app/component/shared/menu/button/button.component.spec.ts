import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SharedModule } from "../../shared.module";
import { MenuButtonComponent } from "./button.component";

describe("MenuButtonComponent", () => {
  let component: MenuButtonComponent;
  let fixture: ComponentFixture<MenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [MenuButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuButtonComponent);
    component = fixture.componentInstance;
    component.id = "id";
    component.link = {
      kind: "MenuAction",
      action: () => console.log("action"),
      label: "home",
      icon: ["fas", "home"],
      tooltip: () => "tooltip"
    };
    component.placement = "left";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
