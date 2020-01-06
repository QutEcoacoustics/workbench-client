import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { BehaviorSubject } from "rxjs";
import { testBawServices } from "src/app/app.helper";
import { SecurityService } from "src/app/services/baw-api/security.service";
import { HeaderDropdownComponent } from "./header-dropdown/header-dropdown.component";
import { HeaderItemComponent } from "./header-item/header-item.component";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let securityApi: SecurityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeaderComponent,
        HeaderItemComponent,
        HeaderDropdownComponent
      ],
      imports: [RouterTestingModule, FontAwesomeModule, HttpClientModule],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    securityApi = TestBed.get(SecurityService);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    spyOn(securityApi, "getLoggedInTrigger").and.callFake(
      () => new BehaviorSubject(false)
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // TODO Add unit tests
});
