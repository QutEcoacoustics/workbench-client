import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { Subject } from "rxjs";
import { CardImageComponent } from "src/app/component/shared/cards/card-image/card-image.component";
import { CardComponent } from "src/app/component/shared/cards/card/card.component";
import { CardsComponent } from "src/app/component/shared/cards/cards.component";
import {
  Projects,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import { environment } from "src/environments/environment";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const projects = {
    meta: {
      status: 200,
      message: "OK",
      sorting: {
        orderBy: "name",
        direction: "asc"
      },
      paging: {
        page: 1,
        items: 25,
        total: 1,
        maxPage: 1,
        current:
          "http://staging.ecosounds.org/projects?direction=asc&items=25&order_by=name&page=1",
        previous: null,
        next: null
      }
    },
    data: [
      {
        id: 512,
        name: "eScience Acoustic Study",
        description:
          "Experiment to assess the use of reputation models and productivity tools on citizen scientists with unknown species identification skills.",
        creatorId: 138,
        siteIds: [
          513,
          514,
          519,
          518,
          522,
          520,
          526,
          521,
          517,
          525,
          516,
          524,
          523,
          515,
          527
        ],
        description_html:
          "<p>Experiment to assess the use of reputation models and productivity tools on citizen scientists with unknown species identification skills.</p>\n"
      },
      {
        id: 512,
        name: "eScience Acoustic Study",
        description:
          "Experiment to assess the use of reputation models and productivity tools on citizen scientists with unknown species identification skills.",
        creatorId: 138,
        siteIds: [
          513,
          514,
          519,
          518,
          522,
          520,
          526,
          521,
          517,
          525,
          516,
          524,
          523,
          515,
          527
        ],
        description_html:
          "<p>Experiment to assess the use of reputation models and productivity tools on citizen scientists with unknown species identification skills.</p>\n"
      },
      {
        id: 512,
        name: "eScience Acoustic Study",
        description:
          "Experiment to assess the use of reputation models and productivity tools on citizen scientists with unknown species identification skills.",
        creatorId: 138,
        siteIds: [
          513,
          514,
          519,
          518,
          522,
          520,
          526,
          521,
          517,
          525,
          516,
          524,
          523,
          515,
          527
        ],
        description_html:
          "<p>Experiment to assess the use of reputation models and productivity tools on citizen scientists with unknown species identification skills.</p>\n"
      }
    ]
  };

  class MockProjectsService {
    public getFilteredProjects(filters: any): Subject<Projects> {
      const subject = new Subject<Projects>();

      setTimeout(() => {
        subject.next(projects);
      }, 500);

      return subject;
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        CardsComponent,
        CardComponent,
        CardImageComponent
      ],
      imports: [],
      providers: [{ provide: ProjectsService, useClass: MockProjectsService }]
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
