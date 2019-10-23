import { HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { appInitializerFn, providers } from "src/app/app.helper";
import {
  APP_CONFIG,
  MockAppConfigService
} from "src/app/services/app-config/app-configMock.service";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, FontAwesomeModule, HttpClientModule],
      providers: [
        ...providers,
        { provide: APP_CONFIG, useValue: "" },
        {
          provide: APP_INITIALIZER,
          useFactory: appInitializerFn,
          multi: true,
          deps: [MockAppConfigService]
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
