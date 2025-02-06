import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ApiFilter } from "@baw-api/api-common";
import {
  defaultApiPageSize,
  Filters,
  InnerFilter,
  Paging,
} from "@baw-api/baw-api.service";
import { ApiErrorDetails } from "@helpers/custom-errors/baw-api-error";
import { AbstractModel } from "@models/AbstractModel";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { BehaviorSubject, Subject } from "rxjs";

/**
 * Get all rows from datatable component
 */
export function getDatatableRows(
  fixture: ComponentFixture<any>
): HTMLElement[] {
  return fixture.nativeElement.querySelectorAll("datatable-body-row");
}

/**
 * Get all cells from a row of a datatable component
 *
 * @param row Row to query
 */
export function getDatatableCells(row: any): HTMLElement[] {
  return row.querySelectorAll("datatable-body-cell");
}

function assignModelMetadata(models: AbstractModel[], paging: Paging) {
  models.forEach((model) => {
    model.addMetadata({
      message: "OK",
      status: 200,
      paging,
    });
  });
}

/**
 * Mock an API response for the datatable component
 *
 * @param api Filter API
 * @param models Models to return
 * @param paging Override paging defaults
 */
export function datatableApiResponse<M extends AbstractModel>(
  api: ApiFilter<M, any[]>,
  models: M[],
  paging?: Paging,
  apiAction: string = "filter"
) {
  paging = {
    page: 1,
    items: defaultApiPageSize,
    total: models.length,
    maxPage: 1,
    ...paging,
  };

  assignModelMetadata(models, paging);
  api[apiAction].and.callFake(() => new BehaviorSubject<M[]>(models));
}

/**
 * Assert pagination for the datatable has been properly implemented in component.
 * Expects that api, fixture, and defaultModels are saved to `this`. Make sure to call
 * `function()` instead of `() =>` when using functions which depend on `this` as the
 * arrow function re-declares `this` and tests will fail.
 */
export function assertPagination<
  MockModel extends AbstractModel,
  TestedService extends ApiFilter<MockModel, any[]>
>(apiAction: string = "filter") {
  describe("pagination", function () {
    let api: TestedService;
    let defaultModels: MockModel[];

    /**
     * Default inner filters that will be present in all requests.
     * This is useful if the pagination table is scoped to a model
     * e.g. project.
     */
    let defaultInnerFilters: InnerFilter<MockModel> = {};
    let defaultPaging: Paging;
    let fixture: ComponentFixture<any>;

    function assertSecondRequestFilters(
      done: () => void,
      expectation: Filters,
      models: MockModel[]
    ) {
      let secondRequest = false;
      const paging = {
        page: 1,
        items: defaultApiPageSize,
        total: 100,
        maxPage: 4,
      };

      assignModelMetadata(models, paging);
      api[apiAction].and.callFake((filter: Filters) => {
        if (secondRequest) {
          expect(filter).toEqual(expectation);
          done();
        }

        secondRequest = true;
        return new BehaviorSubject<MockModel[]>(models);
      });
    }

    function apiErrorResponse(error: ApiErrorDetails) {
      api[apiAction].and.callFake(() => {
        const subject = new Subject<MockModel[]>();
        subject.error(error);
        return subject;
      });
    }

    function hasPager() {
      return !fixture.nativeElement.querySelector("datatable-pager").hidden;
    }

    function getPagerButtons() {
      return fixture.nativeElement.querySelectorAll("datatable-pager li");
    }

    /**
     * Click button after a period of time. This is to allow the
     * first response to complete before sending a second request.
     *
     * @param button Button Element
     */
    function click(button: HTMLButtonElement) {
      setTimeout(() => {
        button.click();
        fixture.detectChanges();
      }, 0);
    }

    function buildExpectedFilters(
      paging?: Paging,
      filter: InnerFilter<MockModel> = defaultInnerFilters
    ): Filters {
      const result: Filters = {};

      if (filter) {
        result.filter = filter;
      }
      if (paging) {
        result.paging = paging;
      }

      return result;
    }

    beforeEach(function () {
      api = this.api;
      fixture = this.fixture;
      defaultModels = this.defaultModels;
      defaultInnerFilters = this.defaultInnerFilters;
      defaultPaging = {
        page: 1,
        items: defaultApiPageSize,
        total: 1,
        maxPage: 1,
      };
    });

    it(`should send ${apiAction} request`, () => {
      datatableApiResponse(api, [], undefined, apiAction);
      fixture.detectChanges();
      expect(api[apiAction]).toHaveBeenCalledWith(buildExpectedFilters());
    });

    it("should request the second page from api", (done) => {
      assertSecondRequestFilters(done, buildExpectedFilters({ page: 2 }), [
        defaultModels[0],
      ]);
      fixture.detectChanges();

      const pageBtn = fixture.nativeElement.querySelectorAll("li.pages a")[1];
      click(pageBtn);
    });

    it("should request next page from api", (done) => {
      assertSecondRequestFilters(done, buildExpectedFilters({ page: 2 }), [
        defaultModels[0],
      ]);
      fixture.detectChanges();

      const pager = fixture.nativeElement.querySelector("datatable-pager");
      const pageBtn = pager.querySelectorAll("li a")[6];
      click(pageBtn);
    });

    it("should request final page from api", (done) => {
      assertSecondRequestFilters(done, buildExpectedFilters({ page: 4 }), [
        defaultModels[0],
      ]);
      fixture.detectChanges();

      const pager = fixture.nativeElement.querySelector("datatable-pager");
      const pageBtn = pager.querySelectorAll("li a")[7];
      click(pageBtn);
    });

    it("should handle api request failure", () => {
      apiErrorResponse({ status: 401, message: "Unauthorized" });
      fixture.detectChanges();

      const errorHandler: ErrorHandlerComponent = fixture.debugElement.query(
        By.css("baw-error-handler")
      ).componentInstance;
      expect(errorHandler).toBeTruthy();

      expect(errorHandler.error).toEqual({
        status: 401,
        message: "Unauthorized",
      });
    });

    it("should handle no rows", () => {
      datatableApiResponse(api, [], undefined, apiAction);
      fixture.detectChanges();

      const rows = getDatatableRows(fixture);
      expect(rows.length).toBe(0);
      expect(hasPager()).toBeFalse();
    });

    it("should handle single row", () => {
      datatableApiResponse(api, [defaultModels[0]], defaultPaging, apiAction);
      fixture.detectChanges();

      const rows = getDatatableRows(fixture);
      expect(rows.length).toBe(1);
      expect(hasPager()).toBeFalse();
    });

    it("should handle full api page response", () => {
      datatableApiResponse(
        api,
        defaultModels,
        { total: defaultApiPageSize },
        apiAction
      );
      fixture.detectChanges();

      const rows = getDatatableRows(fixture);
      expect(rows.length).toBe(defaultApiPageSize);
      expect(hasPager()).toBeFalse();
    });

    it("should handle 4 pages", () => {
      datatableApiResponse(
        api,
        [defaultModels[0]],
        { total: 100, maxPage: 4 },
        apiAction
      );
      fixture.detectChanges();

      const pager = getPagerButtons();
      expect(hasPager()).toBeTrue();
      expect(pager.length).toBe(8);
    });
  });
}
