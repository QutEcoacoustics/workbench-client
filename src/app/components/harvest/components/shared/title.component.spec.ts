import { fakeAsync, tick } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { ToastService } from "@services/toasts/toasts.service";
import { IconsModule } from "@shared/icons/icons.module";
import { generateHarvest } from "@test/fakes/Harvest";
import { generateProject } from "@test/fakes/Project";
import { of } from "rxjs";
import { TitleComponent } from "./title.component";

describe("titleComponent", () => {
  let spectator: Spectator<TitleComponent>;
  let mockHarvest: Harvest;
  let mockProject: Project;

  const createComponent = createComponentFactory({
    component: TitleComponent,
    imports: [FormsModule, IconsModule],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  function setup(): SpyObject<ShallowHarvestsService> {
    spectator = createComponent({
      props: {
        project: mockProject,
        harvest: mockHarvest,
      },
      detectChanges: false,
    });

    const harvestApi = spectator.inject(ShallowHarvestsService);
    harvestApi.updateName.and.returnValue(of(mockHarvest));

    spectator.detectChanges();

    return harvestApi;
  }

  const getHarvestTitle = (): HTMLElement =>
    spectator.query("form");

  const getNameEditButton = (): HTMLElement =>
    spectator.query("sub");

  const getNameEditInput = (): HTMLInputElement =>
    spectator.debugElement.query(By.css("input[name='harvestNameInput']")).nativeElement;

  beforeEach(() => {
    mockHarvest = new Harvest(generateHarvest({ status: "metadataReview" }));
    mockProject = new Project(generateProject());
  });

  it("should create", () => {
    setup();
    expect(spectator.component).toBeInstanceOf(TitleComponent);
  });

  it("should display the name of the project and harvest", () => {
    setup();
    const expectedTitle = `Upload Recordings: ${mockHarvest.name}`;

    expect(getHarvestTitle().innerText).toEqual(expectedTitle);
  });

  it("should not attempt to load the harvest name when a Harvest model is not initialized", () => {
    mockHarvest = undefined;
    setup();

    expect(getHarvestTitle()).toBeNull();
  });

  it("should display an input box with the name of the Harvest when the pencil edit icon is clicked", fakeAsync(() => {
    setup();

    getNameEditButton().click();
    spectator.detectChanges();

    // we have to wait for the edit button to be clicked before the edit input exists
    const nameEditInput = getNameEditInput();
    expect(nameEditInput).toExist();

    spectator.detectChanges();
    tick();
    spectator.detectChanges();

    expect(nameEditInput.value).toEqual(mockHarvest.name);
  }));

  it("should call the updateName() harvest service when the harvest name is changed", fakeAsync(() => {
    const newHarvestName = "this is a new name";
    const mockHarvestApi = setup();

    getNameEditButton().click();
    spectator.detectChanges();
    tick();
    spectator.detectChanges();

    const nameEditInput = getNameEditInput();

    // change the value/text of the harvest name editor input box
    nameEditInput.value = newHarvestName;
    // changing the input box value doesn't trigger the "input" event needed to
    // trigger the ng change detection, so trigger the event manually
    nameEditInput.dispatchEvent(new Event("input"));

    spectator.detectChanges();
    tick();
    spectator.detectChanges();

    // submit the ngForm. This should trigger the harvest name to be updated
    spectator.debugElement.query(By.css("form")).triggerEventHandler("submit", null);

    spectator.detectChanges();
    tick();
    spectator.detectChanges();

    expect(mockHarvestApi.updateName).toHaveBeenCalledWith(mockHarvest, newHarvestName);
  }));
});
