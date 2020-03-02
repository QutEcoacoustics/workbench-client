import { Component, DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SharedModule } from "src/app/component/shared/shared.module";
import { DatatableDirective } from "./datatable.directive";

describe("DatatableDirective", () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let datatable: DebugElement;

  @Component({
    template: `
      <ngx-datatable
        #table
        appDatatable
        [datatable]="table"
        [rows]="rows"
        [columns]="columns"
      >
      </ngx-datatable>
    `
  })
  class MockComponent {
    rows = [{ id: 1 }];
    columns = [{ prop: "id" }];
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MockComponent, DatatableDirective],
      imports: [SharedModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    datatable = fixture.debugElement.query(By.css("ngx-datatable"));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
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
