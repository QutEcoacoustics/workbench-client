import { RouterTestingModule } from "@angular/router/testing";
import { DirectivesModule } from "@directives/directives.module";
import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { modelData } from "@test/helpers/faker";
import { assertHref, assertTruncation, assertUri } from "@test/helpers/html";
import { LineTruncationLibModule } from "ngx-line-truncation";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let spectator: Spectator<CardComponent>;
  const createComponent = createComponentFactory({
    component: CardComponent,
    imports: [LineTruncationLibModule, DirectivesModule, RouterTestingModule],
  });

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
    spectator.detectChanges();

    const description = spectator.query<HTMLParagraphElement>("p");
    expect(description.textContent).toContain("No description given");
  });

  it("should have description when provided", () => {
    spectator.setInput("card", { title: "title", description: "description" });
    spectator.detectChanges();

    const description = spectator.query<HTMLParagraphElement>("p");
    expect(description.textContent).toContain("description");
  });

  it("should shorten description when description is long", () => {
    spectator.setInput("card", {
      title: "title",
      description: modelData.descriptionLong(),
    });
    spectator.detectChanges();

    const description = spectator.query<HTMLParagraphElement>("p");
    assertTruncation(description, 4);
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
    assertUri(links[0], "/brokenlink");
  });
});
