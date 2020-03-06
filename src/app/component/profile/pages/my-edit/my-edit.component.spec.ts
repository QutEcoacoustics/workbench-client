import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { User } from "src/app/models/User";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { UserService } from "src/app/services/baw-api/user.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { MyEditComponent } from "./my-edit.component";

describe("MyProfileEditComponent", () => {
  let api: UserService;
  let component: MyEditComponent;
  let fixture: ComponentFixture<MyEditComponent>;
  let defaultError: ApiErrorDetails;
  let defaultUser: User;

  function configureTestingModule(user: User, error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [MyEditComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute({
            user: {
              model: user,
              error
            }
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyEditComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(UserService);

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User({
      id: 1,
      userName: "Username"
    });
    defaultError = {
      status: 401,
      message: "Unauthorized"
    };
  });

  it("should create", () => {
    configureTestingModule(defaultUser, undefined);
    expect(component).toBeTruthy();
  });
});
