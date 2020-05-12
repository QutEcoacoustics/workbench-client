import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MyBookmarksComponent } from "./my-bookmarks.component";

describe("MyBookmarksComponent", () => {
  let component: MyBookmarksComponent;
  let fixture: ComponentFixture<MyBookmarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyBookmarksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
