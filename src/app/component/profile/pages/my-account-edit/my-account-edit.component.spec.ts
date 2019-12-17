import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { FormlyModule } from "@ngx-formly/core";
import { Subject } from "rxjs";
import { testBawServices, validationMessages } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/baw-api/user.service";
import { MyAccountEditComponent } from "./my-account-edit.component";

describe("ProfileEditComponent", () => {
  let api: UserService;
  let component: MyAccountEditComponent;
  let fixture: ComponentFixture<MyAccountEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule,
        FormlyModule.forRoot({
          validationMessages
        })
      ],
      declarations: [MyAccountEditComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(MyAccountEditComponent);
    api = TestBed.get(UserService);
    component = fixture.componentInstance;
    component.schema.model = { edit: {} };
  });

  it("should create", fakeAsync(() => {
    spyOn(api, "getMyAccount").and.callFake(() => {
      const subject = new Subject<User>();

      setTimeout(() => {
        subject.next(
          new User({
            id: 1,
            userName: "username",
            rolesMask: 2,
            rolesMaskNames: ["user"],
            timezoneInformation: null,
            imageUrls: [
              {
                size: "extralarge",
                url: "/images/user/user_span4.png",
                width: 300,
                height: 300
              }
            ],
            lastSeenAt: new Date("2019-12-16T16:21:25.144+10:00"),
            preferences: null
          })
        );
        subject.complete();
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  }));
});
