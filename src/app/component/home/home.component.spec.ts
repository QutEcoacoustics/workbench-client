import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { HttpClient } from "selenium-webdriver/http";
import { CardImageComponent } from "src/app/component/shared/cards/card-image/card-image.component";
import { CardComponent } from "src/app/component/shared/cards/card/card.component";
import { CardsComponent } from "src/app/component/shared/cards/cards.component";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  class MockProjectsService {
    public getFilteredProjects(filters: any): Subject<Project[]> {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([
          new Project({
            id: 1,
            name: "Name 1",
            description: "Description 1",
            creatorId: 1,
            siteIds: new Set([1, 2, 3, 4, 5])
          }),
          new Project({
            id: 2,
            name: "Name 2",
            description: "Description 2",
            creatorId: 2,
            siteIds: new Set([6, 7, 8, 9, 10])
          }),
          new Project({
            id: 3,
            name: "Name 3",
            description: "Description 3",
            creatorId: 3,
            siteIds: new Set([1, 3, 5, 7, 9])
          })
        ]);
      }, 500);

      return subject;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [SharedModule, HttpClientModule, RouterTestingModule],
      providers: [
        AppConfigService,
        { provide: ProjectsService, useClass: MockProjectsService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("all images must have alt", async(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const images = fixture.nativeElement.querySelectorAll("img");

      images.forEach(image => {
        expect(image.alt).toBeTruthy();
        expect(image.alt.length).toBeGreaterThan(0);
      });
    });
  }));
});
