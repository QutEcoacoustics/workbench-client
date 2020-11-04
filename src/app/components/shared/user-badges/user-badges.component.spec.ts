import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { BawDateTime } from "@models/AttributeDecorators";
import { User } from "@models/User";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { LoadingModule } from "@shared/loading/loading.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { nStepObservable } from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { Subject } from "rxjs";
import { UserBadgeComponent } from "./user-badge/user-badge.component";
import { UserBadgesComponent } from "./user-badges.component";

class MockModel extends AbstractModel {
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
  let api: SpyObject<AccountsService>;
  let spectator: Spectator<UserBadgesComponent>;
  const createComponent = createComponentFactory({
    component: UserBadgesComponent,
    declarations: [UserBadgeComponent],
    imports: [
      RouterTestingModule,
      HttpClientTestingModule,
      LoadingModule,
      AuthenticatedImageModule,
      MockBawApiModule,
    ],
  });

  function getUserBadges(): HTMLElement[] {
    return spectator.queryAll("baw-user-badge");
  }

  function interceptApiRequest(
    user?: User,
    error?: ApiErrorDetails
  ): Promise<any> {
    user = user ?? new User(generateUser());

    const subject = new Subject<User>();
    const promise = nStepObservable(
      subject,
      () => (error ? error : user),
      !!error
    );
    api.show.and.callFake(() => subject);
    return promise;
  }

  function assertBadgeLabel(badge: HTMLElement, label: string) {
    const labelEl = badge.querySelector("h4");
    expect(labelEl.innerText.trim()).toBe(label);
  }

  function assertBadgeUser(badge: HTMLElement, userName: string) {
    const usernameEl = badge.querySelector<HTMLAnchorElement>("a#username");
    expect(usernameEl.innerText.trim()).toBe(userName);
  }

  function assertGhostUser(badge: HTMLElement) {
    const ghostEl = badge.querySelector<HTMLAnchorElement>("p#notFound");
    expect(ghostEl.innerText.trim()).toBe("User not found");
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
      keys: { ownerId: modelData.id() },
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

      it("should display user badge", async () => {
        const promise = interceptApiRequest();
        spectator.component.ngOnChanges();
        await promise;
        expect(getUserBadges().length).toBe(1);
      });

      it("should display loading animation", async () => {
        api.show.and.callFake(() => new Subject());
        spectator.component.ngOnChanges();
        assertSpinner(spectator.fixture, true);
      });

      it("should clear loading animation", async () => {
        const promise = interceptApiRequest();
        spectator.component.ngOnChanges();
        await promise;
        assertSpinner(spectator.fixture, false);
      });

      it("should clear loading animation after api error", async () => {
        const promise = interceptApiRequest(undefined, {
          status: 404,
          message: "Not Found",
        });
        spectator.component.ngOnChanges();
        await promise;
        assertSpinner(spectator.fixture, false);
      });

      it("should display badge title", async () => {
        const promise = interceptApiRequest();
        spectator.component.ngOnChanges();
        await promise;
        assertBadgeLabel(getUserBadges()[0], userType.title);
      });

      it("should display badge username", async () => {
        const user = new User(generateUser());
        const promise = interceptApiRequest(user);
        spectator.component.ngOnChanges();
        await promise;

        assertBadgeUser(getUserBadges()[0], user.userName);
      });

      it("should display badge title on api error", async () => {
        const promise = interceptApiRequest(
          undefined,
          generateApiErrorDetails("Not Found")
        );
        spectator.component.ngOnChanges();
        await promise;

        assertBadgeLabel(getUserBadges()[0], userType.title);
      });

      it("should display ghost user on api error", async () => {
        const promise = interceptApiRequest(
          undefined,
          generateApiErrorDetails("Not Found")
        );
        spectator.component.ngOnChanges();
        await promise;

        assertGhostUser(getUserBadges()[0]);
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

  it("should display all badge types in order", async () => {
    let count = 0;
    const subjects = [1, 2, 3].map(() => new Subject<User>());
    const promise = Promise.all(
      subjects.map((subject) =>
        nStepObservable(
          subject,
          () => new User(generateUser()),
          false,
          modelData.random.number(3)
        )
      )
    );
    api.show.and.callFake(() => subjects[count++]);

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

    const userBadges = getUserBadges();
    assertBadgeLabel(userBadges[0], "Created By");
    assertBadgeLabel(userBadges[1], "Updated By");
    assertBadgeLabel(userBadges[2], "Owned By");
  });

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
