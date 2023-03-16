import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MetaReviewFile } from "@components/harvest/screens/metadata-review/metadata-review.component";
import { modelData } from "@test/helpers/faker";
import { HarvestItem, HarvestItemReport } from "@models/HarvestItem";
import { generateHarvestItem, generateHarvestReport } from "@test/fakes/HarvestItem";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { WhitespaceComponent } from "./whitespace.component";
import { FileRowComponent } from "./file-row.component";

describe("FileRowComponent", () => {
  let spectator: Spectator<FileRowComponent>;
  let mockRow: MetaReviewFile;

  const createHost = createComponentFactory({
    component: FileRowComponent,
    declarations: [WhitespaceComponent],
    imports: [NgbModule],
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

  function getDropdownIcon(): HTMLDivElement {
    return spectator.query<HTMLDivElement>(".dropdown-icon");
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

  it("should show a drop down chevron for files with multiple validations", () => {
    mockRow = constructMockRow({
      harvestItem: new HarvestItem(
        generateHarvestItem({
          report: new HarvestItemReport(generateHarvestReport({
            itemsFailed: 3,
          })),
        })
      ),
    });

    setup();

    expect(getDropdownIcon()).toBeTruthy();
  });

  it("should not show a chevron for files with one validation", () => {
    mockRow = constructMockRow({
      harvestItem: new HarvestItem(
        generateHarvestItem({
          report: new HarvestItemReport(
            generateHarvestReport({
              itemsErrored: 0,
              itemsInvalidFixable: 0,
              itemsInvalidNotFixable: 0,
              itemsFailed: 1,
            })
          ),
        })
      ),
    });

    setup();

    expect(getDropdownIcon()).toBeFalsy();
  });
});
