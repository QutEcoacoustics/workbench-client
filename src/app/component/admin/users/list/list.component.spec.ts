import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { User } from "@models/User";
import { SharedModule } from "@shared/shared.module";
import { appLibraryImports } from "src/app/app.module";
import { assertRoute } from "src/app/test/helpers/html";
import {
  assertPagination,
  datatableApiResponse,
  getDatatableCells,
  getDatatableRows,
} from "src/app/test/helpers/pagedTableTemplate";
import { testBawServices } from "src/app/test/helpers/testbed";
import { AdminUserListComponent } from "./list.component";

describe("AdminUserListComponent", () => {
  let api: AccountsService;
  let defaultUser: User;
  let defaultUsers: User[];
  let fixture: ComponentFixture<AdminUserListComponent>;

  beforeEach(async(function () {
    TestBed.configureTestingModule({
      declarations: [AdminUserListComponent],
      imports: [SharedModule, RouterTestingModule, ...appLibraryImports],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(function () {
    fixture = TestBed.createComponent(AdminUserListComponent);
    api = TestBed.inject(AccountsService);

    defaultUser = new User({
      id: 1,
      userName: "username",
      isConfirmed: false,
    });
    defaultUsers = [];
    for (let i = 0; i < 25; i++) {
      defaultUsers.push(
        new User({
          id: i,
          userName: "user " + i,
          isConfirmed: false,
        })
      );
    }

    this.defaultModels = defaultUsers;
    this.fixture = fixture;
    this.api = api;
  });

  it("should display number of users in description using paging data", () => {
    datatableApiResponse<User>(api, [defaultUser], { total: 100, maxPage: 4 });
    fixture.detectChanges();

    const description = fixture.nativeElement.querySelector("p");
    expect(description.innerText.trim()).toBe("Displaying all 100 user/s");
  });

  assertPagination<User, AccountsService>();

  describe("rows", () => {
    it("should display username", () => {
      const user = new User({ id: 1, userName: "user 1" });
      datatableApiResponse<User>(api, [user]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const usernameCell = getDatatableCells(row)[0];
      expect(usernameCell.innerText.trim()).toBe("user 1");
    });

    it("should handle missing last login data", () => {
      const user = new User({ ...defaultUser, lastSeenAt: undefined });
      datatableApiResponse<User>(api, [user]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const lastLoginCell = getDatatableCells(row)[1];
      expect(lastLoginCell.innerText.trim()).toBe("?");
    });

    it("should call toRelative for lastLogin", () => {
      const user = new User({
        ...defaultUser,
        lastSeenAt: "2020-03-09T22:00:50.072+10:00",
      });
      datatableApiResponse<User>(api, [user]);
      spyOn(user.lastSeenAt, "toRelative").and.callThrough();
      fixture.detectChanges();

      expect(user.lastSeenAt.toRelative).toHaveBeenCalled();
    });

    it("should display last login", () => {
      const user = new User({
        ...defaultUser,
        lastSeenAt: "2020-03-09T22:00:50.072+10:00",
      });
      datatableApiResponse<User>(api, [user]);
      spyOn(user.lastSeenAt, "toRelative").and.callFake(() => "testing");
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const lastLoginCell = getDatatableCells(row)[1];
      expect(lastLoginCell.innerText.trim()).toBe("testing");
    });

    it("should display confirmed user", () => {
      const user = new User({ ...defaultUser, isConfirmed: true });
      datatableApiResponse<User>(api, [user]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const isConfirmedCell = getDatatableCells(row)[2];
      const checkbox: HTMLInputElement = isConfirmedCell.querySelector(
        "input[type='checkbox']"
      );

      expect(checkbox.checked).toBeTrue();
      expect(checkbox.disabled).toBeTrue();
    });

    it("should display not confirmed user", () => {
      const user = new User({ ...defaultUser, isConfirmed: false });
      datatableApiResponse<User>(api, [user]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const isConfirmedCell = getDatatableCells(row)[2];
      const checkbox: HTMLInputElement = isConfirmedCell.querySelector(
        "input[type='checkbox']"
      );

      expect(checkbox.checked).toBeFalse();
      expect(checkbox.disabled).toBeTrue();
    });

    it("should display edit button", () => {
      datatableApiResponse<User>(api, [defaultUser]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const editCell = getDatatableCells(row)[3];
      const editLink = editCell.querySelector("a");
      expect(editLink).toBeTruthy();
    });
  });

  describe("actions", () => {
    it("should link to user account", () => {
      const user = new User({ id: 5, userName: "username" });
      datatableApiResponse<User>(api, [user]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const usernameCell = getDatatableCells(row)[0];
      const userLink = usernameCell.querySelector("a");
      assertRoute(userLink, "/user_accounts/5");
    });

    it("should link to edit user account", () => {
      const user = new User({ id: 5, userName: "username" });
      datatableApiResponse<User>(api, [user]);
      fixture.detectChanges();

      const row = getDatatableRows(fixture)[0];
      const editCell = getDatatableCells(row)[3];
      const editLink = editCell.querySelector("a");
      assertRoute(editLink, "/user_accounts/5/edit");
    });
  });
});
