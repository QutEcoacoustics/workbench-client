import { fakeAsync } from "@angular/core/testing";
import { Direction, Filters } from "@baw-api/baw-api.service";
import { MockModel } from "@models/AbstractModel.spec";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DataTableColumnDirective,
  DatatableComponent,
  DataTableHeaderCellComponent,
  DataTablePagerComponent,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { modelData } from "@test/helpers/faker";
import { BehaviorSubject, delay, Observable, of } from "rxjs";
import { DatatableSortKeyDirective } from "./sort-key.directive";
import { DatatableDefaultsDirective } from "./defaults.directive";
import { DatatablePaginationDirective } from "./pagination.directive";

describe("DatatablePaginationDirective", () => {
  let defaultModels: MockModel[];
  let spec: SpectatorDirective<DatatablePaginationDirective<MockModel>>;
  const createDirective = createDirectiveFactory<
    DatatablePaginationDirective<MockModel>
  >({
    directive: DatatablePaginationDirective,
    declarations: [
      DataTableColumnDirective,
      DatatableDefaultsDirective,
      DatatableSortKeyDirective,
    ],
    imports: [NgxDatatableModule],
  });

  function generateModels(
    modelOpts: {
      numModels: number;
      totalModels?: number;
    } = { numModels: 1 }
  ): void {
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
    columns: { prop: string; sortKey?: string }[] = [{ prop: "id" }],
    detectChanges = true
  ): void {
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
      { hostProps: props, detectChanges }
    );
  }

  function getModels(delayMs?: number): () => Observable<MockModel[]> {
    const obs = of(defaultModels);
    return () => (delayMs ? obs.pipe(delay(delayMs)) : obs);
  }

  function getRows() {
    return spec.queryAll("datatable-row-wrapper");
  }

  function getRowValues(row: number): HTMLElement[] {
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
      expect(spec.query(DatatableComponent).loadingIndicator).toBe(isLoading);
    }

    function flushGetModels() {
      spec.tick(delayMs);
    }

    it("should return false by default", () => {
      generateModels();
      // Turn off change detection so that we get the initial value
      setup({ filters: {}, getModels: getModels(delayMs) }, undefined, false);
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

  describe("total", () => {
    function assertTotal(total: number) {
      expect(spec.query(DatatableComponent).count).toBe(total);
    }

    it("should initially be 0", () => {
      generateModels();
      // Turn off change detection so that we get the initial value
      setup({ filters: {}, getModels: getModels() }, undefined, false);
      assertTotal(0);
    });

    it("should match the metadata of the models returned by the api", () => {
      generateModels({ numModels: 25, totalModels: 100 });
      setup({ filters: {}, getModels: getModels() });
      assertTotal(100);
    });

    it("should be 0 if api returns 0 results", () => {
      generateModels({ numModels: 0 });
      setup({ filters: {}, getModels: getModels() });
      assertTotal(0);
    });
  });

  describe("page", () => {
    function assertPage(page: number) {
      // Offset is the current page number, minus one
      expect(spec.query(DatatableComponent).offset).toBe(page - 1);
    }

    it("should update on page event", () => {
      generateModels({ numModels: 25, totalModels: 100 });
      setup({ filters: {}, getModels: getModels() });
      setPage(2);
      assertPage(2);
    });

    // This is currently not a behaviour of our system
    it("should reset to 0 on filter change", () => {
      const filters$ = new BehaviorSubject<Filters<MockModel>>({});
      generateModels({ numModels: 25, totalModels: 100 });
      setup({ filters: filters$, getModels: getModels() });
      setPage(3);
      assertPage(3);
      filters$.next({ filter: { id: { eq: 1 } } });
      assertPage(1);
    });

    it("should reset to 0 on sort change", () => {
      generateModels({ numModels: 25, totalModels: 100 });
      setup({ filters: {}, getModels: getModels() });
      setPage(2);
      assertPage(2);
      sortColumn(0);
      assertPage(1);
    });
  });

  describe("sorting", () => {
    function assertSort(sortKey: string, direction: Direction = "asc") {
      expect(spec.directive["pageAndSort$"].getValue().sort).toEqual({
        direction,
        orderBy: sortKey as keyof MockModel,
      });
    }

    it("should read sort key from datatable column template", () => {
      generateModels();
      spec = createDirective(
        `
        <ngx-datatable
          bawDatatableDefaults
          [bawDatatablePagination]="{ filters: filters, getModels: getModels }"
        >
          <ngx-datatable-column
            prop="id"
            sortKey="sortKey"
          ></ngx-datatable-column>
        </ngx-datatable>
      `,
        { hostProps: { filters: {}, getModels: getModels() } }
      );
      sortColumn(0);
      assertSort("sortKey");
    });

    it("should use column prop from datatable column template", () => {
      generateModels();
      spec = createDirective(
        `
        <ngx-datatable
          bawDatatableDefaults
          [bawDatatablePagination]="{ filters: filters, getModels: getModels }"
        >
          <ngx-datatable-column prop="id"></ngx-datatable-column>
        </ngx-datatable>
      `,
        { hostProps: { filters: {}, getModels: getModels() } }
      );
      sortColumn(0);
      assertSort("id");
    });

    it("should use column prop from datatable column input", () => {
      generateModels();
      spec = createDirective(
        `
        <ngx-datatable
          bawDatatableDefaults
          [bawDatatablePagination]="{ filters: filters, getModels: getModels }"
          [columns]="columns"
        ></ngx-datatable>
      `,
        {
          hostProps: {
            filters: {},
            getModels: getModels(),
            columns: [{ prop: "id" }],
          },
        }
      );
      sortColumn(0);
      assertSort("id");
    });

    it("should use column name from datatable column input", () => {
      generateModels();
      spec = createDirective(
        `
        <ngx-datatable
          bawDatatableDefaults
          [bawDatatablePagination]="{ filters: filters, getModels: getModels }"
          [columns]="columns"
        ></ngx-datatable>
      `,
        {
          hostProps: {
            filters: {},
            getModels: getModels(),
            columns: [{ name: "Id" }],
          },
        }
      );
      sortColumn(0);
      assertSort("id");
    });

    it("should use sort key from datatable column input", () => {
      generateModels();
      spec = createDirective(
        `
        <ngx-datatable
          bawDatatableDefaults
          [bawDatatablePagination]="{ filters: filters, getModels: getModels }"
          [columns]="columns"
        ></ngx-datatable>
      `,
        {
          hostProps: {
            filters: {},
            getModels: getModels(),
            columns: [{ name: "Id", sortKey: "sortKey" }],
          },
        }
      );
      sortColumn(0);
      assertSort("sortKey");
    });
  });
});
