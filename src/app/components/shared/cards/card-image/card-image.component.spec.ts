import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { DirectivesModule } from "@directives/directives.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { Id, ImageUrl } from "@interfaces/apiInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
import { AbstractModel } from "@models/AbstractModel";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot } from "@services/config/config.service";
import { modelData } from "@test/helpers/faker";
import { assertImage, assertUrl } from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { Card } from "../cards.component";
import { CardImageComponent } from "./card-image.component";

export class CardImageMockModel extends AbstractModel {
  public readonly id: Id = 1;
  public readonly imageUrls: ImageUrl[];

  public constructor(data: { id?: Id; imageUrls: ImageUrl[] }) {
    super(data);
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

describe("CardImageComponent", () => {
  let defaultCard: Card;
  let defaultRoute: string;
  let spectator: Spectator<CardImageComponent>;
  const createComponent = createComponentFactory({
    component: CardImageComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MockBawApiModule,
      DirectivesModule,
      AuthenticatedImageModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    defaultRoute = StrongRoute.newRoot().add("broken").toRouterLink();
    defaultCard = {
      title: "title",
      route: defaultRoute,
      model: new CardImageMockModel({
        id: 1,
        imageUrls: modelData.imageUrls(),
      }),
    };
  });

  it("should create", () => {
    spectator.setInput("card", defaultCard);
    expect(spectator.component).toBeTruthy();
  });

  it("should have title", () => {
    spectator.setInput("card", {
      ...defaultCard,
      title: "custom title",
    });

    const title = spectator.query<HTMLHeadingElement>("h4");
    expect(title.textContent).toContain("custom title");
  });

  it("should handle local image", () => {
    const baseUrl = `${assetRoot}/broken_link`;
    spectator.setInput("card", {
      ...defaultCard,
      title: "custom title",
      model: new CardImageMockModel({
        imageUrls: modelData.imageUrls(baseUrl),
      }),
    });

    const image = spectator.query<HTMLImageElement>("img");
    assertImage(
      image,
      `${websiteHttpUrl}${baseUrl}/300/300`,
      "custom title image"
    );
  });

  it("should display remote image", () => {
    const baseUrl = "https://broken_link/broken_link";
    spectator.setInput("card", {
      ...defaultCard,
      title: "custom title",
      model: new CardImageMockModel({
        imageUrls: modelData.imageUrls(baseUrl),
      }),
    });

    const image = spectator.query<HTMLImageElement>("img");
    assertImage(image, baseUrl + "/300/300", "custom title image");
  });

  it("should have default description when none provided", () => {
    spectator.setInput("card", { ...defaultCard, description: undefined });
    spectator.detectChanges();

    const description = spectator.query(".card-text");
    expect(description.textContent).toContain("No description given");
  });

  it("should have description when provided", () => {
    spectator.setInput("card", { ...defaultCard, description: "description" });
    spectator.detectChanges();

    const description = spectator.query(".card-text");
    expect(description.textContent).toContain("description");
  });

  // TODO Assert truncation styling applies
  xit("should shorten description when description is long", () => {
    spectator.setInput("card", {
      ...defaultCard,
      description: modelData.descriptionLong(),
    });
    spectator.detectChanges();
  });

  it("should have image route when route provided", () => {
    spectator.setInput("card", { ...defaultCard, route: defaultRoute });

    const route = spectator.query<HTMLElement>(".card-image a");
    assertUrl(route, defaultRoute);
  });

  it("should have title route when route provided", () => {
    spectator.setInput("card", {
      ...defaultCard,
      title: "title",
      route: defaultRoute,
    });

    const link = spectator.query<HTMLElement>(".card-title");
    assertUrl(link, defaultRoute);
  });
});
