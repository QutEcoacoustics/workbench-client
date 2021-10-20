import { DomSanitizer } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { modelData } from "@test/helpers/faker";
import { viewports } from "@test/helpers/general";
import { assertSpinner } from "@test/helpers/html";
import { DeviceDetectorService } from "ngx-device-detector";
import { BehaviorSubject } from "rxjs";
import { BawClientComponent } from "./baw-client.component";

// TODO Add tests for components page input if/when used
describe("BawClientComponent", () => {
  let loadClientTimer: NodeJS.Timer;
  let events: BehaviorSubject<NavigationEnd>;
  let config: ConfigService;
  let sanitizer: DomSanitizer;
  let spec: Spectator<BawClientComponent>;
  const createComponent = createComponentFactory({
    component: BawClientComponent,
    imports: [LoadingModule, RouterTestingModule, MockAppConfigModule],
  });

  function bawClientSource(route: string) {
    const { oldClientOrigin, oldClientBase } = config.endpoints;
    return `${oldClientOrigin}${oldClientBase}#${route}`;
  }

  function getIframe(): HTMLIFrameElement {
    return spec.query("iframe");
  }

  function waitForLoad() {
    // Wait for component to finish loading
    return new Promise<void>((resolve) => {
      loadClientTimer = setInterval(() => {
        if (!spec.component.loading) {
          clearInterval(loadClientTimer);
          resolve();
        }
      }, 10);
    });
  }

  function preventLoadingBawClient() {
    spyOn(spec.component, "updateUrl").and.callFake(() => {
      spec.component.url = sanitizer.bypassSecurityTrustResourceUrl(
        "https://broken_link"
      );
    });
  }

  function assertIframeHeight(height: number) {
    // BawClientComponent adds 50 pixels of padding
    const heightWithPadding = height + 50;
    expect(getComputedStyle(getIframe()).height).toBe(heightWithPadding + "px");
  }

  function postMessage(data: any, origin?: string) {
    spec.component["onBawClientMessage"](
      new MessageEvent("window:message", {
        origin: origin ?? config.endpoints.oldClientOrigin,
        data,
      })
    );
  }

  function navigate(url: string) {
    const event = new NavigationEnd(1, url, url);

    if (!events) {
      events = new BehaviorSubject(event);
      spec.component["router"] = { url, events } as Partial<Router> as Router;
    } else {
      events.next(event);
    }
  }

  beforeEach(() => {
    events = undefined;
    spec = createComponent({ detectChanges: false });
    config = spec.inject(ConfigService);
    sanitizer = spec.inject(DomSanitizer);
  });

  afterEach(() => {
    if (loadClientTimer) {
      clearInterval(loadClientTimer);
    }
  });

  describe("error handling", () => {
    beforeEach(() => {
      viewport.set(viewports.small);
      preventLoadingBawClient();
      spec.detectChanges();
    });

    afterEach(() => viewport.reset());

    function assertIframeUnchanged() {
      // 100 is the default size on a small viewport
      assertIframeHeight(100);
    }

    it("should validate origin of message matches baw client", () => {
      postMessage(JSON.stringify({ height: 1000 }), "https://no_match");
      spec.detectChanges();
      assertIframeUnchanged();
    });

    it("should handle post messages containing wrong JSON data", () => {
      postMessage(JSON.stringify({ random: "data" }));
      spec.detectChanges();
      assertIframeUnchanged();
    });

    it("should handle post messages with non JSON values", () => {
      postMessage("this should be ignored");
      spec.detectChanges();
      assertIframeUnchanged();
    });
  });

  describe("sizing", () => {
    it("should calculate iframe height when iframe posts a message", () => {
      preventLoadingBawClient();
      const height = modelData.datatype.number();

      spec.detectChanges();
      postMessage(JSON.stringify({ height }));
      spec.detectChanges();
      assertIframeHeight(height);
    });

    it("should recalculate iframe height whenever iframe posts a message", () => {
      preventLoadingBawClient();
      let height = 0;
      spec.detectChanges();

      for (let i = 0; i < 3; i++) {
        height = modelData.datatype.number();
        postMessage(JSON.stringify({ height }));
        spec.detectChanges();
      }

      assertIframeHeight(height);
    });
  });

  describe("loading", () => {
    it("should handle a browser which does not support iframes", () => {
      spec.detectChanges();
      expect(getIframe()).toContainText(
        "Unfortunately your browser does not support iframes. " +
          "Please ensure you are utilising a common browser which " +
          "is running the most up to date version."
      );
    });

    it("should initially display loading animation", () => {
      spec.detectChanges();
      assertSpinner(spec.fixture, true);
    });

    it("should clear loading animation when content loads", async () => {
      preventLoadingBawClient();
      spec.detectChanges();
      postMessage(JSON.stringify({ height: modelData.datatype.number() }));
      spec.detectChanges();
      assertSpinner(spec.fixture, false);
    });
  });

  describe("old-client", () => {
    // TODO This works locally, but times out on CI
    xit("should load old client in iframe", async () => {
      navigate("/");
      spec.detectChanges();
      await waitForLoad();
      spec.detectChanges();

      expect(getIframe().contentWindow.document.body).toContainText(
        "Client application home page"
      );
    });

    it("should pass url to old client in iframe", () => {
      navigate("/home");
      spec.detectChanges();
      expect(getIframe().src).toBe(bawClientSource("/home"));
    });

    it("should pass updated url parameters to old client on change", () => {
      navigate("/home");
      spec.detectChanges();
      navigate("/house");
      spec.detectChanges();
      expect(getIframe().src).toBe(bawClientSource("/house"));
    });
  });
});
