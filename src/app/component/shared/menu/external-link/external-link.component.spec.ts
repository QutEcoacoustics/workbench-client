import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "../../shared.module";
import { MenuExternalLinkComponent } from "./external-link.component";

describe("MenuExternalLinkComponent", () => {
  let component: MenuExternalLinkComponent;
  let fixture: ComponentFixture<MenuExternalLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [MenuExternalLinkComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuExternalLinkComponent);
    component = fixture.componentInstance;
    component.id = "id";
    component.link = {
      kind: "MenuLink",
      icon: ["fas", "home"],
      label: "home",
      uri: "http://link/",
      tooltip: () => "tooltip"
    };
    component.placement = "left";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
