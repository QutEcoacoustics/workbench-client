import { CmsService } from "@baw-api/cms/cms.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { Errorable } from "@helpers/advancedTypes";
import { Settings } from "@helpers/app-initializer/app-initializer";
import { IProject, Project } from "@models/Project";
import { IRegion, Region } from "@models/Region";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { ConfigService } from "@services/config/config.service";
import { testApiConfig } from "@services/config/configMock.service";
import { IconsModule } from "@shared/icons/icons.module";
import { CardComponent } from "@shared/model-cards/card/card.component";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { generateRegion } from "@test/fakes/Region";
import { interceptFilterApiRequest } from "@test/helpers/general";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { BehaviorSubject } from "rxjs";
import { LoadingComponent } from "@shared/loading/loading.component";
import { AsyncPipe, TitleCasePipe, UpperCasePipe } from "@angular/common";
import { WithLoadingPipe } from "@pipes/with-loading/with-loading.pipe";
import { provideMockConfig } from "@services/config/provide-configMock";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let regionApi: SpyObject<ShallowRegionsService>;
  let projectApi: SpyObject<ProjectsService>;
  let cmsService: SpyObject<CmsService>;
  let config: ConfigService;
  let spec: Spectator<HomeComponent>;

  const createComponent = createRoutingFactory({
    component: HomeComponent,
    declarations: [CardsComponent, MockComponent(CardComponent)],
    imports: [
      IconsModule,
      LoadingComponent,
      AsyncPipe,
      UpperCasePipe,
      TitleCasePipe,
      WithLoadingPipe,
    ],
    providers: [provideMockConfig(), provideMockBawApi()],
  });

  async function awaitRegions(regions: Errorable<Region[]>) {
    const promise = interceptFilterApiRequest<IRegion, Region>(
      regionApi,
      undefined,
      regions,
      Region
    );
    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  async function awaitProjects(projects: Errorable<Project[]>) {
    const promise = interceptFilterApiRequest<IProject, Project>(
      projectApi,
      undefined,
      projects,
      Project
    );
    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function setConfigHideProjects(hidden: boolean) {
    spyOnProperty(config, "settings").and.callFake(
      () => ({ ...testApiConfig.settings, hideProjects: !!hidden } as Settings)
    );
    config.settings.hideProjects = hidden;
  }

  function getModelCards(): CardsComponent {
    return spec.query(CardsComponent);
  }

  function assertModelCardsCount(count: number) {
    expect(getModelCards()?.models?.count() ?? 0).toBe(count);
  }

  function getViewMoreButton(): HTMLAnchorElement {
    return spec.query("#viewMore");
  }

  function assertErrorPlaceholder(modelName?: string) {
    expect(spec.query("#error")).toContainText(`Unable to load ${modelName}`);
  }

  function assertViewMorePlaceholder(exists?: boolean, modelName?: string) {
    const placeholder = spec.query("#placeholder");
    if (exists) {
      expect(placeholder).toContainText(`No ${modelName}s to display`);
    } else {
      expect(placeholder).toBeFalsy();
    }
  }

  function handleCms() {
    cmsService = spec.inject(CmsService);
    cmsService.get.and.callFake(() => new BehaviorSubject("cms content"));
  }

  assertPageInfo(HomeComponent, "Home");

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    projectApi = spec.inject(ProjectsService);
    regionApi = spec.inject(ShallowRegionsService);
    config = spec.inject(ConfigService);
  });

  // TODO Re-enable once cms is setup
  /* assertCms<HomeComponent>(async () => {
    projectApi.filter.and.callFake(() => new Subject());
    return spec;
  }, CMS.home); */

  [
    {
      test: "projects",
      api: () => projectApi,
      modelName: "Project",
      hideProjects: false,
      awaitModel: awaitProjects,
      generateModel: () => new Project(generateProject()),
      link: projectsMenuItem.route,
    },
    {
      test: "regions",
      api: () => regionApi,
      modelName: "Site",
      hideProjects: true,
      awaitModel: awaitRegions,
      generateModel: () => new Region(generateRegion()),
      link: shallowRegionsMenuItem.route,
    },
  ].forEach((test) => {
    describe(`${test.test} api`, () => {
      beforeEach(() => {
        handleCms();
        setConfigHideProjects(test.hideProjects);
      });

      it(`should request 3 ${test.test} when hideProjects is ${test.hideProjects}`, async () => {
        await test.awaitModel([test.generateModel() as any]);
        expect(test.api().filter).toHaveBeenCalledWith({
          paging: { items: 3 },
          sorting: { orderBy: "updatedAt", direction: "desc" },
        });
      });

      it("should handle filter error", async () => {
        await test.awaitModel(generateBawApiError());
        assertModelCardsCount(0);
        assertErrorPlaceholder(test.modelName);
      });
    });

    describe(`${test.test} cards`, () => {
      beforeEach(() => {
        handleCms();
        setConfigHideProjects(test.hideProjects);
      });

      it("should create", async () => {
        await test.awaitModel([test.generateModel() as any]);
        expect(spec.component).toBeTruthy();
      });

      it("should handle empty array", async () => {
        await test.awaitModel([]);
        assertModelCardsCount(0);
        assertViewMorePlaceholder(true, test.modelName);
      });

      it("should display single model", async () => {
        const model: any = test.generateModel();
        await test.awaitModel([model]);
        assertModelCardsCount(1);
        expect(getModelCards().models.first()).toEqual(model);
        expect(getViewMoreButton()).toBeTruthy();
      });

      it("should display multiple models", async () => {
        const models: any[] = [
          test.generateModel(),
          test.generateModel(),
          test.generateModel(),
        ];
        await test.awaitModel(models);

        const cards = getModelCards().models;
        assertModelCardsCount(3);
        models.forEach((model, index) =>
          expect(cards.get(index)).toEqual(model)
        );
        expect(getViewMoreButton()).toBeTruthy();
      });

      it("should link to model details page", async () => {
        await test.awaitModel([test.generateModel() as any]);

        const button = getViewMoreButton();
        expect(button).toHaveText(`More ${test.modelName}s`);
        expect(button).toHaveStrongRoute(test.link);
      });
    });
  });
});
