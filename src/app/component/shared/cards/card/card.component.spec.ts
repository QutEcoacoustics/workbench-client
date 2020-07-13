import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { assertHref, assertRoute } from "@test/helpers/html";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let spectator: SpectatorRouting<CardComponent>;
  const createComponent = createRoutingFactory(CardComponent);

  beforeEach(() => (spectator = createComponent({ detectChanges: false })));

  it("should create", () => {
    spectator.setInput("card", { title: "title" });
    expect(spectator.component).toBeTruthy();
  });

  it("should have title", () => {
    spectator.setInput("card", { title: "title" });

    const title = spectator.query<HTMLHeadingElement>("h4");
    expect(title.textContent).toContain("title");
  });

  it("should create title without link", () => {
    spectator.setInput("card", { title: "title" });

    const links = spectator.queryAll<HTMLAnchorElement>("a");
    expect(links.length).toBe(0);
  });

  it("should have default description when none provided", () => {
    spectator.setInput("card", { title: "title" });

    const description = spectator.query<HTMLParagraphElement>("p");
    expect(description.textContent).toContain("No description given");
  });

  it("should have description when provided", () => {
    spectator.setInput("card", { title: "title", description: "description" });

    const description = spectator.query<HTMLParagraphElement>("p");
    expect(description.textContent).toContain("description");
  });

  it("should create href link", () => {
    spectator.setInput("card", { title: "title", link: "https://brokenlink/" });

    const links = spectator.queryAll<HTMLAnchorElement>("a");
    expect(links.length).toBe(1);
    expect(links[0].innerText).toContain("title");
    assertHref(links[0], "https://brokenlink/");
  });

  it("should create route link", () => {
    spectator.setInput("card", { title: "title", route: "/brokenlink" });

    const links = spectator.queryAll<HTMLAnchorElement>("a");
    expect(links.length).toBe(1);
    expect(links[0].innerText).toContain("title");
    assertRoute(links[0], "/brokenlink");
  });
});
