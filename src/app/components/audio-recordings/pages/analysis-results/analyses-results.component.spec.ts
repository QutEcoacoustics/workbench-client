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
import { Observable, of } from "rxjs";
import { By } from "@angular/platform-browser";
import { AnalysesResultsComponent } from "./analyses-results.component";

describe("analysesResultsComponent", () => {
  let spectator: SpectatorHost<AnalysesResultsComponent>;
  let defaultAudioRecording: AudioRecording;
  let getItemSpy: jasmine.Spy<(model: AnalysisJobItemResult) => Observable<AnalysisJobItemResult[]>>;

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

    getItemSpy = spyOn(spectator.component, "getModelChildren").and.stub();

    updateComponent();
    spectator.detectChanges();
  }

  beforeEach(() => setup());

  const getDirectoryRowByName = (itemName: string): HTMLElement =>
    spectator.debugElement.query(
      (el) => el.nativeElement.innerText === itemName
    ).nativeElement as HTMLElement;

  const getDownloadButton = (index: number): HTMLButtonElement =>
    getDirectoryRowByName(index).getElementsByClassName("btn-light")[0] as HTMLButtonElement;

  const getDirectoryRowItemName = (index: number) =>
    getDirectoryRowByName(index).innerText.split("\n")[0];

  function clickFolder(index: number) {
    const rowItem: HTMLElement = spectator.queryAll<HTMLElement>(".directory-listing-item")[3 * index];
    rowItem.click();
    updateComponent();
  }

  const resultsFactory = (itemName?: string, data?: object): AnalysisJobItemResult =>
    new AnalysisJobItemResult({
      name: itemName,
      path: rootPath + itemName,
      ...data
    });

  const generateRootFolder = (): AnalysisJobItemResult =>
    resultsFactory();

  function updateComponent() {
    spectator.component.updateRows();
    spectator.detectChanges();
  }

  /**
   * Adds the necessary information to the component required to render a model `modelSkeleton` and it's full model `completeModel`
   *
   * @param model The information needed to render the row, e.g. `name`, `path`, `type`
   * @param childElements The child elements that will be shown when the user clicks on the row
   */
  function mockDirectoryStructure(model: AnalysisJobItemResult, childElements?: AnalysisJobItemResult[]) {
    spectator.component.rows$ = of([model]);

    getItemSpy.and.callFake(() =>
      new Observable<AnalysisJobItemResult[]>(subscriber => {
        subscriber.next(childElements);
      })
    );

    updateComponent();
  }

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnalysesResultsComponent);
  });

  it("should display an enabled file download button for files", () => {
    const rootFolder = generateRootFolder();

    const rootFolderContents = [
      resultsFactory("", { ...generateAnalysisJobResults({type: "file" }) })
    ];

    mockDirectoryStructure(rootFolder, rootFolderContents);

    clickFolder(0);

    const downloadButton = getDownloadButton(2);
    expect(downloadButton).not.toHaveClass("disabled");
  });

  // this is only temporary until we have the API's functionality for downloading analysis folders as archives
  it("should have a disabled zip download button for folders", () => {
    const rootFolder = generateRootFolder();
    mockDirectoryStructure(rootFolder);

    const downloadButton = getDownloadButton(1);

    expect(downloadButton).toHaveClass("disabled");
  });

  it("should show sub directory folders and items when a folder is clicked", () => {
    const expectedFileName = "Sound_File2022-11-05T08:15:30-05:00.wav";

    const rootFolder = generateRootFolder();
    const folderA = resultsFactory("folderA", { type: "directory" });
    const rootFolderChildren = [ folderA ];


    // mock and click on root folder
    mockDirectoryStructure(rootFolder, rootFolderChildren);
    clickFolder(0);

    // mock and click on FolderA/
    const folderAChildren = [
      resultsFactory(expectedFileName)
    ];

    mockDirectoryStructure(folderA, folderAChildren);
    clickFolder(1);

    // assert that the sub_folder under A is shown
    expect(getDirectoryRowItemName(3)).toEqual(expectedFileName);
  });

  it("should remove all sub-folders from model if a folder is clicked on while open", () => {
    const folderBTestingFileName = "FolderA/B/assertMe.csv";

    const rootFolder = generateRootFolder();
    const folderA = resultsFactory("folderA", { type: "directory" });
    const rootFolderChildren = [ folderA ];

    mockDirectoryStructure(rootFolder, rootFolderChildren);
    clickFolder(0);

    // open folderA
    const folderAChildren = [
      resultsFactory("FolderA/B", { type: "directory" })
    ];
    mockDirectoryStructure(folderA, folderAChildren);
    clickFolder(1);

    // open sub folder folderA/B
    const folderB = resultsFactory("FolderA/B", { type: "directory" });
    const folderBChildren = [
      resultsFactory(folderBTestingFileName)
    ];
    mockDirectoryStructure(folderB, folderBChildren);
    clickFolder(2);

    // assert that folderA/B is open
    expect(getDirectoryRowItemName(4)).toEqual(folderBTestingFileName);

    // close folderA
    clickFolder(0);
    mockDirectoryStructure(rootFolder, rootFolderChildren);

    // assert that folderA/B is closed
    expect(getDirectoryRowByName(4)).toBeUndefined();
  });
});
