import { HttpClientModule } from "@angular/common/http";
import { async, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { providers } from "./app.helper";
import { FooterComponent } from "./component/shared/footer/footer.component";
import { HeaderComponent } from "./component/shared/header/header.component";
import { SharedModule } from "./component/shared/shared.module";
import { AppConfigService } from "./services/app-config/app-config.service";
import {
  APP_CONFIG,
  MockAppConfigService
} from "./services/app-config/app-configMock.service";

// describe("AppComponent", () => {
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [RouterTestingModule, SharedModule, HttpClientModule],
//       declarations: [AppComponent, HeaderComponent, FooterComponent],
//       providers: [
//         ...providers,
//         { provide: APP_CONFIG, useValue: "" },
//         { provide: AppConfigService, useClass: MockAppConfigService }
//       ]
//     }).compileComponents();
//   }));

//   it("should create the app", () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.debugElement.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   // TODO Add unit tests
// });
