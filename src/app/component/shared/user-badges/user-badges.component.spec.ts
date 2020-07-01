import { HttpClientTestingModule } from "@angular/common/http/testing";
import { fakeAsync } from "@angular/core/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { MockModel } from "@baw-api/mock/baseApiMock.service";
import { createHostFactory, Spectator } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { List } from "immutable";
import { BehaviorSubject } from "rxjs";
import { User } from "src/app/models/User";
import { testBawServices } from "src/app/test/helpers/testbed";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { UserBadgesComponent } from "./user-badges.component";

describe("UserBadgesComponent Spec", () => {
  let api: AccountsService;
  let spectator: Spectator<UserBadgesComponent>;
  const createComponent = createHostFactory({
    component: UserBadgesComponent,
    declarations: [UserBadgeComponent], // TODO Replace with ng-mock
    imports: [HttpClientTestingModule],
    providers: testBawServices,
  });

  function getUserBadges() {
    return spectator.queryAll(UserBadgeComponent);
  }

  function interceptApiRequest(user: User) {
    spyOn(api, "show").and.callFake(() => {
      return new BehaviorSubject<User>(user);
    });
  }
  function assertBadgeLabel(badge: UserBadgeComponent, label: string) {
    expect(badge.label).toBe(label);
  }

  function assertBadgeUsers(badge: UserBadgeComponent, users: List<User>) {
    expect(badge.users).toEqual(users);
  }

  beforeEach(() => {
    spectator = createComponent(
      `<app-user-badges [model]="model"></app-user-badges>`
    );
    api = spectator.inject(AccountsService);
  });

  it("should create", () => {
    spectator.setInput("model", new MockModel({ id: 1 }));
    spectator.detectChanges();
    expect(spectator.element).toBeTruthy();
  });

  it("should handle no users", () => {
    spectator.setInput("model", new MockModel({ id: 1 }));
    spectator.component.ngOnChanges();

    const badges = getUserBadges();
    expect(badges.length).toBe(0);
  });

  [
    {
      title: "Created By",
      keys: {
        creatorId: modelData.id(),
        createdAt: modelData.timestamp(),
      },
    },
    {
      title: "Updated By",
      keys: {
        updaterId: modelData.id(),
        updatedBy: modelData.timestamp(),
      },
    },
    {
      title: "Owned By",
      keys: {
        ownerId: modelData.id(),
      },
    },
  ].forEach((userType) => {
    describe(userType.title + " User Badge", () => {
      beforeEach(() => {
        spectator.setInput(
          "model",
          new MockModel({
            id: 1,
            ...userType.keys,
          })
        );
      });

      it("should handle user badge", () => {
        interceptApiRequest(new User(generateUser()));
        spectator.detectChanges();
        expect(getUserBadges().length).toBe(1);
      });

      it("should handle badge title", () => {
        interceptApiRequest(new User(generateUser()));
        spectator.detectChanges();
        assertBadgeLabel(getUserBadges()[0], userType.title);
      });

      it("should handle badge users", () => {
        const user = new User(generateUser());
        interceptApiRequest(user);
        spectator.detectChanges();

        const badges = getUserBadges();
        assertBadgeUsers(badges[0], List([user]));
      });
    });
  });

  it("should handle all badges for project", fakeAsync(() => {
    interceptApiRequest(new User(generateUser()));
    spectator.setInput(
      "model",
      new MockModel({
        id: 1,
        creatorId: modelData.id(),
        createdAt: modelData.timestamp(),
        updaterId: modelData.id(),
        updatedAt: modelData.timestamp(),
        ownerId: modelData.id(),
      })
    );
    spectator.detectChanges();

    expect(getUserBadges().length).toBe(3);
  }));

  it("should use luxon.toRelative to get length of time", () => {
    const model = new MockModel({
      id: 1,
      creatorId: modelData.id(),
      createdAt: modelData.timestamp(),
    });
    (model as any).creatorId = jasmine.createSpy();
    interceptApiRequest(new User(generateUser()));
    spectator.setInput("model", model);
    spectator.detectChanges();

    expect((model as any).creatorId).toHaveBeenCalled();
  });
});
