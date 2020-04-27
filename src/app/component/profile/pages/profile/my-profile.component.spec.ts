import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { userResolvers } from "@baw-api/user.service";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { MyProfileComponent } from "./my-profile.component";

describe("MyProfileComponent", () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let defaultError: ApiErrorDetails;
  let defaultUser: User;

  function configureTestingModule(user: User, error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [MyProfileComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              user: userResolvers.show,
            },
            {
              user: {
                model: user,
                error,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
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
