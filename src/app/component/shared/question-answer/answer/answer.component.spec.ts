import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListDetailValue } from "../question-answer.component";
import { AnswerComponent } from "./answer.component";

describe("AnswerComponent", () => {
  let component: AnswerComponent;
  let detail: ListDetailValue;
  let fixture: ComponentFixture<AnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnswerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerComponent);
    component = fixture.componentInstance;
  });

  it("should handle undefined detail value", () => {
    detail = { value: undefined };
    component.detail = detail;

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe("routing", () => {
    it("should handle undefined route", () => {});
    it("should handle route", () => {});
  });

  describe("input types", () => {
    it("should handle string value", () => {});
    it("should handle number value", () => {});

    xdescribe("array input", () => {
      it("should handle array values", () => {});
      it("should handle array values with routes", () => {});
    });

    xdescribe("DateTime input", () => {
      it("should handle DateTime value", () => {});
      it("should call toRelative", () => {});
    });

    xdescribe("Duration input", () => {
      it("should handle Duration value", () => {});
      it("should call humanizeDuration", () => {});
    });

    xdescribe("observable input", () => {
      it("should display loading while observable incomplete", () => {});
      it("should handle single value", () => {});
      it("should handle array value", () => {});
      it("should handle error output", () => {});
    });

    xdescribe("Blob input", () => {
      it("should display loading while blob incomplete", () => {});
      it("should handle text output", () => {});
      it("should handle error output", () => {});
    });

    xdescribe("object input", () => {
      it("should handle object value", () => {});
      it("should add code styling", () => {});
    });
  });
});
