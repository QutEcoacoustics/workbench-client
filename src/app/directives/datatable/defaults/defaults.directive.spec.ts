import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import {
  DatatableComponent,
  NgxDatatableModule,
} from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "./defaults.directive";

describe("DatatableDefaultsDirective", () => {
  let spec: SpectatorDirective<DatatableDefaultsDirective>;

  const createDirective = createDirectiveFactory({
    directive: DatatableDefaultsDirective,
    imports: [NgxDatatableModule],
  });

  function datatable(): DatatableComponent {
    return spec.query(DatatableComponent);
  }

  describe("Defaults", () => {
    beforeEach(() => {
      spec = createDirective(
        `<ngx-datatable
          #table
          bawDatatableDefaults
          [rows]="rows"
          [columns]="columns"
        ></ngx-datatable>`,
        {
          hostProps: {
            rows: [{ id: 1 }],
            columns: [{ prop: "id" }],
          },
        },
      );
    });

    it("should set footer height", () => {
      expect(datatable().footerHeight).toEqual(50);
    });

    it("should set header height", () => {
      expect(datatable().headerHeight).toEqual(50);
    });

    it("should set limit", () => {
      expect(datatable().pageSize).toEqual(defaultApiPageSize);
    });

    it("should set row height", () => {
      expect(datatable().rowHeight).toEqual("auto");
    });

    it("should set horizontal scroll bar", () => {
      expect(datatable().scrollbarH).toEqual(true);
    });

    it("should set not reorderable", () => {
      expect(datatable().reorderable).toEqual(false);
    });
  });

  describe("Overrides", () => {
    it("should override default value", () => {
      spec = createDirective(
        `<ngx-datatable
          #table
          bawDatatableDefaults
          [rows]="rows"
          [columns]="columns"
          [footerHeight]="150"
        ></ngx-datatable>`,
        {
          hostProps: {
            rows: [{ id: 1 }],
            columns: [{ prop: "id" }],
          },
        },
      );

      expect(datatable().footerHeight).toEqual(150);
    });

    it("should override multiple default values", () => {
      spec = createDirective(
        `<ngx-datatable
          #table
          bawDatatableDefaults
          [rows]="rows"
          [columns]="columns"
          [footerHeight]="150"
          [headerHeight]="150"
        ></ngx-datatable>`,
        {
          hostProps: {
            rows: [{ id: 1 }],
            columns: [{ prop: "id" }],
          },
        },
      );

      expect(datatable().footerHeight).toEqual(150);
      expect(datatable().headerHeight).toEqual(150);
    });
  });
});
