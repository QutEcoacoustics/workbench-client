import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TheirBookmarksComponent } from "./their-bookmarks.component";

describe("TheirBookmarksComponent", () => {
  let component: TheirBookmarksComponent;
  let fixture: ComponentFixture<TheirBookmarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TheirBookmarksComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheirBookmarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
