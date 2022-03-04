import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AuthenticatedImageModule } from "@directives/image/image.module";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import {
  createComponentFactory,
  createHostFactory,
  Spectator,
  SpectatorHost,
  SpectatorOptions,
} from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { List } from "immutable";
import { MockComponent } from "ng-mocks";
import { CardComponent } from "../card/card.component";
import { CardsComponent } from "./cards.component";

describe("CardsComponent", () => {
  let defaultProject: Project;
  let defaultRegion: Region;
  let spec: Spectator<CardsComponent>;
  const options: SpectatorOptions<CardsComponent> = {
    component: CardsComponent,
    declarations: [MockComponent(CardComponent)],
    imports: [
      HttpClientTestingModule,
      RouterTestingModule,
      AuthenticatedImageModule,
      MockBawApiModule,
    ],
  };
  const createComponent = createComponentFactory(options);
  const createHost = createHostFactory(options);

  function getCards() {
    return spec.queryAll(CardComponent);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultRegion = new Region(generateRegion());
  });

  it("should create", () => {
    spec = createComponent({ detectChanges: false });
    spec.setInput("models", List([defaultProject]));
    expect(spec.component).toBeTruthy();
  });

  describe("error handling", () => {
    beforeEach(() => {
      spec = createComponent({ detectChanges: false });
    });

    it("should handle no cards", () => {
      spec.detectChanges();
      expect(getCards()).toHaveLength(0);
    });

    it("should handle empty cards list", () => {
      spec.setInput("models", List([]));
      spec.detectChanges();
      expect(getCards()).toHaveLength(0);
    });
  });

  describe("cards", () => {
    beforeEach(() => {
      spec = createComponent({ detectChanges: false });
    });

    it("should create single project card", () => {
      spec.setInput("models", List([defaultProject]));
      spec.detectChanges();
      const cards = getCards();
      expect(cards.length).toBe(1);
      expect(cards[0].model).toEqual(defaultProject);
    });

    it("should create single region card", () => {
      spec.setInput("models", List([defaultRegion]));
      spec.detectChanges();
      const cards = getCards();
      expect(cards.length).toBe(1);
      expect(cards[0].model).toEqual(defaultRegion);
    });

    it("should create multiple cards", () => {
      const models = [defaultProject, defaultRegion];
      spec.setInput("models", List(models));
      spec.detectChanges();
      const cards = getCards();
      expect(cards).toHaveLength(2);
      cards.forEach((card, index) => {
        expect(card.model).toEqual(models[index]);
      });
    });
  });

  describe("content", () => {
    let hostSpectator: SpectatorHost<CardsComponent>;

    it("should handle content", () => {
      hostSpectator = createHost(
        "<baw-model-cards><h1>Internal Content</h1></baw-model-cards>"
      );
      const content = hostSpectator.query<HTMLDivElement>("#content");
      const header = hostSpectator.query<HTMLHeadingElement>("h1");
      expect(content).not.toHaveComputedStyle({ display: "none" });
      expect(header).toContainText("Internal Content");
    });

    it("should handle no content", () => {
      hostSpectator = createHost("<baw-model-cards></baw-model-cards>");
      const content = hostSpectator.query<HTMLDivElement>("#content");
      expect(content).toHaveComputedStyle({ display: "none" });
    });
  });
});
