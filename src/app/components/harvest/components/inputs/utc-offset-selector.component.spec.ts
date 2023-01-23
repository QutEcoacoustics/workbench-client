import { createComponentFactory, Spectator, SpectatorOverrides } from "@ngneat/spectator";
import { generateSite } from "@test/fakes/Site";
import { Site } from "@models/Site";
import { TimezoneInformation } from "@interfaces/apiInterfaces";
import { UTCOffsetSelectorComponent } from "./utc-offset-selector.component";

describe("UTCOffsetSelectorComponent", () => {
  let spectator: Spectator<UTCOffsetSelectorComponent>;

  const createHost = createComponentFactory({
    component: UTCOffsetSelectorComponent,
  });

  function setup(props?: SpectatorOverrides<UTCOffsetSelectorComponent>) {
    spectator = createHost(props);
    spectator.detectChanges();
  }

  function getOffsetInput(): HTMLSelectElement {
    return spectator.query<HTMLSelectElement>("select");
  }

  function getEditOffsetButton(): HTMLButtonElement {
    // since there is only one button in this component, it is possible to directly query the button
    return spectator.query<HTMLButtonElement>("button");
  }

  function getDisplayedUTCOffset(): string {
    return spectator.query<HTMLDivElement>(".utc-label").innerText;
  }

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(UTCOffsetSelectorComponent);
  });

  it("should show the correct placeholder text if there is not UTC offset specified", () => {
    setup();

    const expectedPlaceholderText = "Select offset";
    expect(getOffsetInput().value).toEqual(expectedPlaceholderText);
  });

  it("should display all offsets with from smallest to largest if there is no site location specified", () => {
    setup();
    // the offset selector should contain the list of all possible offsets, with the placeholder text at the beginning
    const expectedPlaceholderText = "Select offset";

    const allUTCOffsets = String(UTCOffsetSelectorComponent.offsets).replace(/,/g, "\n");
    const expectedValue = `${expectedPlaceholderText}\n${allUTCOffsets}`;

    expect(getOffsetInput().innerText).toEqual(expectedValue);
  });

  it("should display an edit button if there is a offset already specified", () => {
    setup({
      props: {
        offset: "+10:00",
      }
    });

    expect(getEditOffsetButton()).toBeInstanceOf(HTMLButtonElement);
  });

  it("should show the correct offset if there is a offset specified", () => {
    const expectedOffset = "+10:00";

    setup({
      props: {
        offset: "+10:00",
      }
    });

    expect(getDisplayedUTCOffset()).toEqual(expectedOffset);
  });

  it("should show relevant UTC offsets at the top of the offset list if a site with a location is set", () => {
    const mockSite = new Site(generateSite({
      timezoneInformation: {
        identifierAlt: "Brisbane",
        identifier: "Australia/Brisbane",
        friendlyIdentifier: "Australia - Brisbane",
        utcOffset: 36000,
        utcTotalOffset: 36000,
      } as TimezoneInformation,
    }));

    setup({
      props: {
        site: mockSite,
      }
    });

    const expectedPlaceholderText = "Select offset";
    const expectedRelevantOffsets = "+10:00\n";
    const allUTCOffsets = String(UTCOffsetSelectorComponent.offsets).replace(/,/g, "\n");

    const expectedValue = `${expectedPlaceholderText}\n${expectedRelevantOffsets}---\n${allUTCOffsets}`;

    expect(getOffsetInput().innerText).toEqual(expectedValue);
  });
});
