// import { async, ComponentFixture, TestBed } from "@angular/core/testing";
// import { RouterTestingModule } from "@angular/router/testing";
// import { StrongRoute } from "src/app/interfaces/strongRoute";
// import { SharedModule } from "../../shared.module";
// import { MenuInternalLinkComponent } from "./internal-link.component";

// describe("MenuInternalLinkComponent", () => {
//   let component: MenuInternalLinkComponent;
//   let fixture: ComponentFixture<MenuInternalLinkComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule, SharedModule],
//       declarations: [MenuInternalLinkComponent]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MenuInternalLinkComponent);
//     component = fixture.componentInstance;
//     component.id = "id";
//     component.link = {
//       icon: ["fas", "home"],
//       kind: "MenuRoute",
//       label: "home",
//       route: StrongRoute.Base.add("home"),
//       tooltip: () => "tooltip"
//     };
//     component.linkParams = {};
//     component.placement = "left";
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });
// });
