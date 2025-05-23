import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { accountResolvers } from "@baw-api/account/accounts.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { User } from "@models/User";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.config";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { TheirEditComponent } from "./their-edit.component";

describe("TheirProfileEditComponent", () => {
  let component: TheirEditComponent;
  let fixture: ComponentFixture<TheirEditComponent>;
  let defaultUser: User;

  function configureTestingModule(model: User, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, TheirEditComponent],
      providers: [
        provideMockBawApi(),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
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

  assertPageInfo(TheirEditComponent, "Edit Profile");

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
