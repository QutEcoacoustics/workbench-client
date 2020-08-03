import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateUser } from "@test/fakes/User";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { Subject } from "rxjs";
import { MyProjectsComponent } from "../projects/my-projects.component";
import { TheirBookmarksComponent } from "./their-bookmarks.component";

describe("TheirBookmarksComponent", () => {
  let api: SpyObject<BookmarksService>;
  let component: TheirBookmarksComponent;
  let defaultUser: User;
  let fixture: ComponentFixture<TheirBookmarksComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MyProjectsComponent],
      imports: [SharedModule, RouterTestingModule, MockBawApiModule],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { account: accountResolvers.show },
            { account: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TheirBookmarksComponent);
    api = TestBed.inject(BookmarksService) as SpyObject<BookmarksService>;
    component = fixture.componentInstance;

    api.filter.and.callFake(() => new Subject());
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should display username in title", () => {
    configureTestingModule(
      new User({ ...generateUser(), userName: "custom username" })
    );
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("small");
    expect(title.innerText.trim()).toContain("custom username");
  });

  it("should handle user error", () => {
    configureTestingModule(undefined, generateApiErrorDetails());
    fixture.detectChanges();
    expect(component).toBeTruthy();

    assertResolverErrorHandling(fixture);
  });

  // TODO Write Tests
});
