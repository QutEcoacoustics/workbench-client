import { createDirectiveFactory, SpectatorDirective } from "@ngneat/spectator";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { DatatableCompactDirective } from "./compact.directive";

describe("CompactDirective", () => {
  let spec: SpectatorDirective<DatatableCompactDirective, DatatableComponent>;

  function setup(): void {
    spec = createDirectiveFactory({
      directive: DatatableCompactDirective,
    });
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.directive).toBeInstanceOf(DatatableCompactDirective);
  });
});
