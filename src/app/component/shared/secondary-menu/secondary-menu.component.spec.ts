import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MenuButtonComponent } from "../menu/button/button.component";
import { MenuExternalLinkComponent } from "../menu/external-link/external-link.component";
import { MenuInternalLinkComponent } from "../menu/internal-link/internal-link.component";
import { MenuComponent } from "../menu/menu.component";
import { SecondaryMenuComponent } from "./secondary-menu.component";

describe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule,
        RouterTestingModule,
        HttpClientModule,
        FontAwesomeModule,
        NgbModule
      ],
      declarations: [
        SecondaryMenuComponent,
        MenuComponent,
        MenuButtonComponent,
        MenuExternalLinkComponent,
        MenuInternalLinkComponent
      ]
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

  it("should have tests", () => {
    expect(false).toBeTruthy();
  });
});
