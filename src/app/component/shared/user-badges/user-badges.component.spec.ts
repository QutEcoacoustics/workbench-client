import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { BawDateTime } from "@models/AttributeDecorators";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { BehaviorSubject, Subject } from "rxjs";
import { User } from "src/app/models/User";
import { testBawServices } from "src/app/test/helpers/testbed";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { UserBadgesComponent } from "./user-badges.component";

export class MockModel extends AbstractModel {
  public kind = "MockModel";
  public id: Id;
  public creatorId?: Id;
  public updaterId?: Id;
  public ownerId?: Id;
  @BawDateTime()
  public createdAt?: DateTimeTimezone;
  @BawDateTime()
  public updatedAt?: DateTimeTimezone;

  public toJSON() {
    return { id: this.id };
  }

  public get viewUrl(): string {
    return "";
  }
}

describe("UserBadgesComponent Spec", () => {
  let api: AccountsService;
  let spectator: Spectator<UserBadgesComponent>;
  const createComponent = createComponentFactory({
    component: UserBadgesComponent,
    declarations: [UserBadgeComponent],
    imports: [RouterTestingModule, HttpClientTestingModule],
    providers: testBawServices,
  });

  function getUserBadges(): HTMLElement[] {
    return spectator.queryAll("baw-user-badge");
  }

  function interceptApiRequest(user?: User): Promise<any> {
    if (!user) {
      user = new User(generateUser());
    }

    const subject = new Subject<User>();
    const promise = nStepObservable(subject, () => user);
    spyOn(api, "show").and.callFake(() => subject);
    return promise;
  }

  function assertBadgeLabel(badge: HTMLElement, label: string) {
    const labelEl = badge.querySelector("h4");
    expect(labelEl.innerText.trim()).toBe(label);
  }

  function assertBadgeUsers(badge: HTMLElement, userName: string) {
    const usernameEl = badge.querySelector<HTMLAnchorElement>("a#username");
    expect(usernameEl.innerText.trim()).toBe(userName);
  }

  beforeEach(() => {
    spectator = createComponent();
    api = spectator.inject(AccountsService);
  });

  it("should create", () => {
    spectator.setInput("model", new MockModel({ id: 1 }));
    spectator.component.ngOnChanges();
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

      it("should handle user badge", async () => {
        const promise = interceptApiRequest();
        spectator.component.ngOnChanges();
        await promise;
        expect(getUserBadges().length).toBe(1);
      });

      it("should handle badge title", async () => {
        const promise = interceptApiRequest();
        spectator.component.ngOnChanges();
        await promise;
        assertBadgeLabel(getUserBadges()[0], userType.title);
      });

      it("should handle badge users", async () => {
        const user = new User(generateUser());
        const promise = interceptApiRequest(user);
        spectator.component.ngOnChanges();
        await promise;

        assertBadgeUsers(getUserBadges()[0], user.userName);
      });
    });
  });

  it("should handle all badge types", async () => {
    const promise = interceptApiRequest();
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
    spectator.component.ngOnChanges();
    await promise;

    expect(getUserBadges().length).toBe(3);
  });

  // TODO Implement test to verify badges are in order
  xit("should display all badge types in order", () => {});

  it("should use luxon.toRelative to get length of time", async () => {
    const model = new MockModel({
      id: 1,
      creatorId: modelData.id(),
      createdAt: modelData.timestamp(),
    });
    spyOn(model.createdAt, "toRelative").and.callFake(() => "");
    const promise = interceptApiRequest();
    spectator.setInput("model", model);
    spectator.component.ngOnChanges();
    await promise;

    expect(model.createdAt.toRelative).toHaveBeenCalled();
  });
});
