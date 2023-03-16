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

  // since the timezone converter tests are unit tests and do not rely on the GUI components
  // there is no need to generate the component through the component factory
  describe("timezone converter", () => {
    const convertHourToUnixOffset = (hours: number) => hours * 3600;

    function assertConversion(decimalHourOffset: number, expectedResult: string) {
      const unixOffset = convertHourToUnixOffset(decimalHourOffset);

      expect(spectator.component.convertUnixOffsetToUTCOffset(unixOffset)).toEqual(expectedResult);
    }

    it("should correctly process utc offsets of < +1 hour", () => {
      assertConversion(1, "+01:00");
    });

    it("should correctly process utc offsets of < -1 hour", () => {
      assertConversion(-1, "-01:00");
    });

    it("should correctly process known times (Brisbane)", () => {
      assertConversion(10, "+10:00");
    });

    it("should correctly process known times (New York)", () => {
      assertConversion(-5, "-05:00");
    });

    it("should correctly process a utc offset of + and -00:00", () => {
      assertConversion(0, "+00:00");
      assertConversion(-0, "+00:00");
    });

    it("should throw an error if the utc offset is incorrect (>= +12)", () => {
      setup();
      const offset = convertHourToUnixOffset(13);

      expect(() => spectator.component.convertUnixOffsetToUTCOffset(offset)).toThrow(
        new Error("UTC Offset out of bounds.")
      );
    });

    it("should throw an error if the utc offset is incorrect (<= -12)", () => {
      setup();
      const offset = convertHourToUnixOffset(-12.1);

      expect(() => spectator.component.convertUnixOffsetToUTCOffset(offset)).toThrow(
        new Error("UTC Offset out of bounds.")
      );
    });
  });
});
