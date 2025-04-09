import { fakeAsync, flush, tick } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { FolderRowComponent } from "@components/harvest/components/metadata-review/folder-row.component";
import { WhitespaceComponent } from "@components/harvest/components/metadata-review/whitespace.component";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { StatisticItemComponent } from "@components/harvest/components/shared/statistics/item.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { StatisticsComponent } from "@components/harvest/components/shared/statistics/statistics.component";
import {
  Harvest,
  HarvestMapping,
  HarvestStatus
} from "@models/Harvest";
import { Project } from "@models/Project";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateHarvest } from "@test/fakes/Harvest";
import {
  generateProject,
  generateProjectMeta
} from "@test/fakes/Project";
import { MockProvider } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { StatisticGroupComponent } from "@components/harvest/components/shared/statistics/group.component";
import { HarvestItem } from "@models/HarvestItem";
import { UTCOffsetSelectorComponent } from "@components/harvest/components/inputs/utc-offset-selector.component";
import { SiteSelectorComponent } from "@components/harvest/components/inputs/site-selector.component";
import { menuRoute } from "@interfaces/menusInterfaces";
import { generateMenuRoute } from "@test/fakes/MenuItem";
import { SHALLOW_HARVEST } from "@baw-api/ServiceTokens";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { generateHarvestItem } from "@test/fakes/HarvestItem";
import { Inject } from "@angular/core";
import { MetadataReviewComponent } from "./metadata-review.component";

