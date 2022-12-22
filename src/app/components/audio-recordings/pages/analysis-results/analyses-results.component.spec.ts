import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { AnalysesDownloadRowComponent } from "@components/audio-recordings/components/analyses-download/analysis-download-row.component";
import { AnalysisJobItemResult } from "@models/AnalysisJobItemResult";
import { AudioRecording } from "@models/AudioRecording";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { createHostFactory, SpectatorHost } from "@ngneat/spectator";
import { generateAnalysisJobResults } from "@test/fakes/AnalysisJobItemResult";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";
import { AnalysesResultsComponent } from "./analyses-results.component";

describe("analysesResultsComponent", () => {
  let spectator: SpectatorHost<AnalysesResultsComponent>;
  let defaultAudioRecording: AudioRecording;
  let getItemSpy: jasmine.Spy<(model: AnalysisJobItemResult) => Observable<AnalysisJobItemResult>>;

  const rootPath = "/analysis_jobs/system/results/1/";

  const createHost = createHostFactory({
    declarations: [
      NgbTooltip,
      AnalysesDownloadRowComponent,
    ],
    component: AnalysesResultsComponent,
    imports: [MockBawApiModule, FormsModule],
    mocks: [ToastrService],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: mockActivatedRoute(),
      },
    ],
  });

  function setup() {
    spectator = createHost("<baw-analyses-results></baw-analyses-results>", { detectChanges: false });

    defaultAudioRecording = new AudioRecording(generateAudioRecording({ id: 1 }));
    spectator.component.audioRecording = defaultAudioRecording;

    getItemSpy = spyOn(spectator.component, "getItem").and.stub();

    spectator.detectChanges();
  }

  beforeEach(() => setup());

  const isFile = (item: AnalysisJobItemResult) =>
    item.type === "file";

  const getDownloadButton = (item: AnalysisJobItemResult): HTMLButtonElement =>
    getDirectoryRow(item).getElementsByClassName("btn-light")[0] as HTMLButtonElement;

  function getDirectoryRow(item: AnalysisJobItemResult): HTMLElement {
    const itemName = item.name;
    const itemSize = isFile(item) ? `${item.sizeBytes} Bytes` : "";
    const expectedInnerText = `${itemName}\n${itemSize}`;

    const directoryRow = spectator.debugElement.query(
      (el) => el.nativeElement.innerText === expectedInnerText
    )?.nativeElement as HTMLElement;

    return directoryRow;
  }

  function clickFolder(item: AnalysisJobItemResult) {
    const itemName = item.name;

    const rowItem = getItemByName(itemName);

    rowItem.click();
    spectator.detectChanges();
  }

  /**
   * Gets the clickable portion of the row (the item name & container)
   *
   * @param itemName The name of the item to click
   * @returns A HTML element representing the clickable portion / item of the results row or undefined if the item is not found
   */
  const getItemByName = (itemName: string): HTMLElement =>
    spectator.debugElement.query(
      (el) => el.nativeElement.innerText === itemName &&
        el.nativeElement.classList.contains("directory-listing-item")
    )?.nativeElement as HTMLElement;

  const resultsItemFactory = (itemName: string = "", data?: object): AnalysisJobItemResult =>
    new AnalysisJobItemResult({
      name: itemName,
      path: rootPath + itemName,
      ...data
    });

  const generateRootFolder = (): AnalysisJobItemResult =>
    resultsItemFactory();

  /**
   * Adds the necessary information to the component required to render a model `modelSkeleton` and it's full model `completeModel`
   *
   * @param item The parent item that the test will click on to load the child items
   * @param itemChildren The child elements that will be shown when the user clicks on the row
   */
  function mockDirectoryItemChildren(item?: AnalysisJobItemResult, itemChildren?: AnalysisJobItemResult[]) {
    getItemSpy.and.returnValue(new Observable<AnalysisJobItemResult>(subscriber => {
      subscriber.next(new AnalysisJobItemResult({
        children: itemChildren,
        ...item
      }))
    }));

    spectator.detectChanges();
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnalysesResultsComponent);
  });

  fit("should display an enabled file download button for files", () => {
    const rootFolder = generateRootFolder();
    const subFile = new AnalysisJobItemResult(
      generateAnalysisJobResults({ type: "file" })
    );
    const rootFolderContents = [
      resultsItemFactory(rootFolder.name, { ...subFile })
    ];

    // open the root folder, that contains a single AnalysisJobItemResult item of type file
    mockDirectoryItemChildren(rootFolder, rootFolderContents);
    clickFolder(rootFolder);

    // get the download button of this sub item / file and assert that the button is enabled
    const downloadButton = getDownloadButton(subFile);
    expect(downloadButton).not.toHaveClass("disabled");
  });

  // this is only temporary until we have the API's functionality for downloading analysis folders as archives
  it("should have a disabled zip download button for folders", () => {
    const rootFolder = generateRootFolder();

    // since the root folder is of type folder, we can assert that the root folder has a disabled download button
    const downloadButton = getDownloadButton(rootFolder);
    expect(downloadButton).toHaveClass("disabled");
  });

  it("should show sub directory folders and items when a folder is clicked", () => {
    const assertedFileName = "Sound_File2022-11-05T08:15:30-05:00.wav";
    const rootFolder = generateRootFolder();
    const folderA = resultsItemFactory("folderA", { type: "directory" });
    const rootFolderChildren = [folderA];
    const folderAChildren = [
      resultsItemFactory(assertedFileName)
    ];

    // mock and click on root folder
    mockDirectoryItemChildren(rootFolder, rootFolderChildren);
    clickFolder(rootFolder);

    // mock and click on FolderA/
    mockDirectoryItemChildren(folderA, folderAChildren);
    clickFolder(folderA);

    // assert that the the predetermined file `assertedFileName` is shown under folderA
    expect(getItemByName(assertedFileName)).toBeTruthy();
  });

  it("should remove all sub-folders from model if a folder is clicked on while open", () => {
    const folderBTestingFileName = "FolderA/B/assertMe.csv";

    const rootFolder = generateRootFolder();
    const folderA = resultsItemFactory("folderA", { type: "directory" });
    const rootFolderChildren = [folderA];

    mockDirectoryItemChildren(rootFolder, rootFolderChildren);
    clickFolder(rootFolder);

    // open folderA
    const folderAChildren = [
      resultsItemFactory("FolderA/B", { type: "directory" })
    ];
    mockDirectoryItemChildren(folderA, folderAChildren);
    clickFolder(folderA);

    // open sub folder folderA/B
    const folderB = resultsItemFactory("FolderA/B", { type: "directory" });
    const folderBChildren = [
      resultsItemFactory(folderBTestingFileName)
    ];
    mockDirectoryItemChildren(folderB, folderBChildren);
    clickFolder(folderB);

    // assert that folderA/B is open
    expect(getItemByName(folderB.name)).toBeTruthy();

    // click on the root folder to close all folders
    mockDirectoryItemChildren(rootFolder, rootFolderChildren);
    clickFolder(rootFolder);

    // assert that folderA/B is closed
    expect(getItemByName(folderB.name)).toBeUndefined();
  });
});
