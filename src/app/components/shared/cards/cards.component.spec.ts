import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import {
  createComponentFactory,
  createHostFactory,
  Spectator,
  SpectatorHost,
  SpectatorOptions,
} from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import { List } from "immutable";
import { CardImageComponent } from "./card-image/card-image.component";
import { CardImageMockModel } from "./card-image/card-image.component.spec";
import { CardsComponent } from "./cards.component";

describe("CardsComponent", () => {
  let defaultModel: CardImageMockModel;
  let spectator: Spectator<CardsComponent>;
  const options: SpectatorOptions<CardsComponent> = {
    component: CardsComponent,
    declarations: [CardImageComponent],
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      AuthenticatedImageModule,
      MockBawApiModule,
    ],
  };
  const createComponent = createComponentFactory(options);
  const createHost = createHostFactory(options);

  function getDefaultCards() {
    return spectator.queryAll("baw-card");
  }

  function getImageCards() {
    return spectator.queryAll("baw-card-image");
  }

  beforeEach(() => {
    defaultModel = new CardImageMockModel({
      id: 1,
      image: modelData.imageUrls(),
    });
  });

  it("should create", () => {
    spectator = createComponent({ detectChanges: false });
    spectator.setInput(
      "cards",
      List([{ title: "title", route: "/broken_link", model: defaultModel }])
    );
    expect(spectator.component).toBeTruthy();
  });

  describe("error handling", () => {
    beforeEach(() => (spectator = createComponent({ detectChanges: false })));

    it("should handle no cards", () => {
      spectator.detectChanges();
      expect(getImageCards().length).toBe(0);
      expect(getDefaultCards().length).toBe(0);
    });

    it("should handle empty cards list", () => {
      spectator.setInput("cards", List([]));
      spectator.detectChanges();
      expect(getImageCards().length).toBe(0);
      expect(getDefaultCards().length).toBe(0);
    });
  });

  describe("cards", () => {
    function assertCard(card: Element, title: string) {
      expect(card.querySelector("h4").textContent).toBe(title);
    }

    beforeEach(() => (spectator = createComponent({ detectChanges: false })));

    it("should create single card", () => {
      spectator.setInput(
        "cards",
        List([{ title: "title", route: "/broken_link", model: defaultModel }])
      );
      spectator.detectChanges();
      expect(getImageCards().length).toBe(1);
    });

    it("should create single card with title", () => {
      spectator.setInput(
        "cards",
        List([
          { title: "custom title", route: "/broken_link", model: defaultModel },
        ])
      );
      spectator.detectChanges();
      assertCard(getImageCards()[0], "custom title");
    });

    it("should create multiple cards", () => {
      const titles = [1, 2, 3].map((id) => ({
        title: "title" + id,
        route: "/broken_link",
        model: defaultModel,
      }));
      spectator.setInput("cards", List(titles));
      spectator.detectChanges();
      expect(getImageCards().length).toBe(3);
    });

    it("should create multiple cards with titles", () => {
      const titles = [1, 2, 3].map((id) => ({
        title: "title" + id,
        route: "/broken_link",
        model: defaultModel,
      }));
      spectator.setInput("cards", List(titles));
      spectator.detectChanges();
      getImageCards().forEach((card, index) => {
        assertCard(card, titles[index].title);
      });
    });
  });

  describe("content", () => {
    let hostSpectator: SpectatorHost<CardsComponent>;

    it("should handle content", () => {
      hostSpectator = createHost(
        "<baw-cards><h1>Internal Content</h1></baw-cards>"
      );
      const content = hostSpectator.query<HTMLDivElement>("#content");
      const header = hostSpectator.query<HTMLHeadingElement>("h1");
      expect(content).not.toHaveStyle({ display: "none" });
      expect(header.textContent).toBe("Internal Content");
    });

    it("should handle no content", () => {
      hostSpectator = createHost("<baw-cards></baw-cards>");
      const content = hostSpectator.query<HTMLDivElement>("#content");
      expect(content).toHaveStyle({ display: "none" });
    });
  });
});
