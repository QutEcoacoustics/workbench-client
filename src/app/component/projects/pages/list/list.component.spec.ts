import { HttpClientModule } from "@angular/common/http";
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Subject } from "rxjs";
import { testBawServices } from "src/app/app.helper";
import { SharedModule } from "src/app/component/shared/shared.module";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { ListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let api: ProjectsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientModule, RouterTestingModule],
      declarations: [ListComponent],
      providers: [...testBawServices]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    api = TestBed.get(ProjectsService);
  });

  it("should display loading animation", fakeAsync(() => {
    spyOn(api, "list").and.callFake(() => {
      return new Subject();
    });

    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeTruthy();
  }));

  it("should remove loading animation on project load", fakeAsync(() => {
    spyOn(api, "list").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([
          new Project({
            id: 1,
            name: "Project 1",
            creatorId: 1,
            description: "Description 1",
            siteIds: new Set([])
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const spinner = fixture.debugElement.nativeElement.querySelector(
      "mat-spinner"
    );
    expect(spinner).toBeFalsy();
  }));

  it("should handle zero projects", fakeAsync(() => {
    spyOn(api, "list").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h4");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("Your list of projects is empty");
  }));

  it("should display one project", fakeAsync(() => {
    spyOn(api, "list").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([
          new Project({
            id: 1,
            name: "Project 1",
            creatorId: 1,
            description: "Description 1",
            siteIds: new Set([])
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");

    expect(cards.length).toBe(1);
    expect(cards[0].querySelector(".card-title").innerText.trim()).toBe(
      "Project 1"
    );
    expect(cards[0].querySelector(".card-text").innerText.trim()).toBe(
      "Description 1"
    );
  }));

  it("should display multiple projects", fakeAsync(() => {
    spyOn(api, "list").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.next([
          new Project({
            id: 1,
            name: "Project 1",
            creatorId: 1,
            description: "Description 1",
            siteIds: new Set([])
          }),
          new Project({
            id: 2,
            name: "Project 2",
            creatorId: 1,
            description: "Description 2",
            siteIds: new Set([])
          }),
          new Project({
            id: 3,
            name: "Project 3",
            creatorId: 1,
            description: "Description 3",
            siteIds: new Set([])
          })
        ]);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll("app-card-image");

    expect(cards.length).toBe(3);
    expect(cards[0].querySelector(".card-title").innerText.trim()).toBe(
      "Project 1"
    );
    expect(cards[0].querySelector(".card-text").innerText.trim()).toBe(
      "Description 1"
    );
    expect(cards[1].querySelector(".card-title").innerText.trim()).toBe(
      "Project 2"
    );
    expect(cards[1].querySelector(".card-text").innerText.trim()).toBe(
      "Description 2"
    );
    expect(cards[2].querySelector(".card-title").innerText.trim()).toBe(
      "Project 3"
    );
    expect(cards[2].querySelector(".card-text").innerText.trim()).toBe(
      "Description 3"
    );
  }));

  it("should handle api error", fakeAsync(() => {
    spyOn(api, "list").and.callFake(() => {
      const subject = new Subject<Project[]>();

      setTimeout(() => {
        subject.error({ status: 404, message: "Not Found" } as ApiErrorDetails);
      }, 50);

      return subject;
    });

    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const errorHandler = fixture.nativeElement.querySelector(
      "app-error-handler"
    );
    const title = errorHandler.querySelector("h1");
    const description = errorHandler.querySelector("p");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("Not found");
    expect(description).toBeTruthy();
    expect(description.innerText.trim()).toBe("Not Found");
  }));
});
