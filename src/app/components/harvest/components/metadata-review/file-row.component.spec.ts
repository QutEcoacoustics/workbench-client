import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MetaReviewFile } from "@components/harvest/screens/metadata-review/metadata-review.component";
import { modelData } from "@test/helpers/faker";
import { HarvestItem } from "@models/HarvestItem";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import { WhitespaceComponent } from "./whitespace.component";
import { FileRowComponent } from "./file-row.component";

describe("FileRowComponent", () => {
  let spectator: Spectator<FileRowComponent>;
  let mockRow: MetaReviewFile;

  const createHost = createComponentFactory({
    component: FileRowComponent,
    declarations: [WhitespaceComponent]
  });

  function setup() {
    spectator = createHost({
      props: {
        row: mockRow,
      }
    });

    spyOnProperty(spectator.component, "mapping", "get").and.callFake(() => mockRow.mapping);
    spyOnProperty(spectator.component, "harvestItem", "get").and.callFake(() => mockRow.harvestItem);

    spectator.detectChanges();
  }

  function constructMockRow(data?: Partial<MetaReviewFile>): MetaReviewFile {
    const mockFileName = modelData.system.filePath();

    return {
      path: mockFileName,
      showValidations: true,
      harvestItem: new HarvestItem(generateHarvestItem()),
      ...data
    } as MetaReviewFile
  }

  function getRowFilePath(): string {
    return spectator.query<HTMLElement>(".file-name").innerText;
  }

  beforeEach(() => mockRow = constructMockRow());

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(FileRowComponent);
  });

  it("should display the correct file path", () => {
    setup();
    expect(getRowFilePath()).toEqual(mockRow.path);
  });
});
