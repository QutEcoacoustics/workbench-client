import { ElementRef } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { LoadingModule } from "@shared/loading/loading.module";
import { assertSpinner } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { DeviceDetectorService } from "ngx-device-detector";
import { BehaviorSubject } from "rxjs";
import { BawClientComponent } from "./baw-client.component";

// TODO Add tests for page input when used
describe("BawClientComponent", () => {
  let isFirefox: boolean;
  let events: BehaviorSubject<NavigationEnd>;
  let config: ConfigService;
  let spec: Spectator<BawClientComponent>;
  const createComponent = createComponentFactory({
    component: BawClientComponent,
    imports: [LoadingModule, RouterTestingModule, MockAppConfigModule],
  });

  function bawClientSource(route: string) {
    const { oldClientOrigin, oldClientDir } = config.endpoints;
    return `${oldClientOrigin}${oldClientDir}${route}`;
  }

  function getIframe(): HTMLIFrameElement {
    return spec.query("iframe");
  }

  function waitForLoad() {
    return new Promise<void>((resolve) =>
      spec.component["iframeRef"].nativeElement.addEventListener("load", () =>
        resolve()
      )
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
    jasmine.clock().install();
    events = undefined;
    spec = createComponent({ detectChanges: false });
    isFirefox = spec.inject(DeviceDetectorService).browser === "Firefox";
    config = spec.inject(ConfigService);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe("sizing", () => {
    it("should calculate iframe height on load", async () => {
      spyOn(spec.component, "updateIframeSize").and.stub();
      spec.detectChanges();
      await waitForLoad();
      spec.detectChanges();
      // It appears that on chromium browsers the interval subject will
      // run once, however this behaviour does not happen on firefox
      expect(spec.component.updateIframeSize).toHaveBeenCalledTimes(
        isFirefox ? 1 : 2
      );
    });

    it("should continuously recalculate height every 250ms", async () => {
      spyOn(spec.component, "updateIframeSize").and.stub();
      spec.detectChanges();
      await waitForLoad();
      spec.detectChanges();
      jasmine.clock().tick(251);
      spec.detectChanges();
      // It appears that on chromium browsers the interval subject will
      // run once, however this behaviour does not happen on firefox
      expect(spec.component.updateIframeSize).toHaveBeenCalledTimes(
        isFirefox ? 2 : 3
      );
    });

    it("should update iframe height on height calculation", () => {
      const dummyIFrame: ElementRef<HTMLIFrameElement> = {
        nativeElement: {
          style: { height: undefined },
          contentDocument: { body: { scrollHeight: 10000 } },
        },
      } as Partial<ElementRef<HTMLIFrameElement>> as any;
      spec.component["iframeRef"] = dummyIFrame;
      spec.component.updateIframeSize();
      expect(dummyIFrame.nativeElement.style.height).toBe("10050px");
    });

    it("should not infinitely update iframe height on height calculation", () => {
      const dummyIFrame: ElementRef<HTMLIFrameElement> = {
        nativeElement: {
          style: { height: undefined },
          contentDocument: { body: { scrollHeight: 10000 } },
        },
      } as Partial<ElementRef<HTMLIFrameElement>> as any;
      spec.component["iframeRef"] = dummyIFrame;
      spec.component.updateIframeSize();
      spec.component.updateIframeSize();
      expect(dummyIFrame.nativeElement.style.height).toBe("10050px");
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
      navigate("/");
      spec.detectChanges();
      await waitForLoad();
      spec.detectChanges();
      assertSpinner(spec.fixture, false);
    });
  });

  describe("old-client", () => {
    it("should load old client in iframe", async () => {
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
