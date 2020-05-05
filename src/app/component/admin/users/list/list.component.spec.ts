import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountService } from "@baw-api/account.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { Filters } from "@baw-api/baw-api.service";
import { User } from "@models/User";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { SharedModule } from "@shared/shared.module";
import { BehaviorSubject, Subject } from "rxjs";
import { appLibraryImports } from "src/app/app.module";
import { testBawServices } from "src/app/test/helpers/testbed";
import { AdminUserListComponent } from "./list.component";

describe("AdminUserListComponent", () => {
  let fixture: ComponentFixture<AdminUserListComponent>;
  let api: AccountService;
  let defaultUser: User;
  let defaultUsers: User[];
  let defaultPaging: {
    page: number;
    items: number;
    total: number;
    maxPage: number;
  };

  function apiResponse(
    users: User[],
    paging?: { page: number; items: number; total: number; maxPage: number }
  ) {
    if (!paging) {
      paging = {
        page: 1,
        items: 25,
        total: users.length,
        maxPage: 1,
      };
    }

    users.forEach((user) => {
      user.addMetadata({
        message: "OK",
        status: 200,
        paging,
      });
    });

    spyOn(api, "filter").and.callFake(() => {
      return new BehaviorSubject<User[]>(users);
    });
  }

  function apiErrorResponse(error: ApiErrorDetails) {
    spyOn(api, "filter").and.callFake(() => {
      const subject = new Subject<User[]>();
      subject.error(error);
      return subject;
    });
  }

  function getRows() {
    return fixture.nativeElement.querySelectorAll("datatable-body-row");
  }

  function getCells(row: any) {
    return row.querySelectorAll("datatable-body-cell");
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUserListComponent],
      imports: [SharedModule, RouterTestingModule, ...appLibraryImports],
      providers: [...testBawServices],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserListComponent);
    api = TestBed.inject(AccountService);

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
    defaultPaging = {
      page: 1,
      items: 25,
      total: 1,
      maxPage: 1,
    };
  });

  it("should display number of users in description using paging data", () => {
    apiResponse([defaultUser], {
      page: 1,
      items: 25,
      total: 100,
      maxPage: 4,
    });
    fixture.detectChanges();

    const description = fixture.nativeElement.querySelector("p");
    expect(description.innerText.trim()).toBe("Displaying all 100 user/s");
  });

  describe("api", () => {
    function secondApiResponse(done: any, expectation: any) {
      let counter = 0;
      const user = new User({
        id: 1,
        userName: "user",
      });
      const paging = {
        page: 1,
        items: 25,
        total: 100,
        maxPage: 4,
      };
      user.addMetadata({
        message: "OK",
        status: 200,
        paging,
      });
      spyOn(api, "filter").and.callFake((filter: Filters) => {
        if (counter === 1) {
          expect(filter).toEqual(expectation);
          done();
        } else {
          counter++;
        }

        return new BehaviorSubject<User[]>([user]);
      });
    }

    /**
     * Click button after a period of time. This is to allow the
     * first response to complete before sending a second request.
     * @param button Button Element
     */
    function click(button: HTMLButtonElement) {
      setTimeout(() => {
        button.click();
        fixture.detectChanges();
      }, 1);
    }

    it("should send filter request", () => {
      apiResponse([]);
      fixture.detectChanges();
      expect(api.filter).toHaveBeenCalledWith({});
    });

    it("should request the second page from api", (done) => {
      secondApiResponse(done, { paging: { page: 2 } });
      fixture.detectChanges();

      const pageBtn = fixture.nativeElement.querySelectorAll("li.pages a")[1];
      click(pageBtn);
    });

    it("should request next page from api", (done) => {
      secondApiResponse(done, { paging: { page: 2 } });
      fixture.detectChanges();

      const pager = fixture.nativeElement.querySelector("datatable-pager");
      const pageBtn = pager.querySelectorAll("li a")[6];
      click(pageBtn);
    });

    it("should request final page from api", (done) => {
      secondApiResponse(done, { paging: { page: 4 } });
      fixture.detectChanges();

      const pager = fixture.nativeElement.querySelector("datatable-pager");
      const pageBtn = pager.querySelectorAll("li a")[7];
      click(pageBtn);
    });

    it("should handle api request failure", () => {
      apiErrorResponse({ status: 401, message: "Unauthorized" });
      fixture.detectChanges();

      const errorHandler: ErrorHandlerComponent = fixture.debugElement.query(
        By.css("app-error-handler")
      ).componentInstance;
      expect(errorHandler).toBeTruthy();

      expect(errorHandler.error).toEqual({
        status: 401,
        message: "Unauthorized",
      });
    });
  });

  describe("datatable pages", () => {
    function hasPager() {
      return !fixture.nativeElement.querySelector("datatable-pager").hidden;
    }
    function getPagerButtons() {
      return fixture.nativeElement.querySelectorAll("datatable-pager li");
    }

    it("should handle no users", () => {
      apiResponse([]);
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(0);
      expect(hasPager()).toBeFalse();
    });

    it("should handle single user", () => {
      apiResponse([defaultUser], defaultPaging);
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(1);
      expect(hasPager()).toBeFalse();
    });

    it("should handle 25 users", () => {
      apiResponse(defaultUsers, {
        page: 1,
        items: 25,
        total: 25,
        maxPage: 1,
      });
      fixture.detectChanges();

      const rows = getRows();
      expect(rows.length).toBe(25);
      expect(hasPager()).toBeFalse();
    });

    it("should handle 100 users", () => {
      apiResponse(defaultUsers, {
        page: 1,
        items: 25,
        total: 100,
        maxPage: 4,
      });
      fixture.detectChanges();

      const rows = getRows();
      const pager = getPagerButtons();
      expect(rows.length).toBe(25);
      expect(hasPager()).toBeTrue();
      expect(pager.length).toBe(8);
    });
  });

  describe("datatable row", () => {
    it("should display username", () => {
      const user = new User({
        id: 1,
        userName: "user 1",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const usernameCell = getCells(row)[0];

      expect(usernameCell.innerText.trim()).toBe("user 1");
    });

    it("should handle missing last login data", () => {
      const user = new User({
        id: 1,
        userName: "username",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const lastLoginCell = getCells(row)[1];

      expect(lastLoginCell.innerText.trim()).toBe("?");
    });

    it("should call toRelative for lastLogin", () => {
      const user = new User({
        id: 1,
        userName: "username",
        lastSeenAt: "2020-03-09T22:00:50.072+10:00",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      spyOn(user.lastSeenAt, "toRelative").and.callThrough();
      fixture.detectChanges();

      expect(user.lastSeenAt.toRelative).toHaveBeenCalled();
    });

    it("should display last login", () => {
      const user = new User({
        id: 1,
        userName: "username",
        lastSeenAt: "2020-03-09T22:00:50.072+10:00",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      spyOn(user.lastSeenAt, "toRelative").and.callFake(() => "testing");
      fixture.detectChanges();

      const row = getRows()[0];
      const lastLoginCell = getCells(row)[1];

      expect(lastLoginCell.innerText.trim()).toBe("testing");
    });

    it("should display confirmed user", () => {
      const user = new User({
        id: 1,
        userName: "username",
        isConfirmed: true,
      });
      apiResponse([user], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const isConfirmedCell = getCells(row)[2];
      const checkbox: HTMLInputElement = isConfirmedCell.querySelector(
        "input[type='checkbox']"
      );

      expect(checkbox.checked).toBeTrue();
      expect(checkbox.disabled).toBeTrue();
    });

    it("should display not confirmed user", () => {
      const user = new User({
        id: 1,
        userName: "username",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const isConfirmedCell = getCells(row)[2];
      const checkbox: HTMLInputElement = isConfirmedCell.querySelector(
        "input[type='checkbox']"
      );

      expect(checkbox.checked).toBeFalse();
      expect(checkbox.disabled).toBeTrue();
    });

    it("should display edit button", () => {
      apiResponse([defaultUser], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const editCell = getCells(row)[3];
      const editLink = editCell.querySelector("a");

      expect(editLink).toBeTruthy();
    });
  });

  describe("actions", () => {
    it("should link to user account", () => {
      const user = new User({
        id: 5,
        userName: "username",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const usernameCell = getCells(row)[0];
      const userLink = usernameCell.querySelector("a");

      expect(
        userLink.attributes.getNamedItem("ng-reflect-router-link").value
      ).toBe("/user_accounts/5");
    });

    it("should link to edit user account", () => {
      const user = new User({
        id: 5,
        userName: "username",
        isConfirmed: false,
      });
      apiResponse([user], defaultPaging);
      fixture.detectChanges();

      const row = getRows()[0];
      const editCell = getCells(row)[3];
      const editLink = editCell.querySelector("a");

      expect(
        editLink.attributes.getNamedItem("ng-reflect-router-link").value
      ).toBe("/user_accounts/5/edit");
    });
  });
});
