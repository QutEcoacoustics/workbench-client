import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { theirEditMenuItem } from "@components/profile/profile.menus";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { User } from "@models/User";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateUser } from "@test/fakes/User";
import { assertUrl } from "@test/helpers/html";
import {
  assertPagination,
  datatableApiResponse,
  getDatatableCells,
  getDatatableRows,
} from "@test/helpers/pagedTableTemplate";
import { AdminUserListComponent } from "./user.component";

describe("AdminUserListComponent", () => {
  let api: AccountsService;
  let defaultUser: User;
  let defaultUsers: User[];
  let spec: Spectator<AdminUserListComponent>;
  const createComponent = createComponentFactory({
    component: AdminUserListComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
  });

  beforeEach(function () {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(AccountsService);

    defaultUser = new User(
      generateUser({ id: 1, userName: "username", isConfirmed: false })
    );
    defaultUsers = [];
    for (let id = 0; id < defaultApiPageSize; id++) {
      defaultUsers.push(
        new User(
          generateUser({ id, userName: "user " + id, isConfirmed: false })
        )
      );
    }

    this.defaultModels = defaultUsers;
    this.fixture = spec.fixture;
    this.api = api;
  });

  it("should display number of users in description using paging data", () => {
    datatableApiResponse<User>(api, [defaultUser], { total: 100, maxPage: 4 });
    spec.detectChanges();
    expect(spec.query("p")).toHaveText("Displaying 1 of all 100 users.");
  });

  it("should display number of results in page in description using paging data", () => {
    datatableApiResponse<User>(api, [defaultUser, defaultUser, defaultUser], {
      total: 100,
      maxPage: 4,
    });
    spec.detectChanges();
    expect(spec.query("p")).toHaveText("Displaying 3 of all 100 users.");
  });

  assertPagination<User, AccountsService>();

  describe("rows", () => {
    it("should display username", () => {
      const user = new User({ id: 1, userName: "user 1" });
      datatableApiResponse<User>(api, [user]);
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const usernameCell = getDatatableCells(row)[0];
      expect(usernameCell.innerText.trim()).toBe("user 1");
    });

    it("should handle missing last login data", () => {
      const user = new User(generateUser({ lastSeenAt: undefined }));
      datatableApiResponse<User>(api, [user]);
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const lastLoginCell = getDatatableCells(row)[1];
      expect(lastLoginCell).toHaveText("?");
    });

    it("should call toRelative for lastLogin", () => {
      const user = new User(
        generateUser({ lastSeenAt: "2020-03-09T22:00:50.072+10:00" })
      );
      datatableApiResponse<User>(api, [user]);
      spyOn(user.lastSeenAt, "toRelative").and.callThrough();
      spec.detectChanges();

      expect(user.lastSeenAt.toRelative).toHaveBeenCalled();
    });

    it("should display last login", () => {
      const user = new User(
        generateUser({ lastSeenAt: "2020-03-09T22:00:50.072+10:00" })
      );
      datatableApiResponse<User>(api, [user]);
      spyOn(user.lastSeenAt, "toRelative").and.callFake(() => "testing");
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const lastLoginCell = getDatatableCells(row)[1];
      expect(lastLoginCell.innerText.trim()).toBe("testing");
    });

    it("should display confirmed user", () => {
      const user = new User(generateUser({ isConfirmed: true }));
      datatableApiResponse<User>(api, [user]);
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const isConfirmedCell = getDatatableCells(row)[2];
      const checkbox: HTMLInputElement = isConfirmedCell.querySelector(
        "input[type='checkbox']"
      );

      expect(checkbox.checked).toBeTrue();
      expect(checkbox.disabled).toBeTrue();
    });

    it("should display not confirmed user", () => {
      const user = new User(generateUser({ isConfirmed: false }));
      datatableApiResponse<User>(api, [user]);
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const isConfirmedCell = getDatatableCells(row)[2];
      const checkbox: HTMLInputElement = isConfirmedCell.querySelector(
        "input[type='checkbox']"
      );

      expect(checkbox.checked).toBeFalse();
      expect(checkbox.disabled).toBeTrue();
    });

    it("should display edit button", () => {
      datatableApiResponse<User>(api, [defaultUser]);
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const editCell = getDatatableCells(row)[3];
      const editLink = editCell.querySelector("a");
      expect(editLink).toBeTruthy();
    });
  });

  describe("actions", () => {
    it("should link to user account", () => {
      const user = new User({ id: 5, userName: "username" });
      datatableApiResponse<User>(api, [user]);
      spec.detectChanges();

      const row = getDatatableRows(spec.fixture)[0];
      const usernameCell = getDatatableCells(row)[0];
      const userLink = usernameCell.querySelector("a");
      assertUrl(userLink, "/user_accounts/5");
    });

    it("should link to edit user account", () => {
      const user = new User({ id: 5, userName: "username" });
      datatableApiResponse<User>(api, [user]);
      spec.detectChanges();

      const editLink = spec.queryLast(StrongRouteDirective);
      expect(editLink.strongRoute).toEqual(theirEditMenuItem.route);
      expect(editLink.routeParams).toEqual({ accountId: 5 });
    });
  });
});
