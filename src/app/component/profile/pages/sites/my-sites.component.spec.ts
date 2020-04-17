import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { accountResolvers } from "@baw-api/account.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowSitesService } from "@baw-api/sites.service";
import { ISite, Site } from "@models/Site";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { BehaviorSubject } from "rxjs";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { assertResolverErrorHandling, assertRoute } from "src/testHelpers";
import { MySitesComponent } from "./my-sites.component";

describe("MySitesComponent", () => {
  let api: ShallowSitesService;
  let component: MySitesComponent;
  let defaultUser: User;
  let defaultError: ApiErrorDetails;
  let fixture: ComponentFixture<MySitesComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MySitesComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { account: accountResolvers.show },
            { account: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MySitesComponent);
    api = TestBed.inject(ShallowSitesService);
    component = fixture.componentInstance;
  }

  beforeEach(() => {
    defaultUser = new User({ id: 1, userName: "username" });
    defaultError = { status: 401, message: "Unauthorized" };
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display username in title", () => {
    configureTestingModule(
      new User({ ...defaultUser, userName: "custom username" })
    );
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("small");
    expect(title.innerText.trim()).toContain("custom username");
  });

  it("should handle user error", () => {
    configureTestingModule(undefined, defaultError);
    fixture.detectChanges();
    expect(component).toBeTruthy();

    assertResolverErrorHandling(fixture);
  });

  describe("table", () => {
    function setSite(data: ISite) {
      const site = new Site({ id: 1, name: "site", ...data });
      site.addMetadata({
        status: 200,
        message: "OK",
        paging: {
          page: 1,
          items: 25,
          total: 1,
          maxPage: 1,
        },
      });

      spyOn(api, "filter").and.callFake(() => {
        return new BehaviorSubject<Site[]>([site]);
      });

      return site;
    }

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
