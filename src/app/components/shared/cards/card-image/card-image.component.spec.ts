import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { Id, ImageUrl } from "@interfaces/apiInterfaces";
import { AbstractModel } from "@models/AbstractModel";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { assetRoot } from "@services/config/config.service";
import { modelData } from "@test/helpers/faker";
import {
  assertHref,
  assertImage,
  assertRoute,
  assertTruncation,
} from "@test/helpers/html";
import { websiteHttpUrl } from "@test/helpers/url";
import { LineTruncationLibModule } from "ngx-line-truncation";
import { Card } from "../cards.component";
import { CardImageComponent } from "./card-image.component";

export class CardImageMockModel extends AbstractModel {
  public readonly id: Id = 1;
  public readonly image: ImageUrl[];

  public constructor(data: { id?: Id; image: ImageUrl[] }) {
    super(data);
  }

  public get viewUrl(): string {
    throw new Error("Method not implemented.");
  }
}

describe("CardImageComponent", () => {
  let defaultCard: Card;
  let spectator: Spectator<CardImageComponent>;
  const createComponent = createComponentFactory({
    component: CardImageComponent,
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      MockBawApiModule,
      AuthenticatedImageModule,
      LineTruncationLibModule,
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ detectChanges: false });
    defaultCard = {
      title: "title",
      model: new CardImageMockModel({ id: 1, image: modelData.imageUrls() }),
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
      title: "custom title",
      model: new CardImageMockModel({ image: modelData.imageUrls(baseUrl) }),
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
      title: "custom title",
      model: new CardImageMockModel({ image: modelData.imageUrls(baseUrl) }),
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

  it("should shorten description when description is long", () => {
    spectator.setInput("card", {
      ...defaultCard,
      description: modelData.descriptionLong(),
    });
    spectator.detectChanges();

    const description = spectator.query<HTMLParagraphElement>(".card-text");
    assertTruncation(description, 4);
  });

  it("should have image href when link provided", () => {
    spectator.setInput("card", { ...defaultCard, link: "https://link/" });

    const link = spectator.query("a img").parentElement as HTMLAnchorElement;
    assertHref(link, "https://link/");
  });

  it("should have title href when link provided", () => {
    spectator.setInput("card", {
      ...defaultCard,
      title: "title",
      link: "https://link/",
    });

    const link = spectator.query<HTMLAnchorElement>("h4 a");
    assertHref(link, "https://link/");
  });

  it("should have image route when route provided", () => {
    spectator.setInput("card", { ...defaultCard, route: "/broken_link" });

    const route = spectator.query("a img").parentElement as HTMLAnchorElement;
    assertRoute(route, "/broken_link");
  });

  it("should have title route when route provided", () => {
    spectator.setInput("card", {
      ...defaultCard,
      title: "title",
      route: "/broken_link",
    });

    const link = spectator.query<HTMLAnchorElement>("h4 a");
    assertRoute(link, "/broken_link");
  });
});
