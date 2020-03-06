import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { User } from "src/app/models/User";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { TheirProfileComponent } from "./their-profile.component";

describe("TheirProfileComponent", () => {
  let component: TheirProfileComponent;
  let fixture: ComponentFixture<TheirProfileComponent>;
  let defaultError: ApiErrorDetails;
  let defaultUser: User;

  function configureTestingModule(user: User, error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [TheirProfileComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute({
            account: {
              model: user,
              error
            }
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TheirProfileComponent);
    component = fixture.componentInstance;
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
