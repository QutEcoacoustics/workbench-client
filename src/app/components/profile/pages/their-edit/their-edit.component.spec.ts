import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { mockActivatedRoute } from "src/app/test/helpers/testbed";
import { TheirEditComponent } from "./their-edit.component";

describe("TheirProfileEditComponent", () => {
  let component: TheirEditComponent;
  let fixture: ComponentFixture<TheirEditComponent>;
  let defaultUser: User;

  function configureTestingModule(model: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [TheirEditComponent],
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

    fixture = TestBed.createComponent(TheirEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User({
      id: 1,
      userName: "Username",
    });
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    expect(component).toBeTruthy();
  });
});
