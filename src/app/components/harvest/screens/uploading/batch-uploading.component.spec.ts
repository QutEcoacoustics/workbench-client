import { Injector } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateHarvest } from "@test/fakes/Harvest";
import { generateProject } from "@test/fakes/Project";
import { BatchUploadingComponent } from "./batch-uploading.component";

describe("BatchUploadingComponent", () => {
    let spec: SpectatorRouting<BatchUploadingComponent>;
    let defaultProject: Project;
    let defaultHarvest: Harvest;
    let stages: HarvestStagesService;
    let injector: Injector;
    const createComponent = createRoutingFactory({
        component: BatchUploadingComponent
    });

    function setup(
        project: Project,
        harvest: Harvest
    ) {
        spec = createComponent({ detectChanges: false });
        injector = spec.inject(Injector);
        project["injector"] = injector;
        harvest["injector"] = injector;
        stages = spec.inject(HarvestStagesService);
        stages.initialize(project, harvest);
    }

    beforeEach(() => {
        defaultProject = new Project(generateProject());
        defaultHarvest = new Harvest(generateHarvest({ status: "uploading" }));

    });

    it("should create", () => {
        setup(defaultProject, defaultHarvest);
        spec.detectChanges();
        expect(spec.component).toBeInstanceOf(BatchUploadingComponent);
    });
});
