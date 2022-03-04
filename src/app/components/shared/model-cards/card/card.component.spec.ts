import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { StrongRoute } from "@interfaces/strongRoute";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { PipesModule } from "@pipes/pipes.module";
import { assetRoot } from "@services/config/config.service";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { modelData } from "@test/helpers/faker";
import { assertImage, assertUrl } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { CardComponent } from "./card.component";

// TODO Re-implement tests
xdescribe("CardComponent", () => {
  let spectator: Spectator<CardComponent>;
  const createComponent = createComponentFactory({
    component: CardComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MockBawApiModule,
      DirectivesModule,
      PipesModule,
      AuthenticatedImageModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
  });

  function validateCard<T extends Project | Region>(
    createModel: (data?: any) => T
  ) {
    it("should create", () => {
      spectator.setInput("model", createModel());
      expect(spectator.component).toBeTruthy();
    });

    it("should have title", () => {
      spectator.setInput("model", createModel());
      const title = spectator.query<HTMLHeadingElement>("h4");
      expect(title.textContent).toContain(createModel().name);
    });

    it("should handle local image", () => {
      const baseUrl = `${assetRoot}/broken_link`;
      spectator.setInput(
        "model",
        createModel({ imageUrls: modelData.imageUrls(baseUrl) })
      );

      const image = spectator.query<HTMLImageElement>("img");
      assertImage(
        image,
        `${websiteHttpUrl}${baseUrl}/300/300`,
        "custom title image"
      );
    });

    it("should display remote image", () => {
      const baseUrl = "https://broken_link/broken_link";
      spectator.setInput(
        "model",
        createModel({ imageUrls: modelData.imageUrls(baseUrl) })
      );

      const image = spectator.query<HTMLImageElement>("img");
      assertImage(image, baseUrl + "/300/300", "custom title image");
    });

    it("should have default description when none provided", () => {
      spectator.setInput("model", createModel({ description: undefined }));
      spectator.detectChanges();

      const description = spectator.query(".card-text");
      expect(description.textContent).toContain("No description given");
    });

    it("should have description when provided", () => {
      spectator.setInput("model", createModel({ description: "description" }));
      spectator.detectChanges();

      const description = spectator.query(".card-text");
      expect(description.textContent).toContain("description");
    });

    // TODO Assert truncation styling applies
    xit("should shorten description when description is long", () => {
      spectator.setInput(
        "model",
        createModel({ description: modelData.descriptionLong() })
      );
      spectator.detectChanges();
    });

    it("should have image route when route provided", () => {
      const strongRoute = StrongRoute.newRoot().addFeatureModule(
        modelData.random.word()
      );
      const model = createModel({ route: strongRoute });
      spectator.setInput("model", model);

      const route = spectator.query<HTMLElement>(".card-image a");
      assertUrl(route, model.viewUrl);
    });

    it("should have title route when route provided", () => {
      const strongRoute = StrongRoute.newRoot().addFeatureModule(
        modelData.random.word()
      );
      const model = createModel({ route: strongRoute });
      spectator.setInput("model", model);

      const link = spectator.query<HTMLElement>(".card-title");
      assertUrl(link, model.viewUrl);
    });
  }

  describe("Region", () => {
    validateCard((data) => new Region(generateRegion(data ?? {})));
  });

  describe("Project", () => {
    validateCard((data) => new Project(generateProject(data ?? {})));
  });
});
