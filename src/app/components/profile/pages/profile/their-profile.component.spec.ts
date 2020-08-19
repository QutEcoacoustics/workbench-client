import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { mockActivatedRoute } from "src/app/test/helpers/testbed";
import { TheirProfileComponent } from "./their-profile.component";

xdescribe("TheirProfileComponent", () => {
  let component: TheirProfileComponent;
  let fixture: ComponentFixture<TheirProfileComponent>;
  let defaultUser: User;

  function configureTestingModule(model: User, error?: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [TheirProfileComponent],
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

    fixture = TestBed.createComponent(TheirProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    defaultUser = new User(generateUser());
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    expect(component).toBeTruthy();
  });
});
