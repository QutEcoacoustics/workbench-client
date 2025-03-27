import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DataTableColumnDirective,
  DataTablePagerComponent,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { MockModel } from "@models/AbstractModel.spec";
import { Observable } from "rxjs";
import { modelData } from "@test/helpers/faker";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { DatatableDefaultsDirective } from "../defaults/defaults.directive";
import { DatatableSortKeyDirective } from "../sort-key/sort-key.directive";
import { DatatablePaginationDirective } from "../pagination/pagination.directive";
import {
  VirtualDatabaseModelInput,
  VirtualDatatablePaginationDirective,
} from "./virtual-datatable-pagination.directive";

// because this directive extends the bawDatatablePagination directive, most of
// the table rendering logic is tested elsewhere. This spec will focus on the
// virtual scrolling logic and providing the data to the table
describe("bawVirtualDatatablePagination", () => {
  let spec: SpectatorDirective<VirtualDatatablePaginationDirective<MockModel>>;
  let mockedModels: any[];

  const createDirective = createDirectiveFactory({
    directive: VirtualDatatablePaginationDirective<MockModel>,
    declarations: [DataTableColumnDirective],
    imports: [
      NgxDatatableModule,
      DatatablePaginationDirective,
      DatatableDefaultsDirective,
      DatatableSortKeyDirective,
    ],
  });

  function createModels(
    itemCount: number
  ): VirtualDatabaseModelInput<MockModel> {
    mockedModels = modelData.randomArray(itemCount, itemCount, () => {
      return new MockModel({
        id: modelData.id(),
        name: modelData.random.word(),
      });
    });

    return () =>
      new Observable((subscriber) => {
        subscriber.next(mockedModels);
      });
  }

  function getRows() {
    return spec.queryAll("datatable-row-wrapper");
  }

  function getTotalItemsCount(): number {
    const totalCountOutput = spec.query(".page-count");

    // this is a "hacky" way to get the total count
    // it works because parseInt will ignore any non-numeric characters
    // because the page-count element will display text like "50 total", the
    // parseInt will only return the number (50 in the example)
    return parseInt(totalCountOutput.textContent);
  }

  function getTotalPagesCount(): number {
    const pageNumbers = spec.queryAll(".pages");
    const lastPage = pageNumbers.at(-1);
    return parseInt(lastPage.textContent);
  }

  function getRowValues(row: number): HTMLElement[] {
    return spec.queryAll(
      `datatable-row-wrapper:nth-child(${row + 1}) datatable-body-cell`
    );
  }

  function setPage(page: number) {
    spec.query(DataTablePagerComponent).selectPage(page);
    spec.detectChanges();
  }

  function assertRowValues(row: number, values: string[]) {
    const rowValues = getRowValues(row);
    expect(rowValues.length).toEqual(values.length);

    for (const i in values) {
      const expectedValue = values[i].toString();
      const realizedValue = rowValues[i].textContent;
      expect(realizedValue).toEqual(expectedValue);
    }
  }

  function setup(
    props: Partial<VirtualDatatablePaginationDirective<MockModel>> = {}
  ) {
    spec = createDirective(
      `
      <ngx-datatable
        bawDatatableDefaults
        [bawVirtualDatatablePagination]="models$"
      >
        <ngx-datatable-column prop="id"></ngx-datatable-column>
        <ngx-datatable-column prop="name"></ngx-datatable-column>
      </ngx-datatable>
    `,
      { hostProps: props }
    );
  }

  it("should display an empty table when no models are provided", () => {
    setup({ models$: undefined } as any);
    expect(getRows()).toHaveLength(0);
  });

  it("should return a single page of results correctly", () => {
    setup({ models$: createModels(defaultApiPageSize) } as any);
    expect(getRows()).toHaveLength(defaultApiPageSize);
  });

  it("should only return the number of models specified by the row limit", () => {
    const expectedRowCount = defaultApiPageSize;

    setup({ models$: createModels(expectedRowCount * 2) } as any);
    expect(getRows()).toHaveLength(expectedRowCount);
  });

  it("should have the correct number of total items", () => {
    const mockItemCount = defaultApiPageSize;

    setup({ models$: createModels(mockItemCount * 2) } as any);
    expect(getTotalItemsCount()).toEqual(mockItemCount * 2);
  });

  it("should have the correct number of total pages", () => {
    const mockItemCount = defaultApiPageSize;
    const expectedPageCount = 4;

    setup({ models$: createModels(mockItemCount * expectedPageCount) } as any);
    expect(getTotalPagesCount()).toEqual(expectedPageCount);
  });

  it("should page correctly", () => {
    setup({ models$: createModels(defaultApiPageSize * 3) } as any);

    // assert that the first row on the first page is correct
    const firstPageModel = mockedModels[0];
    assertRowValues(0, [firstPageModel.id, firstPageModel.name]);

    // test paging forwards
    setPage(2);
    const secondPageModel = mockedModels[defaultApiPageSize];
    assertRowValues(0, [secondPageModel.id, secondPageModel.name]);

    // test paging backwards
    setPage(1);
    assertRowValues(0, [firstPageModel.id, firstPageModel.name]);
  });
});
