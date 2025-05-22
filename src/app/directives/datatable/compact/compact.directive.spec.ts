import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "../defaults/defaults.directive";
import { DatatableCompactDirective } from "./compact.directive";

describe("CompactDirective", () => {
  let spec: SpectatorDirective<DatatableCompactDirective>;

  const createDirective = createDirectiveFactory({
    directive: DatatableCompactDirective,
    imports: [NgxDatatableModule],
  });

  function setup(): void {
    spec = createDirective(
      `
        <ngx-datatable
          #table
          bawDatatableCompact
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
      },
    );
  }

  beforeEach(() => {
    setup();
  });

  it("should create and extend the default datatable config", () => {
    expect(spec.directive).toBeInstanceOf(DatatableCompactDirective);
    expect(spec.directive).toBeInstanceOf(DatatableDefaultsDirective);
  });

  it("should set the .compact-datatable class", () => {
    expect(spec.element).toHaveClass("compact-datatable");
  });
});
