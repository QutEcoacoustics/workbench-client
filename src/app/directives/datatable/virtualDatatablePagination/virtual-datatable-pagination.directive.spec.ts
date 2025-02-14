import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DataTableColumnDirective,
  DataTablePagerComponent,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { MockModel } from "@models/AbstractModel.spec";
import { Observable, Subscriber } from "rxjs";
import { modelData } from "@test/helpers/faker";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { DatatableDefaultsDirective } from "../defaults/defaults.directive";
import { DatatableSortKeyDirective } from "../sort-key/sort-key.directive";
import { DatatablePaginationDirective } from "../pagination/pagination.directive";
import { VirtualDatatablePaginationDirective } from "./virtual-datatable-pagination.directive";

// because this directive extends the bawDatatablePagination directive, most of
// the table rendering logic is tested elsewhere. This spec will focus on the
// virtual scrolling logic and providing the data to the table
describe("bawVirtualDatatablePagination", () => {
  let spec: SpectatorDirective<VirtualDatatablePaginationDirective<MockModel>>;
  let mockedModels: MockModel[];
  let mockedModelSubscriber: Subscriber<MockModel[]>;

  const createDirective = createDirectiveFactory<
    VirtualDatatablePaginationDirective<MockModel>
  >({
    directive: VirtualDatatablePaginationDirective,
    declarations: [
      DatatablePaginationDirective,
      DataTableColumnDirective,
      DatatableDefaultsDirective,
      DatatableSortKeyDirective,
    ],
    imports: [NgxDatatableModule],
  });

  function createModels(itemCount: number): Observable<MockModel[]> {
    mockedModels = modelData.randomArray(itemCount, itemCount, () => {
      return new MockModel({
        id: modelData.id(),
        name: modelData.random.word(),
      });
    });

    return new Observable((subscriber) => {
      subscriber.next(mockedModels);
      mockedModelSubscriber = subscriber;
    });
  }

  function getRows() {
    return spec.queryAll("datatable-row-wrapper");
  }

  // function getRowValues(row: number): HTMLElement[] {
  //   return spec.queryAll(
  //     `datatable-row-wrapper:nth-child(${row + 1}) datatable-body-cell`
  //   );
  // }

  function setPage(page: number) {
    spec.query(DataTablePagerComponent).selectPage(page);
  }

  function setup(
    props: Partial<VirtualDatatablePaginationDirective<MockModel>> = {}
  ) {
    spec = createDirective(
      `
      <ngx-datatable
        bawDatatableDefaults
        [virtualDatatablePagination]="models$"
      >
        <ngx-datatable-column props="id"></ngx-datatable-column>
        <ngx-datatable-column props="name"></ngx-datatable-column>
      </ngx-datatable>
    `,
      { hostProps: props }
    );
  }

  fit("should create", () => {
    setup({ models$: createModels(modelData.datatype.number()) });
  });

  it("should display an empty table when no models are provided", () => {
    setup({ models$: undefined });
  });

  it("should return a single page of results correctly", () => {
    setup({ models$: createModels(defaultApiPageSize) });
    expect(getRows().length).toEqual(10);
  });

  it("should update the rows correctly if the models observable emits a new value", () => {
    setup({ models$: createModels(defaultApiPageSize) });
    expect(getRows().length).toEqual(10);

    mockedModelSubscriber.next(mockedModels.slice(0, 5));
    spec.detectChanges();

    expect(getRows().length).toEqual(5);
  });

  it("should only return the number of models specified by the row limit", () => {
    const expectedRowCount = defaultApiPageSize;

    setup({ models$: createModels(expectedRowCount * 2) });
    expect(getRows().length).toEqual(expectedRowCount);
  });

  it("should have the correct number of total items", () => {
    const mockItemCount = defaultApiPageSize;

    setup({ models$: createModels(mockItemCount * 2) });
    expect(spec.directive.totalItems).toEqual(mockItemCount * 2);
  });

  it("should have the correct number of total pages", () => {
    const mockItemCount = defaultApiPageSize;
    const expectedPageCount = 4;

    setup({ models$: createModels(mockItemCount * expectedPageCount) });
    expect(spec.directive.totalPages).toEqual(expectedPageCount);
  });

  it("should page correctly", () => {
    setup({ models$: createModels(defaultApiPageSize * 3) });

    // test paging forwards
    setPage(2);

    // test paging backwards
    setPage(1);
  });
});
