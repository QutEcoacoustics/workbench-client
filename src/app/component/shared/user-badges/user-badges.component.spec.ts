import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { testBawServices } from "src/app/app.helper";
import { Project } from "src/app/models/Project";
import { MenuModule } from "../menu/menu.module";
import { UserBadgesComponent } from "./user-badges.component";

describe("UserBadgesComponent", () => {
  let component: UserBadgesComponent;
  let fixture: ComponentFixture<UserBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MenuModule, HttpClientTestingModule],
      declarations: [UserBadgesComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBadgesComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    component.model = new Project({
      id: 1,
      name: "test project",
      creatorId: 1,
      description: "test description",
      siteIds: new Set([])
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
