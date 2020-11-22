import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot } from "@services/app-config/app-config.service";
import { SharedModule } from "@shared/shared.module";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { generateSite } from "@test/fakes/Site";
import { assertImage, assertRoute } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { SiteCardComponent } from "./site-card.component";

describe("SiteCardComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let defaultSite: Site;
  let spectator: Spectator<SiteCardComponent>;
  const createComponent = createComponentFactory({
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
    component: SiteCardComponent,
  });

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
    defaultSite = new Site(generateSite());
  });

  function setup(site?: Site | boolean, region?: Region | boolean) {
    spectator = createComponent({
      detectChanges: false,
      props: {
        project: defaultProject,
        site: site ? (site instanceof Site ? site : defaultSite) : undefined,
        region: region
          ? region instanceof Region
            ? region
            : defaultRegion
          : undefined,
      },
    });
  }

  it("should create", () => {
    setup(true);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  describe("title", () => {
    it("should display site name", () => {
      setup(true);
      spectator.detectChanges();
      const name = spectator.query<HTMLHeadingElement>("h5#name");
      expect(name).toBeTruthy();
      expect(name.innerText).toContain(defaultSite.name);
    });

    it("should navigate user to site when clicking site name", () => {
      setup(true);
      spectator.detectChanges();
      const name = spectator.query<HTMLAnchorElement>("#nameLink");
      assertRoute(name, defaultSite.getViewUrl(defaultProject));
    });
  });

  describe("image", () => {
    function getImage() {
      return spectator.query<HTMLImageElement>("img");
    }

    function getImageLink() {
      return spectator.query<HTMLAnchorElement>("#imageLink");
    }

    it("should display site image", () => {
      const site = new Site({ ...generateSite(), imageUrl: undefined });
      setup(site);
      spectator.detectChanges();

      assertImage(
        getImage(),
        `${websiteHttpUrl}${assetRoot}/images/site/site_span4.png`,
        `${site.name} alt`
      );
    });

    it("should display custom site image", () => {
      setup(true);
      spectator.detectChanges();
      assertImage(getImage(), defaultSite.imageUrl, `${defaultSite.name} alt`);
    });

    it("should navigate user to site when clicking site image", () => {
      setup(true);
      spectator.detectChanges();
      assertRoute(getImageLink(), defaultSite.getViewUrl(defaultProject));
    });
  });

  const inputTypes = [
    {
      modelType: "site",
      setup: () => setup(true),
      play: true,
    },
    {
      modelType: "region",
      setup: () => setup(false, true),
      play: false,
    },
  ];

  inputTypes.forEach((inputType) => {
    function getButtons() {
      return {
        details: spectator.query<HTMLButtonElement>("#details"),
        play: spectator.query<HTMLButtonElement>("#play"),
        visualize: spectator.query<HTMLButtonElement>("#visualize"),
      };
    }

    function assertButton(button: HTMLButtonElement, text: string) {
      expect(button.innerText.trim()).toBe(text);
    }

    describe(inputType.modelType + " buttons", () => {
      beforeEach(() => {
        inputType.setup();
        spectator.detectChanges();
      });

      it("should display details button", () => {
        assertButton(getButtons().details, "Details");
      });

      it("should navigate user to site when clicking details button", () => {
        assertRoute(
          getButtons().details,
          spectator.component.model.getViewUrl(defaultProject)
        );
      });

      if (inputType.play) {
        it("should display play button if site model", () => {
          assertButton(getButtons().play, "Play");
        });

        xit("should navigate user to listen page when clicking play button", () => {});
      } else {
        it("should not display play button", () => {
          expect(getButtons().play).toBeFalsy();
        });
      }

      it("should display visualize button", () => {
        assertButton(getButtons().visualize, "Visualise");
      });

      xit("should navigate user to visualizer page when clicking play button", () => {});
    });
  });

  describe("points", () => {
    function getPoints() {
      return spectator.query<HTMLSpanElement>("span.badge");
    }

    it("should not display if site model", () => {
      setup(true);
      spectator.detectChanges();
      expect(getPoints()).toBeFalsy();
    });

    it("should display 0 region points", () => {
      const region = new Region({ ...generateRegion(), siteIds: undefined });
      setup(false, region);
      spectator.detectChanges();
      expect(getPoints().innerText.trim()).toBe("0 Points");
    });

    it("should display multiple region points", () => {
      const region = new Region({ ...generateRegion(), siteIds: [1, 2, 3] });
      setup(false, region);
      spectator.detectChanges();
      expect(getPoints().innerText.trim()).toBe("3 Points");
    });
  });
});
