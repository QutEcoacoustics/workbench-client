import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SharedModule } from "../shared.module";
import { ActionMenuComponent } from "./action-menu.component";

xdescribe("ActionMenuComponent", () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [ActionMenuComponent],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  xit("should handle no links", () => {});
  xit("should handle single internal link", () => {});
  xit("should handle multiple internal links", () => {});
  xit("should handle single external link", () => {});
  xit("should handle multiple external links", () => {});
  xit("should handle single action button", () => {});
  xit("should handle multiple action button", () => {});
  xit("should handle no widget", () => {});
  xit("should handle widget", () => {});
});
