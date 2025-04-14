import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { NewComponent } from "@components/regions/pages/new/new.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Project } from "@models/Project";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateProject } from "@test/fakes/Project";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { SiteNewComponent } from "../new/new.component";
import { WizardComponent } from "./wizard.component";

const mock = {
  newRegion: MockComponent(NewComponent),
  newSite: MockComponent(SiteNewComponent),
};

describe("WizardComponent", () => {
  let defaultProject: Project;
  let spectator: SpectatorRouting<WizardComponent>;

  const createComponent = createRoutingFactory({
    imports: [MockBawApiModule],
    declarations: [mock.newRegion, mock.newSite],
    component: WizardComponent,
  });

  function setup(project: Project, error?: BawApiError) {
    spectator = createComponent({
      detectChanges: false,
      data: {
        resolvers: { project: projectResolvers.show },
        project: { model: project, error },
      },
    });
  }

  function getWizardOptions() {
    return spectator.queryAll<HTMLButtonElement>("button");
  }

  function getNewSitesForm() {
    return spectator.query(SiteNewComponent);
  }

  function getNewRegionsForm() {
    return spectator.query(NewComponent);
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  assertPageInfo(WizardComponent, "New Site");

  it("should create", () => {
    setup(defaultProject);
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it("should handle project error", () => {
    setup(undefined, generateBawApiError());
    spectator.detectChanges();
    assertErrorHandler(spectator.fixture);
  });

  it("should show new site title", () => {
    setup(defaultProject);
    spectator.detectChanges();
    const title = spectator.query<HTMLHeadingElement>("h2");
    expect(title.innerText.trim()).toBe("New Site");
  });

  it("should show wizard question", () => {
    setup(defaultProject);
    spectator.detectChanges();
    const question = spectator.query<HTMLHeadingElement>("p.lead");
    expect(question.innerText.trim()).toBeTruthy();
  });

  it("should show wizard buttons", () => {
    setup(defaultProject);
    spectator.detectChanges();
    expect(getWizardOptions().length).toBe(2);
  });

  it("should show new sites form on selection", () => {
    setup(defaultProject);
    spectator.detectChanges();
    const buttons = getWizardOptions();
    buttons[0].click();
    spectator.detectChanges();
    expect(getNewSitesForm()).toBeFalsy();
    expect(getNewRegionsForm()).toBeTruthy();
  });

  it("should show new regions form on selection", () => {
    setup(defaultProject);
    spectator.detectChanges();
    const buttons = getWizardOptions();
    buttons[1].click();
    spectator.detectChanges();
    expect(getNewSitesForm()).toBeTruthy();
    expect(getNewRegionsForm()).toBeFalsy();
  });

  it("should switch between forms", () => {
    setup(defaultProject);
    spectator.detectChanges();
    const buttons = getWizardOptions();
    buttons[0].click();
    spectator.detectChanges();
    buttons[1].click();
    spectator.detectChanges();
    expect(getNewSitesForm()).toBeTruthy();
    expect(getNewRegionsForm()).toBeFalsy();
  });
});
