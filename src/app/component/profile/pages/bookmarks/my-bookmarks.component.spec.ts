import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { userResolvers } from "@baw-api/user/user.service";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { assertResolverErrorHandling } from "@test/helpers/html";
import { mockActivatedRoute, testBawServices } from "@test/helpers/testbed";
import { MyProjectsComponent } from "../projects/my-projects.component";
import { MyBookmarksComponent } from "./my-bookmarks.component";

describe("MyBookmarksComponent", () => {
  let api: BookmarksService;
  let component: MyBookmarksComponent;
  let defaultUser: User;
  let defaultError: ApiErrorDetails;
  let fixture: ComponentFixture<MyBookmarksComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MyProjectsComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { user: userResolvers.show },
            { user: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyBookmarksComponent);
    api = TestBed.inject(BookmarksService);
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

  // TODO Write Tests
});
