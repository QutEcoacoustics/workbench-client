import { RouterTestingModule } from "@angular/router/testing";
import { isApiErrorDetails } from "@baw-api/api.interceptor.service";
import { defaultApiPageSize, Filters } from "@baw-api/baw-api.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { Errorable } from "@helpers/advancedTypes";
import { IRegion, Region } from "@models/Region";
import { NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { CardsComponent } from "@shared/cards/cards.component";
import { DebounceInputComponent } from "@shared/debounce-input/debounce-input.component";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateRegion } from "@test/fakes/Region";
import { nStepObservable } from "@test/helpers/general";
import { assertErrorHandler, assertSpinner } from "@test/helpers/html";
import { Subject } from "rxjs";
import { ListComponent } from "./list.component";

describe("RegionsListComponent", () => {
  let api: SpyObject<ShallowRegionsService>;
  let spec: Spectator<ListComponent>;
  const createComponent = createComponentFactory({
    component: ListComponent,
    imports: [SharedModule, RouterTestingModule, MockBawApiModule],
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
      isApiErrorDetails(models)
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
    return getCardsComponent().cards;
  }

  beforeEach(() => {
    spec = createComponent({ detectChanges: false });
    api = spec.inject(ShallowRegionsService);
  });

  it("should initially request page 1", async () => {
    await handleApiRequest([], (filter) => expect(filter.paging.page).toBe(1));
  });

  it("should handle failed regions model", async () => {
    await handleApiRequest(generateApiErrorDetails());
    assertErrorHandler(spec.fixture, true);
  });

  it("should display loading animation during request", async () => {
    handleApiRequest([]);
    assertSpinner(spec.fixture, true);
  });

  it("should clear loading animation on response", async () => {
    await handleApiRequest([]);
    assertSpinner(spec.fixture, false);
  });

  describe("regions", () => {
    function assertCardTitle(index: number, title: string) {
      expect(getCards().get(index).title).toBe(title);
    }

    function assertCardDescription(index: number, desc: string) {
      expect(getCards().get(index).description).toBe(desc);
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

    it("should display single region card with title", async () => {
      const regions = generateRegions(1);
      await handleApiRequest(regions);
      assertCardTitle(0, regions[0].name);
    });

    it("should display single region card with description", async () => {
      const regions = generateRegions(1, {
        descriptionHtmlTagline: "<b>Custom</b> Description",
      });
      await handleApiRequest(regions);
      assertCardDescription(0, regions[0].descriptionHtmlTagline);
    });

    it("should display multiple region cards", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      expect(getCards().size).toBe(3);
    });

    it("should display multiple region cards in order", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      regions.forEach((region, index) => assertCardTitle(index, region.name));
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
    function getFilter() {
      return spec.query(DebounceInputComponent);
    }

    it("should have filtering option", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      expect(getFilter()).toBeTruthy();
    });

    it("should have default value attached", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      spec.component.filter = "custom value";
      spec.detectChanges();
      expect(getFilter().default).toBe("custom value");
    });

    it("should call onFilter when event detected", async () => {
      const regions = generateRegions(3);
      await handleApiRequest(regions);
      spyOn(spec.component, "onFilter").and.stub();
      getFilter().filter.next("custom value");
      expect(spec.component.onFilter).toHaveBeenCalled();
    });
  });
});
