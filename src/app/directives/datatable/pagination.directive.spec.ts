import { fakeAsync } from "@angular/core/testing";
import { Filters } from "@baw-api/baw-api.service";
import { MockModel } from "@models/AbstractModel.spec";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DataTableColumnDirective,
  DataTableHeaderCellComponent,
  DataTablePagerComponent,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { modelData } from "@test/helpers/faker";
import { BehaviorSubject, delay, of } from "rxjs";
import { DatatableDirective } from "./datatable.directive";
import { DatatablePaginationDirective } from "./pagination.directive";

describe("DatatablePaginationDirective", () => {
  let defaultModels: MockModel[];
  let spec: SpectatorDirective<DatatablePaginationDirective<MockModel>>;
  const createDirective = createDirectiveFactory<
    DatatablePaginationDirective<MockModel>
  >({
    directive: DatatablePaginationDirective,
    declarations: [DataTableColumnDirective, DatatableDirective],
    imports: [NgxDatatableModule],
  });

  function generateModels(
    modelOpts: {
      numModels: number;
      totalModels?: number;
    } = { numModels: 1 }
  ) {
    const models: MockModel[] = [];
    for (let i = 0; i < modelOpts.numModels; i++) {
      const model = new MockModel({ id: i, name: modelData.random.word() });
      model.addMetadata({
        paging: {
          items: modelOpts.numModels,
          total: modelOpts?.totalModels ?? modelOpts.numModels,
          page: 0,
          maxPage: 5,
        },
      });
      models.push(model);
    }
    defaultModels = models;
  }

  function setup(
    props: Partial<DatatablePaginationDirective<MockModel>>,
    columns: { prop: string; sortKey?: string }[] = [{ prop: "id" }]
  ) {
    const columnsHtml = columns
      .map(
        (column) =>
          `<ngx-datatable-column
            prop="${column.prop}"
            ${column.sortKey ? `sortKey="${column.sortKey}"` : ""}
          ></ngx-datatable-column>`
      )
      .join("");

    spec = createDirective(
      `
      <ngx-datatable
        bawDatatableDefaults
        [bawDatatablePagination]="{ filters: filters, getModels: getModels }"
      >${columnsHtml}</ngx-datatable>
    `,
      { hostProps: props }
    );
  }

  function getModels(delayMs?: number) {
    const obs = of(defaultModels);
    return () => (delayMs ? obs.pipe(delay(delayMs)) : obs);
  }

  function getRows() {
    return spec.queryAll("datatable-row-wrapper");
  }

  function getRowValues(row: number) {
    return spec.queryAll(
      `datatable-row-wrapper:nth-child(${row + 1}) datatable-body-cell`
    );
  }

  function setPage(page: number) {
    spec.query(DataTablePagerComponent).selectPage(page);
  }

  function sortColumn(column: number) {
    spec.queryAll(DataTableHeaderCellComponent)[column].onSort();
  }

  describe("rows", () => {
    it("should output model as row in a single column datatable", () => {
      generateModels({ numModels: 3 });
      setup({ filters: {}, getModels: getModels() }, [{ prop: "id" }]);

      const rows = getRows();
      expect(rows).toHaveLength(3);

      defaultModels.forEach((model, index) => {
        const row = getRowValues(index);
        expect(row).toHaveLength(1);
        expect(row[0]).toHaveText(model.id.toString());
      });
    });

    it("should output model as row in a multi column datatable", () => {
      generateModels({ numModels: 3 });
      setup({ filters: {}, getModels: getModels() }, [
        { prop: "id" },
        { prop: "name" },
      ]);
      const rows = getRows();
      expect(rows).toHaveLength(3);

      defaultModels.forEach((model, index) => {
        const row = getRowValues(index);
        expect(row).toHaveLength(2);
        expect(row[0]).toHaveText(model.id.toString());
        expect(row[1]).toHaveText(model["name"].toString());
      });
    });
  });

  describe("loading", () => {
    const delayMs = 10000;

    function assertLoading(isLoading: boolean) {
      expect(spec.directive["loading$"].getValue()).toBe(isLoading);
    }

    function flushGetModels() {
      spec.tick(delayMs);
    }

    it("should return false by default", () => {
      generateModels();
      setup({ filters: {}, getModels: getModels() });
      assertLoading(false);
    });

    it("should return true on first load", () => {
      generateModels();
      // Delay getting models so that loading will still be set
      setup({ filters: {}, getModels: getModels(delayMs) });
      assertLoading(true);
    });

    it("should return true on filter change", fakeAsync(() => {
      const filter$ = new BehaviorSubject<Filters<MockModel>>({});
      generateModels();
      // Delay getting models so that loading will still be set
      setup({ filters: filter$, getModels: getModels(delayMs) });
      flushGetModels();
      assertLoading(false);
      filter$.next({ filter: { id: { eq: 1 } } });
      assertLoading(true);
      // Clear timeouts so test wont complain
      flushGetModels();
    }));

    it("should return true on page change", fakeAsync(() => {
      generateModels({ numModels: 25, totalModels: 100 });
      // Delay getting models so that loading will still be set
      setup({ filters: {}, getModels: getModels(delayMs) });
      flushGetModels();
      assertLoading(false);
      setPage(3);
      assertLoading(true);
      flushGetModels();
    }));

    it("should return true on sort change", fakeAsync(() => {
      generateModels({ numModels: 25, totalModels: 100 });
      // Delay getting models so that loading will still be set
      setup({ filters: {}, getModels: getModels(delayMs) });
      flushGetModels();
      assertLoading(false);
      sortColumn(0);
      assertLoading(true);
      flushGetModels();
    }));

    it("should return false when models returned", fakeAsync(() => {
      generateModels();
      // Delay getting models so that loading will still be set
      setup({ filters: {}, getModels: getModels(delayMs) });
      assertLoading(true);
      flushGetModels();
      assertLoading(false);
    }));
  });

  xdescribe("total", () => {});

  xdescribe("page", () => {});

  xdescribe("onSortChange", () => {});

  xdescribe("onPageChange", () => {});
});
