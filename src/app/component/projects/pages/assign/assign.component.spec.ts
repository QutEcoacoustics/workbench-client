import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { SharedModule } from "src/app/component/shared/shared.module";
import { testBawServices } from "src/app/test.helper";
import { AssignComponent } from "./assign.component";

xdescribe("AssignComponent", () => {
  let component: AssignComponent;
  let fixture: ComponentFixture<AssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AssignComponent],
      imports: [SharedModule, RouterTestingModule, HttpClientModule],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should display project in title", () => {});
  it("should display descriptive text", () => {});

  describe("projects api", () => {
    it("should request project using project id", () => {});
    it("should request project using random project id", () => {});
  });

  describe("sites api", () => {
    it("should send filter request", () => {});
    it("should request first page of data on load", () => {});
    it("should request custom page of data on table page change", () => {});
  });

  describe("table", () => {
    it("should contain table", () => {});
    it("should have checkbox option", () => {});
    it("should handle single selection", () => {});
    it("should handle multiple selections", () => {});
    it("should handle change page", () => {});
    it("should handle skipping to last page", () => {});
    it("should not be sortable", () => {});
    it("should handle single page table", () => {});
    it("should handle multi page table", () => {});
    it("should display total number of sites with single page", () => {});
    it("should display total number of sites with multiple pages", () => {});
  });
});
