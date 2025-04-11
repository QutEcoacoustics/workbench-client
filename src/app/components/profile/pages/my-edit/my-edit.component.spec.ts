import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { userResolvers } from "@baw-api/user/user.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { appLibraryImports } from "src/app/app.module";
import { MyEditComponent } from "./my-edit.component";

describe("MyProfileEditComponent", () => {
  let component: MyEditComponent;
  let fixture: ComponentFixture<MyEditComponent>;
  let defaultUser: User;

  function configureTestingModule(model: User, error?: BawApiError) {
    TestBed.configureTestingModule({
    imports: [
        ...appLibraryImports,
        SharedModule,
        RouterTestingModule,
        MockBawApiModule,
        MyEditComponent,
    ],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute({ user: userResolvers.show }, { user: { model, error } }),
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
