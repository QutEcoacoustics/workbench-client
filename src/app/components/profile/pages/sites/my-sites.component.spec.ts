import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { ISite, Site } from "@models/Site";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateSite } from "@test/fakes/Site";
import { generateUser } from "@test/fakes/User";
import { assertErrorHandler, assertRoute } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { BehaviorSubject } from "rxjs";
import { MySitesComponent } from "./my-sites.component";

describe("MySitesComponent", () => {
  let api: SpyObject<ShallowSitesService>;
  let component: MySitesComponent;
  let defaultUser: User;
  let fixture: ComponentFixture<MySitesComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MySitesComponent],
      imports: [SharedModule, RouterTestingModule, MockBawApiModule],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { user: accountResolvers.show },
            { user: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MySitesComponent);
    api = TestBed.inject(ShallowSitesService) as SpyObject<ShallowSitesService>;
    component = fixture.componentInstance;
  }

  function setSite(data?: ISite): Site {
    if (!data) {
      api.filter.and.callFake(() => new BehaviorSubject<Site[]>([]));
      return;
    }

    const site = new Site({ ...generateSite(), ...data });
    site.addMetadata({
      status: 200,
      message: "OK",
      paging: {
        page: 1,
        items: defaultApiPageSize,
        total: 1,
        maxPage: 1,
      },
    });

    api.filter.and.callFake(
      () => new BehaviorSubject<Site[]>([site])
    );

    return site;
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    setSite();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display username in title", () => {
    configureTestingModule(
      new User({ ...generateUser(), userName: "custom username" })
    );
    setSite();
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("small");
    expect(title.innerText.trim()).toContain("custom username");
  });

  it("should handle user error", () => {
    configureTestingModule(undefined, generateApiErrorDetails());
    setSite();
    fixture.detectChanges();
    expect(component).toBeTruthy();

    assertErrorHandler(fixture);
  });

  describe("table", () => {
    function getCells(): NodeListOf<HTMLDivElement> {
      return fixture.nativeElement.querySelectorAll("datatable-body-cell");
    }

    it("should display site name", () => {
      configureTestingModule(defaultUser);
      setSite({ name: "custom site" });
      fixture.detectChanges();

      expect(getCells()[0].innerText.trim()).toBe("custom site");
    });

    it("should display site name link", () => {
      configureTestingModule(defaultUser);
      const site = setSite({ projectIds: new Set([1]) });
      fixture.detectChanges();

      const link = getCells()[0].querySelector("a");
      assertRoute(link, site.viewUrl);
    });

    // TODO Implement
    xit("should display no recent audio upload", () => {});
    xit("should display recent audio upload", () => {});
    xit("should display reader permissions", () => {});
    xit("should display writer permissions", () => {});
    xit("should display owner permissions", () => {});
    xit("should display owner permissions link", () => {});
    xit("should display annotation link", () => {});
  });
});
