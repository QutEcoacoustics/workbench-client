import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { Errorable } from "@helpers/advancedTypes";
import { isBawApiError } from "@helpers/custom-errors/baw-api-error";
import { IRegion, Region } from "@models/Region";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { generateBawApiError } from "@test/fakes/BawApiError";
import { generateRegion } from "@test/fakes/Region";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { MockComponent } from "ng-mocks";
import { Subject } from "rxjs";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { RegionListComponent } from "./list.component";

describe("RegionsListComponent", () => {
  let api: SpyObject<ShallowRegionsService>;
  let spec: Spectator<RegionListComponent>;

  const createComponent = createRoutingFactory({
    component: RegionListComponent,
    declarations: [MockComponent(CardsComponent)],
    providers: [provideMockBawApi()],
  });

  function generateRegions(
    numRegions: number,
    overrides: IRegion = {}
  ): Region[] {
    const regions = [];
    for (let i = 0; i < Math.min(numRegions, defaultApiPageSize); i++) {
      const region = new Region(generateRegion(overrides));
      region.addMetadata({
        status: 200,
        message: "OK",
        paging: { total: numRegions },
      });
      regions.push(region);
    }
    return regions;
  }

  async function handleApiRequest(
    models: Errorable<Region[]>,
    assertFilter: (filters: Filters<Region>) => void = () => {}
  ) {
    const subject = new Subject<Region[]>();
    const promise = nStepObservable(
      subject,
      () => models,
      isBawApiError(models)
    );
    api.filter.and.callFake((filters) => {
      assertFilter(filters);
      return subject;
    });

    spec.detectChanges();
    await promise;
    spec.detectChanges();
  }

  function getCardsComponent() {
    return spec.query(CardsComponent);
  }

  function getCards() {
    return getCardsComponent().models;
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ShallowRegionsService);
  });

  assertPageInfo(RegionListComponent, "Sites");

  it("should initially request page 1", async () => {
    await handleApiRequest([], (filter) => expect(filter.paging.page).toBe(1));
  });

  it("should handle failed regions model", async () => {
    await handleApiRequest(generateBawApiError());
    assertErrorHandler(spec.fixture, true);
  });

  describe("regions", () => {
    function assertCard(index: number, model: Region) {
      expect(getCards().get(index)).toBe(model);
    }

    it("should handle zero regions", async () => {
      await handleApiRequest([]);
      const title = spec.query<HTMLHeadingElement>("h4");
      expect(title).toContainText("Your list of sites is empty");
      expect(getCardsComponent()).toBeFalsy();
    });

    it("should display single region card", async () => {
      await handleApiRequest(generateRegions(1));
      expect(getCards().size).toBe(1);
    });

    it("should display single region card", async () => {
      const regions = generateRegions(1);
      await handleApiRequest(regions);
      assertCard(0, regions[0]);
    });

    it("should display multiple region cards", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      expect(getCards().size).toBe(3);
    });

    it("should display multiple region cards in order", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      regions.forEach((region, index) => assertCard(index, region));
    });
  });

  describe("scrolling", () => {
    function getPagination() {
      return spec.query(NgbPagination);
    }

    function getPaginationLinks() {
      return spec.queryAll("ngb-pagination a");
    }

    it("should hide pagination if less than one page of models", async () => {
      const regions = generateRegions(5);
      await handleApiRequest(regions);
      expect(getPagination()).toBeFalsy();
    });

    it("should display pagination if more than one page of models", async () => {
      const regions = generateRegions(defaultApiPageSize * 2);
      await handleApiRequest(regions);
      expect(getPagination()).toBeTruthy();
    });

    it("should display correct number of pages", async () => {
      const regions = generateRegions(defaultApiPageSize * 3);
      await handleApiRequest(regions);
      // 3 Pages, 2 additional options to select forwards and back
      expect(getPaginationLinks().length).toBe(3 + 2);
    });
  });

  describe("filtering", () => {
    function getFilterInput(): HTMLInputElement {
      return spec.query("input[type='text']");
    }

    function getInputDirective() {
      return spec.query(DebouncedInputDirective);
    }

    it("should have filtering option", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      expect(getFilterInput()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      spec.component.filter = "custom value";
      spec.detectChanges();
      expect(getFilterInput()["value"]).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      spyOn(spec.component, "onFilter").and.stub();
      getInputDirective().valueChange.emit("custom value");
      expect(spec.component.onFilter).toHaveBeenCalled();
    });
  });
});
