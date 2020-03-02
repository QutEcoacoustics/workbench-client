import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { SharedModule } from "src/app/component/shared/shared.module";
import { DatatableDirective } from "./datatable.directive";

describe("DatatableDirective", () => {
  let fixture: ComponentFixture<any>;
  let datatable: DebugElement;

  function configureTestingModule(
    overrideDefaults?: Partial<DatatableComponent>
  ) {
    @Component({
      template: `
        <ngx-datatable
          #table
          appDatatable
          [defaults]="defaults"
          [rows]="rows"
          [columns]="columns"
        >
        </ngx-datatable>
      `
    })
    class MockComponent {
      rows = [{ id: 1 }];
      columns = [{ prop: "id" }];
      defaults = overrideDefaults;
    }

    TestBed.configureTestingModule({
      declarations: [MockComponent, DatatableDirective],
      imports: [SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MockComponent);
    fixture.detectChanges();

    datatable = fixture.debugElement.query(By.css("ngx-datatable"));
  }

  function assertAttribute(
    selector: string,
    attribute: string,
    expectedValue: string
  ) {
    const target = datatable.query(By.css(selector));
    expect(target).toBeTruthy();
    expect(target.attributes[attribute]).toBeTruthy();
    expect(target.attributes[attribute]).toBe(expectedValue);
  }

  describe("Defaults", () => {
    beforeEach(() => {
      configureTestingModule();
    });

    it("should set class", () => {
      expect(Object.keys(datatable.classes)).toContain("bootstrap");
    });

    it("should set footer height", () => {
      assertAttribute("datatable-footer", "ng-reflect-footer-height", "50");
    });

    it("should set header height", () => {
      assertAttribute("datatable-header", "ng-reflect-header-height", "50");
    });

    it("should set limit", () => {
      assertAttribute("datatable-body", "ng-reflect-page-size", "25");
    });

    it("should set row height", () => {
      assertAttribute("datatable-body", "ng-reflect-row-height", "auto");
    });

    it("should set horizontal scroll bar", () => {
      assertAttribute("datatable-scroller", "ng-reflect-scrollbar-h", "true");
    });

    it("should set not reorderable", () => {
      assertAttribute("datatable-header", "ng-reflect-reorderable", "false");
    });
  });

  describe("Overrides", () => {
    it("should override default value", () => {
      configureTestingModule({ footerHeight: 150 });

      assertAttribute("datatable-footer", "ng-reflect-footer-height", "150");
    });

    it("should override multiple default values", () => {
      configureTestingModule({ footerHeight: 150, headerHeight: 150 });

      assertAttribute("datatable-footer", "ng-reflect-footer-height", "150");
      assertAttribute("datatable-header", "ng-reflect-header-height", "150");
    });
  });
});
