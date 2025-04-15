import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { UploadUrlComponent } from "@components/harvest/components/shared/upload-url.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { generateHarvest } from "@test/fakes/Harvest";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import { MockComponent, MockProvider } from "ng-mocks";
import { ToastService } from "@services/toasts/toasts.service";
import { Subject } from "rxjs";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { BatchUploadingComponent } from "./batch-uploading.component";

describe("BatchUploadingComponent", () => {
  let spec: SpectatorRouting<BatchUploadingComponent>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;
  let defaultSite: Site;
  let stages: SpyObject<HarvestStagesService>;
  let injector: AssociationInjector;

  const createComponent = createRoutingFactory({
    declarations: [MockComponent(UploadUrlComponent), ConfirmationComponent],
    component: BatchUploadingComponent,
    providers: [
      MockProvider(HarvestStagesService, {
        project: undefined,
        harvest: undefined,
        startPolling: jasmine.createSpy("start polling") as any,
        stopPolling: jasmine.createSpy("stop polling") as any,
        transition: (_stage: HarvestStatus) => {},
      }),
    ],
    imports: [MockBawApiModule],
    mocks: [ToastService],
  });

  function setup(project: Project, harvest: Harvest, sites: Site[]) {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(ASSOCIATION_INJECTOR);
    project["injector"] = injector;
    harvest["injector"] = injector;
    stages = spec.inject<SpyObject<HarvestStagesService>>(
      HarvestStagesService as any
    );
    // spy needs to be created after createComponent is called and cannot be
    // created inside a mockProvider definition
    stages.transition = jasmine.createSpy("transition") as any;
    stages.startPolling.and.stub();
    stages.project = project;
    (stages as any).harvest = harvest;
    const siteApi = spec.inject(SHALLOW_SITE.token);
    const subject = new Subject<Site[]>();
    siteApi.filter.and.callFake(() => subject);
    return nStepObservable(subject, () => sites);
  }

  function getModalNextBtn() {
    return spec.query<HTMLButtonElement>(
      "baw-harvest-confirmation-modal #next-btn",
      { root: true }
    );
  }

  function getModalCancelBtn() {
    return spec.query<HTMLButtonElement>(
      "baw-harvest-confirmation-modal #cancel-btn",
      { root: true }
    );
  }

  function getModal() {
    return spec.query("baw-harvest-confirmation-modal", { root: true });
  }

  function launchModal(btnSelector, modalText) {
    const btn = spec.query(btnSelector);
    spec.click(btn);
    spec.detectChanges();
    const modal = getModal();
    expect(modal).toBeTruthy();
    expect(modal).toContainText(modalText);
    spec.detectChanges();
  }

  function clickModal(button, callback) {
    let btn;
    if (button === "cancel") {
      btn = getModalCancelBtn();
    } else {
      btn = getModalNextBtn();
    }
    spec.click(btn);
    spec.detectChanges();
    const interval = setInterval(() => {
      spec.detectChanges();
      if (!getModal()) {
        // if the click worked, the modal will disappear and we can check the button action
        callback();
        clearInterval(interval);
      }
    }, 50);
  }

  function cancelModal(done) {
    clickModal("cancel", () => {
      expect(stages.transition).not.toHaveBeenCalled();
      done();
    });
  }

  function clickModalNext(callback) {
    clickModal("next", callback);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultHarvest = new Harvest(generateHarvest({ status: "metadataReview" }));
    defaultSite = new Site(generateSite());
  });

  it("should create", () => {
    setup(defaultProject, defaultHarvest, [defaultSite]);
    spec.detectChanges();
    expect(spec.component).toBeInstanceOf(BatchUploadingComponent);
  });

  describe("tab group", () => {
    function getCurrentTabTitle() {
      return spec.query<HTMLElement>("a.nav-link.active");
    }

    function getCurrentTabBody() {
      return spec.query<HTMLElement>(".tab-pane.active");
    }

    function setCurrentTab(tabLabel: string) {
      const tab = spec
        .queryAll<HTMLAnchorElement>("a.nav-link")
        .find((item) => item.innerText === tabLabel);
      spec.click(tab);
    }

    const tabs = [
      {
        label: "Windows",
        description: "WinSCP",
      },
      {
        label: "MacOS",
        description: "Cyberduck",
      },
      {
        label: "Linux",
        description: "SCP",
      },
      {
        label: "R Clone",
        description: "rclone copy",
      },
    ];

    tabs.forEach(({ label, description }) => {
      it(`should show ${label} tab title`, () => {
        setup(defaultProject, defaultHarvest, [defaultSite]);
        spec.detectChanges();
        setCurrentTab(label);
        spec.detectChanges();
        expect(getCurrentTabTitle()).toBeTruthy();
      });

      it(`should show ${label} tab body`, (done) => {
        setup(defaultProject, defaultHarvest, [defaultSite]);
        spec.detectChanges();
        setCurrentTab(label);
        spec.detectChanges();
        const interval = setInterval(() => {
          spec.detectChanges();
          if (getCurrentTabBody().innerText.includes(description)) {
            expect(getCurrentTabBody()).toContainText(description);
            clearInterval(interval);
            done();
          }
        }, 50);
      });
    });
  });

  describe("Buttons", () => {
    let modalService: NgbModal;

    beforeEach(() => {
      setup(defaultProject, defaultHarvest, [defaultSite]);
      modalService = spec.inject(NgbModal);
    });

    afterEach(() => {
      modalService.dismissAll();
    });

    it("should abort upload when abort is clicked and the 'abort upload' modal button is clicked", (done) => {
      launchModal(
        "#cancel-btn",
        "Are you sure you want to abort this upload? Aborting will not process any uploaded files, and cannot be undone."
      );
      clickModalNext(() => {
        expect(stages.transition).toHaveBeenCalledWith("complete");
        done();
      });
    });

    it("should change harvest stage when 'Finished uploading' is clicked and scan files modal button is clicked", (done) => {
      launchModal("#finish-btn", "Are you sure your upload is finished");
      clickModalNext(() => {
        expect(stages.transition).toHaveBeenCalledWith("scanning");
        done();
      });
    });

    it("should launch and cancel modal when 'cancel' button is clicked and then 'return' is clicked", (done) => {
      launchModal(
        "#cancel-btn",
        "Are you sure you want to abort this upload? Aborting will not process any uploaded files, and cannot be undone."
      );
      cancelModal(done);
    });

    it("should launch and cancel modal when 'finished uploading' button is clicked and then cancel is clicked", (done) => {
      launchModal("#finish-btn", "Are you sure your upload is finished");
      cancelModal(done);
    });
  });
});
