import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { userResolvers } from "@baw-api/user/user.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.config";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { MyEditComponent } from "./my-edit.component";

describe("MyProfileEditComponent", () => {
  let component: MyEditComponent;
  let fixture: ComponentFixture<MyEditComponent>;
  let defaultUser: User;

  function configureTestingModule(model: User, error?: BawApiError) {
    TestBed.configureTestingModule({
      imports: [
        ...appLibraryImports,
        MyEditComponent,
      ],
      providers: [
        provideMockBawApi(),
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute(
            { user: userResolvers.show },
            { user: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyEditComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  }

  assertPageInfo(MyEditComponent, "Edit My Profile");

  beforeEach(() => {
    // TODO Handle image urls
    defaultUser = new User(generateUser({ imageUrls: undefined }));
  });

  it("should create", () => {
    configureTestingModule(defaultUser);
    expect(component).toBeTruthy();
  });
});
