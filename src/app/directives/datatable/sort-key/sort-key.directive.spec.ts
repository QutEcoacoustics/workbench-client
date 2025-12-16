import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DatatableComponent,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { sortDatatableByColumn } from "@test/helpers/datatable";
import { getCallArgs } from "@test/helpers/general";
import { MockComponent } from "ng-mocks";
import { DatatableSortEvent } from "../pagination/pagination.directive";
import { DatatableSortKeyDirective } from "./sort-key.directive";

describe("DatatableSortKeyDirective", () => {
  let spec: SpectatorDirective<DatatableComponent>;

  const createHost = createDirectiveFactory({
    directive: DatatableComponent,
    declarations: [DatatableSortKeyDirective],
    imports: [NgxDatatableModule, MockComponent(DatatableComponent)],
  });

  function assertSortKey(sortKey: string) {
    spyOn(spec.directive, "onColumnSort").and.callThrough();
    sortDatatableByColumn(spec, 0);

    expect(spec.directive.onColumnSort).toHaveBeenCalled();
    const sortEvent: DatatableSortEvent = getCallArgs(
      spec.directive.onColumnSort as jasmine.Spy,
    )[0];
    expect(sortEvent.column.sortKey).toBe(sortKey);
  }

  it("should not set sort key to datatable prop if none provided", () => {
    const sortKey = "propSortKey";
    spec = createHost(
      `
      <ngx-datatable>
        <ngx-datatable-column prop="${sortKey}"></ngx-datatable-column>
      </ngx-datatable>`,
    );
    assertSortKey(undefined);
  });

  it("should set sort key if provided", () => {
    const sortKey = "customSortKey";
    spec = createHost(
      `
      <ngx-datatable>
        <ngx-datatable-column prop="propKey" sortKey="${sortKey}"></ngx-datatable-column>
      </ngx-datatable>`,
    );
    assertSortKey(sortKey);
  });
});
