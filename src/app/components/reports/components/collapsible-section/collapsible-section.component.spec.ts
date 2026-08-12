import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { SpectatorHost, createHostFactory } from "@ngneat/spectator";
import { CollapsibleSectionComponent } from "./collapsible-section.component";

describe("CollapsibleSectionComponent", () => {
  let spectator: SpectatorHost<CollapsibleSectionComponent>;

  const createHost = createHostFactory({
    component: CollapsibleSectionComponent,
  });

  function setup(expanded: boolean): void {
    spectator = createHost(
      `<baw-collapsible-section
        title="Coverage"
        contentId="coverage-content"
        [headingLevel]="3"
        [expanded]="expanded"
        (expandedChange)="expanded = $event"
      >
        <a section-actions id="download-action">Download</a>
        <p id="section-content">Content</p>
      </baw-collapsible-section>`,
      { detectChanges: false, hostProps: { expanded } },
    );

    spectator.inject(FaIconLibrary).addIcons(faChevronDown, faChevronUp);
    spectator.detectChanges();
  }

  it("should render the configured heading, actions, and content", () => {
    setup(true);

    expect(spectator.query("h3")).toHaveText("Coverage");
    expect(spectator.query("#download-action")).toExist();
    expect(spectator.query("#section-content")).toExist();
    expect(spectator.query("button")).toHaveAttribute(
      "aria-controls",
      "coverage-content",
    );
  });

  it("should emit the next expanded state", () => {
    setup(true);
    const expandedChangeSpy = jasmine.createSpy("expandedChange");
    spectator.component.expandedChange.subscribe(expandedChangeSpy);

    spectator.click("button");

    expect(expandedChangeSpy).toHaveBeenCalledOnceWith(false);
  });
});