describe("MetadataReviewComponent", () => {
  let spec: SpectatorRouting<MetadataReviewComponent>;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;
  let stages: SpyObject<HarvestStagesService>;
  let harvestService: SpyObject<ShallowHarvestsService>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;

  const createComponent = createRoutingFactory({
    declarations: [
      ConfirmationComponent,
      StatisticsComponent,
      StatisticGroupComponent,
      StatisticItemComponent,
      WhitespaceComponent,
      SiteSelectorComponent,
      UTCOffsetSelectorComponent,
      FolderRowComponent
    ],
    component: MetadataReviewComponent,
    providers: [
      MockProvider(HarvestStagesService, {
        project: defaultProject,
        harvest: defaultHarvest,
        transition: (_stage: HarvestStatus) => {}
      }),
    ],
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastService],
  });

  function setup(): SpyObject<HarvestStagesService> {
    spec = createComponent({ detectChanges: false });
    spec.component.newSiteMenuItem = menuRoute(generateMenuRoute());

    harvestService = spec.inject(SHALLOW_HARVEST.token);

    spyOnProperty(spec.component, "project", "get").and.callFake(() => defaultProject);
    spyOnProperty(spec.component, "harvest", "get").and.callFake(() => defaultHarvest);

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalService = spec.inject(NgbModal);

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    stages = spec.inject<SpyObject<HarvestStagesService>>(HarvestStagesService as any);
    stages.transition = jasmine.createSpy("transition") as any;

    return stages;
  }

  // because the modal element is not a child element of the tested component,
  // we need to use the { root: true } option so that the query is not scoped
  // to the component's template, but to the entire document
  const getModalNextButton = () =>
    spec.query<HTMLButtonElement>("baw-harvest-confirmation-modal #next-btn", { root: true });
  const getModalCancelButton = () =>
    spec.query<HTMLButtonElement>("baw-harvest-confirmation-modal #cancel-btn", { root: true });

  function getAbortButton(): HTMLButtonElement {
    return spec.debugElement.query(
      (el) => el.nativeElement.innerText === "Abort"
    ).nativeElement as HTMLButtonElement;
  }

  function updateComponent() {
    spec.detectChanges();
    flush();
    spec.detectChanges();
  }

  const folderStructureFactory = (folders: string[] = []): HarvestItem[] =>
    folders.map((folder) =>
      new HarvestItem(generateHarvestItem({ id: null, path: folder }))
    );

  function clickFolder(folderName: string): void {
    const folderItem = spec.debugElement.query(
      (el) => el.nativeElement.innerText === folderName
    ).nativeElement as HTMLButtonElement;

    folderItem.click();
    updateComponent();
  }

  function clickEditMappingButton(index: number): void {
    const mappingEditButton = spec.queryAll<HTMLButtonElement>(".btn-outline-primary", { root: true })[index];
    mappingEditButton.click();
    updateComponent();
  }

  function toggleHarvestMappingRecursive(index: number): void {
    const mappingRecursiveCheckbox = spec.queryAll<HTMLInputElement>("#undefined-checkbox", { root: true })[index];
    mappingRecursiveCheckbox.click();
    updateComponent();
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultProject.addMetadata(generateProjectMeta({}));
    defaultHarvest = new Harvest(generateHarvest({ status: "metadataReview" }));
  });

  afterEach(() => {
    // dismiss all bootstrap modals, so if a test fails
    // it doesn't impact future tests by using a stale modal
    modalService.dismissAll();
  });

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(MetadataReviewComponent);
  });

  it("should dismiss abort warning modal and not transition the Harvest status when the 'return' button is clicked", fakeAsync(() => {
    setup();

    getAbortButton().click();
    tick();

    getModalCancelButton().click();
    tick();

    expect(stages.transition).not.toHaveBeenCalled();
  }));

  it("should transition the Harvest to 'complete' when the 'Abort Harvest' button is clicked in abort warning modal", fakeAsync(() => {
    setup();

    getAbortButton().click();
    tick();

    getModalNextButton().click();
    tick();

    expect(stages.transition).toHaveBeenCalledWith("complete");
  }));

  it("should have persistent mappings when folders close", fakeAsync(() => {
    setup();

    defaultHarvest = new Harvest({
      ...defaultHarvest,
      mappings: []
    });

    // when a folder item is clicked, the getHarvestItems() method returns the sub folders & items included in the folder
    // therefore, by mocking getHarvestItems() and resolving to custom files, we can control the sub-folders & items
    // that will be displayed when a folder in the directory tree is clicked
    const rootFolderStructure: HarvestItem[] = folderStructureFactory(["A", "B"]);
    const getHarvestItemsSpy = spyOn(stages, "getHarvestItems").and.resolveTo(rootFolderStructure);

    updateComponent();

    // click on folder A in the directory tree
    const folderAStructure: HarvestItem[] = folderStructureFactory(["A/aa", "A/ab"]);
    getHarvestItemsSpy.and.callThrough();
    getHarvestItemsSpy.and.resolveTo(folderAStructure);
    clickFolder("A");

    // assert that the mappings for the model are updated correctly by using a mocked updateMappings() method
    // which asserts if it was called with the correct parameters
    harvestService.updateMappings.and.callFake((model: Harvest, mappings: HarvestMapping[]) => {
      const expectedMappings = [
        new HarvestMapping({
          path: "A/aa",
          recursive: false,
          siteId: null,
          utcOffset: null
        })
      ];

      expect(model).toEqual(spec.component.harvest);

      // By default mappings will have an injector service, therefore, we cannot directly compare mappings to expectedMappings
      // through expect(mappings).toEqual(expectedMappings). Therefore, by converting the objects to strings,
      // we can compare these two objects values without the injector class, but still retain verbose failed exceptions & output
      expect(JSON.stringify(mappings)).toEqual(JSON.stringify(expectedMappings));
    });

    // modifying the mappings for path "A/aa" will trigger the mocked method above to asset if the correct parameters are called
    clickEditMappingButton(2);
    toggleHarvestMappingRecursive(0);
    expect(harvestService.updateMappings).toHaveBeenCalledTimes(1);

    // close folder A in the directory tree
    getHarvestItemsSpy.and.callThrough();
    getHarvestItemsSpy.and.resolveTo(folderStructureFactory());
    clickFolder("A");

    // open folder B in the directory tree
    const folderBStructure: HarvestItem[] = folderStructureFactory(["B/ba", "B/bb"]);
    getHarvestItemsSpy.and.callThrough();
    getHarvestItemsSpy.and.resolveTo(folderBStructure);
    clickFolder("B");

    // assert mappings for path "A/aa" have been retained once it is no longer visible in the DOM and mappings have been applied to "B/bb"
    harvestService.updateMappings.and.callFake((model: Harvest, mappings: HarvestMapping[]) => {
      const expectedMappings = [
        new HarvestMapping({
          path: "A/aa",
          recursive: false,
          siteId: null,
          utcOffset: null
        }),
        new HarvestMapping({
          path: "B/bb",
          recursive: false,
          siteId: null,
          utcOffset: null
        })
      ];

      expect(model).toEqual(spec.component.harvest);
      expect(JSON.stringify(mappings)).toEqual(JSON.stringify(expectedMappings));
    });

    clickEditMappingButton(4);
    toggleHarvestMappingRecursive(0);
    expect(harvestService.updateMappings).toHaveBeenCalledTimes(2);
  }));

  it("should retain mappings assigned in previous stages after change in mapping through interface", fakeAsync(() => {
    setup();

    const mapping: HarvestMapping[] = [
      new HarvestMapping({
        path: "A",
        recursive: true,
        siteId: 543,
        utcOffset: "+11:00"
      }),
      new HarvestMapping({
        path: "B",
        recursive: true,
        siteId: null,
        utcOffset: null
      }, Inject(FolderRowComponent)),
      new HarvestMapping({
        path: "C",
        recursive: true,
        siteId: 1234,
        utcOffset: "+10:00"
      }),
      new HarvestMapping({
        path: "C/ca",
        recursive: false,
        siteId: null,
        utcOffset: "-08:00"
      })
    ];

    defaultHarvest = new Harvest({
      ...defaultHarvest,
      mappings: mapping
    });

    const rootFolderStructure: HarvestItem[] = folderStructureFactory(["B"]);
    spyOn(stages, "getHarvestItems").and.resolveTo(rootFolderStructure);

    updateComponent();

    clickEditMappingButton(1);
    const utcInputDropdown: HTMLSelectElement = spec.query<HTMLSelectElement>("select", { root: true });
    utcInputDropdown.value = utcInputDropdown.options[2].value;
    utcInputDropdown.dispatchEvent(new Event("change"));
    updateComponent();

    const expectedMappings: HarvestMapping[]  = [
      new HarvestMapping({
        path: "A",
        recursive: true,
        siteId: 543,
        utcOffset: "+11:00"
      }),
      new HarvestMapping({
        path: "B",
        recursive: true,
        siteId: null,
        utcOffset: "-11:00"
      }),
      new HarvestMapping({
        path: "C",
        recursive: true,
        siteId: 1234,
        utcOffset: "+10:00"
      }),
      new HarvestMapping({
        path: "C/ca",
        recursive: false,
        siteId: null,
        utcOffset: "-08:00"
      })
    ];

    harvestService.updateMappings.and.callFake((model: Harvest, mappings: HarvestMapping[]) => {
      expect(model).toEqual(spec.component.harvest);
      expect(JSON.stringify(mappings)).toEqual(JSON.stringify(expectedMappings));
    });

    expect(harvestService.updateMappings).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(spec.component.harvest.mappings)).toEqual(JSON.stringify(expectedMappings));
  }));
});
