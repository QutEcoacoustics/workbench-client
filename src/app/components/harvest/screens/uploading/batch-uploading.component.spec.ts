import { Injector } from "@angular/core";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_SITE } from "@baw-api/ServiceTokens";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { UploadUrlComponent } from "@components/harvest/components/shared/upload-url.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateHarvest } from "@test/fakes/Harvest";
import { generateProject } from "@test/fakes/Project";
import { generateSite } from "@test/fakes/Site";
import { nStepObservable } from "@test/helpers/general";
import { MockComponent, MockProvider } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { BatchUploadingComponent } from "./batch-uploading.component";

describe("BatchUploadingComponent", () => {
  let spec: SpectatorRouting<BatchUploadingComponent>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;
  let defaultSite: Site;
  let stages: SpyObject<HarvestStagesService>;
  let injector: Injector;
  const createComponent = createRoutingFactory({
    declarations: [MockComponent(UploadUrlComponent), ConfirmationComponent],
    component: BatchUploadingComponent,
    providers: [
      MockProvider(HarvestStagesService, {
        project: undefined,
        harvest: undefined,
        startPolling: jasmine.createSpy("start polling") as any,
        stopPolling: jasmine.createSpy("stop polling") as any,
        transition: jasmine.createSpy("transition") as any
      }),
    ],
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup(project: Project, harvest: Harvest, sites: Site[]) {
    spec = createComponent({ detectChanges: false });
    injector = spec.inject(Injector);
    project["injector"] = injector;
    harvest["injector"] = injector;
    stages = spec.inject<SpyObject<HarvestStagesService>>(
      HarvestStagesService as any
    );
    stages.startPolling.and.stub();
    stages.project = project;
    (stages as any).harvest = harvest;
    const siteApi = spec.inject(SHALLOW_SITE.token);
    const subject = new Subject<Site[]>();
    siteApi.filter.and.callFake(() => subject);
    return nStepObservable(subject, () => sites);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultHarvest = new Harvest(generateHarvest({ status: "uploading" }));
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
            description: "WinSCP"
        },
        {
            label: "MacOS",
            description: "Cyberduck"
        },
        {
            label: "Linux",
            description: "SCP"
        },
        {
            label: "R Clone",
            description: "rclone copy"
        }
    ]

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

      })

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

    function getCancelButton() {
      return spec.query("#cancel-btn");
    }

    function getConfirmCancelButton() {
        return spec.query<HTMLButtonElement>("baw-harvest-confirmation-modal #next-btn", { root: true });
    }

    function getModal() {
      return spec.query("baw-harvest-confirmation-modal", { root: true });
    }

    // this test is disabled because it causes the following one to fail if it is run first
    xit("should open cancel modal on cancel click", () => {
      spec.detectChanges();
      const btn = getCancelButton();
      spec.click(btn);
      const modal = getModal();
      expect(modal).toBeTruthy();
      expect(modal).toContainText("Are you sure you want to cancel this upload");
    });

    it ("should cancel upload when modal cancel button is clicked", (done) => {
        spec.click(getCancelButton());
        spec.detectChanges();
        spec.click(getConfirmCancelButton());
        const interval = setInterval(() => {
            spec.detectChanges();
            if (!getConfirmCancelButton()) {
                // if the click worked, the button will disappear and we can check the button action
                expect(stages.transition).toHaveBeenCalledWith("complete");
                clearInterval(interval);
                done();
            }
        }, 150);

    });

  });
});
