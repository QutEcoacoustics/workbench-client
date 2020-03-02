import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { SharedModule } from "src/app/component/shared/shared.module";
import { User } from "src/app/models/User";
import { UserService } from "src/app/services/baw-api/user.service";
import { testBawServices } from "src/app/test.helper";
import { MyEditComponent } from "./my-edit.component";

xdescribe("MyProfileEditComponent", () => {
  let api: UserService;
  let component: MyEditComponent;
  let fixture: ComponentFixture<MyEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [...appLibraryImports, SharedModule, RouterTestingModule],
      declarations: [MyEditComponent],
      providers: [...testBawServices]
    }).compileComponents();

    fixture = TestBed.createComponent(MyEditComponent);
    api = TestBed.inject(UserService);
    component = fixture.componentInstance;
    component.schema.model = { edit: { name: "" } };
  });

  it("should create", fakeAsync(() => {
    spyOn(api, "show").and.callFake(() => {
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
            lastSeenAt: "2019-12-16T16:21:25.144+10:00",
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
