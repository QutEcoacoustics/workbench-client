import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "./defaults.directive";

describe("DatatableDefaultsDirective", () => {
  let spectator: SpectatorDirective<DatatableDefaultsDirective>;

  const createDirective = createDirectiveFactory({
    directive: DatatableDefaultsDirective,
    imports: [NgxDatatableModule],
  });

  function assertAttribute(
    selector: string,
    attribute: string,
    expectedValue: string
  ) {
    expect(spectator.query(selector)).toHaveAttribute(
      "ng-reflect-" + attribute,
      expectedValue
    );
  }

  describe("Defaults", () => {
    beforeEach(() => {
      spectator = createDirective(
        `
        <ngx-datatable
          #table
          bawDatatableDefaults
          [rows]="rows"
          [columns]="columns"
        >
        </ngx-datatable>
        `,
        {
          hostProps: {
            rows: [{ id: 1 }],
            columns: [{ prop: "id" }],
          },
        }
      );
    });

    it("should set footer height", () => {
      assertAttribute("datatable-footer", "footer-height", "50");
    });

    it("should set header height", () => {
      assertAttribute("datatable-header", "header-height", "50");
    });

    it("should set limit", () => {
      assertAttribute(
        "datatable-body",
        "page-size",
        defaultApiPageSize.toString()
      );
    });

    it("should set row height", () => {
      assertAttribute("datatable-body", "row-height", "auto");
    });

    it("should set horizontal scroll bar", () => {
      assertAttribute("datatable-scroller", "scrollbar-h", "true");
    });

    it("should set not reorderable", () => {
      assertAttribute("datatable-header", "reorderable", "false");
    });
  });

  describe("Overrides", () => {
    it("should override default value", () => {
      spectator = createDirective(
        `
        <ngx-datatable
          #table
          bawDatatableDefaults
          [rows]="rows"
          [columns]="columns"
          [footerHeight]="150"
        >
        </ngx-datatable>
        `,
        {
          hostProps: {
            rows: [{ id: 1 }],
            columns: [{ prop: "id" }],
          },
        }
      );

      assertAttribute("datatable-footer", "footer-height", "150");
    });

    it("should override multiple default values", () => {
      spectator = createDirective(
        `
        <ngx-datatable
          #table
          bawDatatableDefaults
          [rows]="rows"
          [columns]="columns"
          [footerHeight]="150"
          [headerHeight]="150"
        >
        </ngx-datatable>
        `,
        {
          hostProps: {
            rows: [{ id: 1 }],
            columns: [{ prop: "id" }],
          },
        }
      );

      assertAttribute("datatable-footer", "footer-height", "150");
      assertAttribute("datatable-header", "header-height", "150");
    });
  });
});
