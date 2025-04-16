import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { FormComponent } from "@shared/form/form.component";
import { testFormlyFields } from "@test/helpers/formly";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { testFormImports, testFormProviders } from "@test/helpers/testbed";
import { ToastService } from "@services/toasts/toasts.service";
import { UnlockAccountComponent } from "./unlock-account.component";
import schema from "./unlock-account.schema.json";

describe("UnlockAccountComponent", () => {
  let component: UnlockAccountComponent;
  let fixture: ComponentFixture<UnlockAccountComponent>;
  let notifications: ToastService;
  const { fields } = schema;

  describe("form", () => {
    testFormlyFields([
      {
        testGroup: "Username/Email Address Input",
        field: fields[0],
        key: "login",
        label: "Username or Email Address",
        type: "input",
        inputType: "text",
        required: true,
      },
    ]);
  });

  describe("component", () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          ...testFormImports,
          MockBawApiModule,
          UnlockAccountComponent,
          FormComponent,
        ],
        providers: testFormProviders,
      }).compileComponents();

      fixture = TestBed.createComponent(UnlockAccountComponent);
      component = fixture.componentInstance;
      notifications = TestBed.inject(ToastService);
      fixture.detectChanges();

      spyOn(notifications, "success").and.stub();
      spyOn(notifications, "error").and.stub();
    });

    assertPageInfo(UnlockAccountComponent, "Unlock Account");

    it("should create", () => {
      expect(component).toBeTruthy();
    });

    // TODO should call api
    xit("should call api", () => {});
  });
});
