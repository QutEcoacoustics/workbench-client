import { ShallowSitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Spectator, SpyObject, createRoutingFactory } from "@ngneat/spectator";
import { generateProject } from "@test/fakes/Project";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { of } from "rxjs";
import { ToastService } from "@services/toasts/toasts.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Site } from "@models/Site";
import { generateSite } from "@test/fakes/Site";
import { modelData } from "@test/helpers/faker";
import { appLibraryImports } from "src/app/app.config";
import { clickButton, getElementByTextContent } from "@test/helpers/html";
import { fakeAsync } from "@angular/core/testing";
import { Filters } from "@baw-api/baw-api.service";
import { AssignComponent } from "./assign.component";

// Some functionality for the sites table is not tested in this component because
// it is tested by the PagedTableTemplate.
// e.g. filtering, sorting, pagination, etc.
describe("AssignComponent", () => {
  let mockApi: SpyObject<ShallowSitesService>;
  let spec: Spectator<AssignComponent>;
  let mockProject: Project;
  let mockSites: Site[];

  const createComponent = createRoutingFactory({
    component: AssignComponent,
    imports: appLibraryImports,
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  function setup(): void {
    spec = createComponent({ detectChanges: false });

    mockApi = spec.inject(ShallowSitesService);

    // by using a callback for the mockApi, we can update defaultSites to change the mock return value
    mockApi.filter = jasmine.createSpy("filter") as any;
    mockApi.filter.and.callFake(() => of(mockSites));

    mockApi.show = jasmine.createSpy("show") as any;
    mockApi.show.and.callFake((id) =>
      of(mockSites.find((site) => site.id === id)),
    );

    mockApi.update = jasmine.createSpy("update") as any;
    mockApi.update.and.callFake((model: Site) => of(model));

    spyOnProperty(spec.component, "project", "get").and.callFake(
      () => mockProject,
    );

    spec.detectChanges();
  }

  const projectHeader = () => spec.query<HTMLHeadingElement>("h1");
  const updateButton = () =>
    spec.query<HTMLButtonElement>("button[type='submit']");

  function submitForm(): void {
    clickButton(spec, updateButton());
  }

  function getSiteRow(siteName: string): HTMLElement {
    return getElementByTextContent(spec, siteName).parentElement.parentElement;
  }

  function getSiteCheckbox(siteName: string): HTMLInputElement {
    const siteRow = getSiteRow(siteName);
    const siteCheckbox = siteRow.querySelector<HTMLInputElement>(
      "input[type='checkbox']",
    );

    return siteCheckbox;
  }

  function selectSite(model: Site): void {
    const siteCheckbox = getSiteCheckbox(model.name);

    if (!siteCheckbox.checked) {
      spec.click(siteCheckbox);
    }
  }

  function deselectSite(model: Site): void {
    const siteCheckbox = getSiteCheckbox(model.name);

    if (siteCheckbox.checked) {
      spec.click(siteCheckbox);
    }
  }

  beforeEach(() => {
    const defaultMetadata = {
      paging: { items: 1, page: 0, total: 1, maxPage: 5 },
    };

    // I set the id to the index of the array and use the index in the name so that each name and id is unique
    // this is because without unique names and ids, there is a possibility that the tests will fail because
    // two sites with the same id and name will be generated
    mockSites = modelData.randomArray(5, 10, (id: number) => {
      const site = new Site(
        generateSite({
          id,
          name: `${modelData.param()}-${id}`,
          projectIds: [],
        }),
      );

      site.addMetadata(defaultMetadata);

      return site;
    });

    mockProject = new Project(generateProject({ id: 0, siteIds: [] }));
  });

  assertPageInfo(AssignComponent, "Assign Sites");

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(AssignComponent);
  });

  it("should display project in title", () => {
    setup();
    const expectedText = mockProject.name;
    expect(projectHeader()).toHaveExactTrimmedText(expectedText);
  });

  it("should display descriptive text", () => {
    setup();
    const descriptionElementText = [
      "Select the sites to be part of this project, and click 'Update' at the bottom of this page.",
      "Only the selected sites will be part of this project.",
    ];

    descriptionElementText.forEach((text) => {
      expect(getElementByTextContent(spec, text)).toExist();
    });
  });

  fit("should send the correct filter request on initialization", () => {
    setup();
    const expectedRequest: Filters = { paging: { page: 1 } };
    expect(mockApi.filter).toHaveBeenCalledWith(expectedRequest);
  });

  it("should call onSubmit when the update button is clicked", () => {
    setup();
    spyOn(spec.component, "onSubmit");

    submitForm();

    expect(spec.component.onSubmit).toHaveBeenCalled();
  });

  it("should make the correct api call for removing a site from a project", fakeAsync(() => {
    // because we are removing the site from the project, we will be expecting the site to be called with no projectIds
    const expectedProjectIds = new Set([]);

    const mockProjectId = 0;
    const mockSiteId = 42;

    const mockSite = new Site(
      generateSite({ id: mockSiteId, projectIds: [mockProjectId] }),
    );
    mockSite.addMetadata({
      paging: { items: 1, page: 0, total: 1, maxPage: 5 },
    });

    mockSites = [mockSite];
    mockProject = new Project(
      generateProject({ id: 0, siteIds: [mockSiteId] }),
    );

    setup();

    deselectSite(mockSites[0]);
    submitForm();

    expect(mockApi.update).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        projectIds: expectedProjectIds,
      }),
    );
  }));

  it("should make the correct api call for adding a site to a project", () => {
    setup();
    selectSite(mockSites[0]);
    const expectedProjectIds = new Set([mockProject.id]);

    submitForm();

    expect(mockApi.update).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        projectIds: expectedProjectIds,
      }),
    );
  });

  it("should not make any api requests when selecting and deselecting the same site", () => {
    setup();
    selectSite(mockSites[0]);
    deselectSite(mockSites[0]);

    submitForm();

    expect(mockApi.update).not.toHaveBeenCalled();
  });
});
