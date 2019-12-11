import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testAppInitializer } from "src/app/app.helper";
import { MenuButtonComponent } from "../menu/button/button.component";
import { MenuExternalLinkComponent } from "../menu/external-link/external-link.component";
import { MenuInternalLinkComponent } from "../menu/internal-link/internal-link.component";
import { MenuComponent } from "../menu/menu.component";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule, SharedModule],
      declarations: [
        SecondaryMenuComponent,
        MenuComponent,
        MenuButtonComponent,
        MenuExternalLinkComponent,
        MenuInternalLinkComponent
      ],
      providers: [...testAppInitializer]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // TODO Add unit tests
});
