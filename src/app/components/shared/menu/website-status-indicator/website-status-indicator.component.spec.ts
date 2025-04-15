import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { Spectator, createComponentFactory } from "@ngneat/spectator";
import { ServerTimeout, WebsiteStatus } from "@models/WebsiteStatus";
import { generateWebsiteStatus } from "@test/fakes/WebsiteStatus";
import { assertTooltip } from "@test/helpers/html";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ActivatedRoute } from "@angular/router";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { MockProvider } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { IconsModule } from "@shared/icons/icons.module";
import { WebsiteStatusIndicatorComponent } from "./website-status-indicator.component";

describe("WebsiteStatusIndicatorComponent", () => {
  let spectator: Spectator<WebsiteStatusIndicatorComponent>;
  let mockApi: jasmine.SpyObj<WebsiteStatusService>;
  let mockStatus: BehaviorSubject<WebsiteStatus>;

  const indicatorElement = (): HTMLAnchorElement =>
    spectator.query<HTMLAnchorElement>("a");

  const createComponent = createComponentFactory({
    component: WebsiteStatusIndicatorComponent,
    imports: [MockBawApiModule, IconsModule],
    providers: [
      { provide: ActivatedRoute, useValue: mockActivatedRoute() },
      MockProvider(WebsiteStatusService),
    ],
  });

  function setup(
    websiteStatus: WebsiteStatus = new WebsiteStatus(generateWebsiteStatus())
  ): void {
    spectator = createComponent({ detectChanges: false });

    mockStatus = new BehaviorSubject(websiteStatus);

    mockApi = spectator.inject(WebsiteStatusService);
    mockApi.status$ = mockStatus;

    jasmine.clock().install();

    spectator.detectChanges();
  }

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(WebsiteStatusIndicatorComponent);
  });

  it("should update the status if it changes from good to bad", () => {
    const goodStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "good",
    });

    const badStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "bad",
    });

    setup(goodStatus);

    expect(indicatorElement()).not.toExist();

    mockStatus.next(badStatus);
    spectator.detectChanges();

    expect(indicatorElement()).toExist();
  });

  it("should update the status if it changes from bad to good", () => {
    const goodStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "good",
    });

    const badStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "bad",
    });

    setup(badStatus);

    expect(indicatorElement()).toExist();

    mockStatus.next(goodStatus);
    spectator.detectChanges();

    expect(indicatorElement()).not.toExist();
  });

  it("should not be visible when website is healthy", () => {
    const testStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "good",
    });

    setup(testStatus);

    expect(indicatorElement()).not.toExist();
  });

  it("should be visible when website is unhealthy", () => {
    const testStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "bad",
    });

    setup(testStatus);

    expect(indicatorElement()).toExist();
  });

  it("should have the correct tooltip on hover", () => {
    const testStatus = new WebsiteStatus({
      ...generateWebsiteStatus(),
      status: "bad",
    });

    const expectedTooltip =
      "<< brandLong >> is experiencing a temporary loss of services. Some parts " +
      "of the website may not work.";

    setup(testStatus);

    assertTooltip(indicatorElement(), expectedTooltip);
  });

  it("should be visible if the server does not give a response", () => {
    setup(ServerTimeout.instance);
    expect(indicatorElement()).toExist();
  });
});
