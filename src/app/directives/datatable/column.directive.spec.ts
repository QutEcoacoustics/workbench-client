import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DataTableColumnDirective as NgxDataTableColumnDirective,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { DatatableColumnDirective } from "./column.directive";

describe("DatatableColumnDirective", () => {
  let spec: SpectatorDirective<DatatableColumnDirective>;
  const createHost = createDirectiveFactory({
    directive: DatatableColumnDirective,
    imports: [NgxDatatableModule],
  });

  function assertSortKey(sortKey: string) {
    const columnDirective = spec.query(NgxDataTableColumnDirective);
    expect(columnDirective["sortKey"]).toEqual(sortKey);
  }

  it("should set sort key to datatable prop if none provided", () => {
    const sortKey = "propSortKey";
    spec = createHost(
      `<ngx-datatable-column prop="${sortKey}"></ngx-datatable-column>`
    );
    assertSortKey(sortKey);
  });

  it("should set sort key if provided", () => {
    const sortKey = "customSortKey";
    spec = createHost(
      `<ngx-datatable-column prop="propKey" sortKey="${sortKey}"></ngx-datatable-column>`
    );
    assertSortKey(sortKey);
  });
});
