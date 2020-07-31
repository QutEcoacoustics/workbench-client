import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { BookmarksService } from "@baw-api/bookmark/bookmarks.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { TagsService } from "@baw-api/tag/tags.service";
import { userResolvers } from "@baw-api/user/user.service";
import { User } from "@models/User";
import { SpyObject } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { Subject } from "rxjs";
import { mockActivatedRoute } from "src/app/test/helpers/testbed";
import { MyProfileComponent } from "./my-profile.component";

describe("MyProfileComponent", () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let defaultError: ApiErrorDetails;
  let defaultUser: User;

  function configureTestingModule(user: User, error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [MyProfileComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { user: userResolvers.show },
            { user: { model: user, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    const projectApi = TestBed.inject(ProjectsService) as SpyObject<
      ProjectsService
    >;
    const tagApi = TestBed.inject(TagsService) as SpyObject<TagsService>;
    const bookmarkApi = TestBed.inject(BookmarksService) as SpyObject<
      BookmarksService
    >;
    const siteApi = TestBed.inject(ShallowSitesService) as SpyObject<
      ShallowSitesService
    >;
    component = fixture.componentInstance;

    projectApi.list.and.callFake(() => new Subject());
    tagApi.list.and.callFake(() => new Subject());
    bookmarkApi.list.and.callFake(() => new Subject());
    siteApi.list.and.callFake(() => new Subject());

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

  it("should create", () => {
    configureTestingModule(defaultUser, undefined);
    expect(component).toBeTruthy();
  });
});
