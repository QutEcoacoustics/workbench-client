import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { userResolvers } from "@baw-api/user.service";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { mockActivatedRoute, testBawServices } from "src/app/test.helper";
import { MyProjectsComponent } from "./my-projects.component";

describe("MyProjectsComponent", () => {
  let component: MyProjectsComponent;
  let defaultUser: User;
  let defaultError: ApiErrorDetails;
  let fixture: ComponentFixture<MyProjectsComponent>;

  function configureTestingModule(model?: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      declarations: [MyProjectsComponent],
      imports: [SharedModule, RouterTestingModule],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { account: userResolvers.show },
            { account: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProjectsComponent);
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

  xit("should display username in title", () => {});
  xit("should handle user", () => {});
  xit("should handle user error", () => {});
  xit("should use projects api", () => {});

  xdescribe("table", () => {
    it("should display project name", () => {});
    it("should display project name link", () => {});
    it("should display number of sites", () => {});
    it("should display reader permissions", () => {});
    it("should display writer permissions", () => {});
    it("should display owner permissions", () => {});
    it("should display owner permissions link", () => {});
  });
});
