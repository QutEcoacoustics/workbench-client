import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SpyObject } from "@ngneat/spectator";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AppComponent } from "./app.component";
import { appLibraryImports } from "./app.module";
import { SharedModule } from "./components/shared/shared.module";
import { AppConfigService } from "./services/app-config/app-config.service";
import { UserService } from "./services/baw-api/user/user.service";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let env: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LoadingBarHttpClientModule,
        MockBawApiModule,
      ],
      declarations: [AppComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    env = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
    const userApi = TestBed.inject(UserService) as SpyObject<UserService>;

    userApi.getLocalUser.and.callFake(() => null);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should create the app", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should create header", () => {
    const header = fixture.nativeElement.querySelector("baw-header");
    expect(header).toBeTruthy();
  });

  it("should create footer", () => {
    const footer = fixture.nativeElement.querySelector("baw-footer");
    expect(footer).toBeTruthy();
  });

  it("should create content", () => {
    const content = fixture.nativeElement.querySelector("div.content");
    expect(content).toBeTruthy();
    const routerOutlet = content.querySelector("router-outlet");
    expect(routerOutlet).toBeTruthy();
  });
});
