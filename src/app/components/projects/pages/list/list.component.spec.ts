import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { projectResolvers } from "@baw-api/project/projects.service";
import { Project } from "@models/Project";
import { SharedModule } from "@shared/shared.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { generateProject } from "@test/fakes/Project";
import { mockActivatedRoute } from "@test/helpers/testbed";
import { ListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let fixture: ComponentFixture<ListComponent>;

  function configureTestingModule(model: Project[], error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        RouterTestingModule,
        MockBawApiModule,
      ],
      declarations: [ListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            { projects: projectResolvers.list },
            { projects: { model, error } }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
  }

  function getCards() {
    return fixture.nativeElement.querySelectorAll("baw-card-image");
  }

  function assertCardTitle(card: any, title: string) {
    expect(card.querySelector(".card-title").innerText.trim()).toBe(title);
  }

  function assertCardDescription(card: any, description: string) {
    expect(card.querySelector(".card-text").innerHTML.trim()).toBe(description);
  }

  it("should handle zero projects", () => {
    const projects = [];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector("h4");
    expect(title).toBeTruthy();
    expect(title.innerText.trim()).toBe("Your list of projects is empty");

    expect(getCards().length).toBe(0);
  });

  it("should display single project card", () => {
    const projects = [new Project(generateProject())];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    expect(cards.length).toBe(1);
  });

  it("should display single project card with title", () => {
    const projects = [new Project(generateProject())];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardTitle(cards[0], projects[0].name);
  });

  it("should display single project card with default description", () => {
    const projects = [
      new Project({
        ...generateProject(),
        descriptionHtmlTagline: undefined,
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardDescription(cards[0], "No description given");
  });

  it("should display single project card with custom description", () => {
    const projects = [
      new Project({
        ...generateProject(),
        descriptionHtmlTagline: "<b>Custom</b> Description",
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardDescription(cards[0], "<b>Custom</b> Description");
  });

  it("should display multiple project cards", () => {
    const projects = [
      new Project(generateProject()),
      new Project(generateProject()),
      new Project(generateProject()),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    expect(cards.length).toBe(3);
  });

  it("should display multiple project cards in order", () => {
    const projects = [
      new Project({ ...generateProject(), name: "Project 1" }),
      new Project({ ...generateProject(), name: "Project 2" }),
      new Project({ ...generateProject(), name: "Project 3" }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardTitle(cards[0], "Project 1");
    assertCardTitle(cards[1], "Project 2");
    assertCardTitle(cards[2], "Project 3");
  });

  it("should handle failed projects model", () => {
    configureTestingModule(undefined, generateApiErrorDetails());
    fixture.detectChanges();

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  });
});
