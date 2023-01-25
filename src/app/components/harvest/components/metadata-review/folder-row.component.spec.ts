import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { MetaReviewFolder } from "@components/harvest/screens/metadata-review/metadata-review.component";
import { modelData } from "@test/helpers/faker";
import { generateProject } from "@test/fakes/Project";
import { generateHarvest } from "@test/fakes/Harvest";
import { Project } from "@models/Project";
import { Harvest } from "@models/Harvest";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import { HarvestItem } from "@models/HarvestItem";
import { WhitespaceComponent } from "./whitespace.component";
import { FolderRowComponent } from "./folder-row.component";

describe("FolderRowComponent", () => {
  let spectator: Spectator<FolderRowComponent>;
  let mockRow: MetaReviewFolder;

  const createHost = createComponentFactory({
    component: FolderRowComponent,
    declarations: [WhitespaceComponent]
  });

  function setup() {
    mockRow = constructMockRow();

    spectator = createHost({
      props: {
        harvest: new Harvest(generateHarvest()),
        project: new Project(generateProject()),
        row: mockRow,
      }
    });

    spectator.component.harvest = new Harvest(generateHarvest());
    spectator.component.project = new Project(generateProject());

    spyOnProperty(spectator.component, "mapping", "get").and.callFake(() => mockRow.mapping);
    spyOnProperty(spectator.component, "harvestItem", "get").and.callFake(() => mockRow.harvestItem);

    spectator.detectChanges();
  }

  function getFolderPath(): string {
    return spectator.query<HTMLSpanElement>(".folder-path", { root: true }).innerText;
  }

  function getAddMappingsButton(): HTMLButtonElement {
    return spectator.debugElement.query(
      (el) => el.nativeElement.innerText === "Add Site or UTC to folder" &&
        el.nativeElement.classList.contains("btn")
    ).nativeElement as HTMLButtonElement;
  }

  function constructMockRow(data?: Partial<MetaReviewFolder>): MetaReviewFolder {
    const mockFileName = modelData.system.directoryPath();

    return {
      isOpen: false,
      page: 1,
      isRoot: false,
      path: mockFileName,
      parentFolder: null,
      indentation: 0,
      harvestItem: new HarvestItem(generateHarvestItem()),
      ...data,
    } as MetaReviewFolder
  }

  beforeEach(() => setup());

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(FolderRowComponent);
  });

  it("should show the add site of UTC button", () => {
    expect(getAddMappingsButton()).toBeTruthy();
  });

  it("should show the correct folder path", () => {
    expect(getFolderPath()).toEqual(mockRow.path);
  });
});
