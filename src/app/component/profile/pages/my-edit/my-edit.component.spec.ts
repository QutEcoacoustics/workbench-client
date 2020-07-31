import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { userResolvers, UserService } from "@baw-api/user/user.service";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { MyEditComponent } from "./my-edit.component";

describe("MyProfileEditComponent", () => {
  let api: UserService;
  let component: MyEditComponent;
  let fixture: ComponentFixture<MyEditComponent>;
  let defaultError: ApiErrorDetails;
  let defaultUser: User;

  function configureTestingModule(user: User, error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [MyEditComponent],
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

    fixture = TestBed.createComponent(MyEditComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(UserService);

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User({
      id: 1,
      userName: "Username",
    });
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
