import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { projectResolvers } from "@baw-api/projects.service";
import { Project } from "@models/Project";
import { SharedModule } from "@shared/shared.module";
import {
  mockActivatedRoute,
  testBawServices,
} from "src/app/test/helpers/testbed";
import { ListComponent } from "./list.component";

describe("ProjectsListComponent", () => {
  let fixture: ComponentFixture<ListComponent>;
  let defaultError: ApiErrorDetails;

  function configureTestingModule(projects: Project[], error: ApiErrorDetails) {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientModule, RouterTestingModule],
      declarations: [ListComponent],
      providers: [
        ...testBawServices,
        {
          provide: ActivatedRoute,
          useClass: mockActivatedRoute(
            {
              projects: projectResolvers.list,
            },
            {
              projects: {
                model: projects,
                error,
              },
            }
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
  }

  function getCards() {
    return fixture.nativeElement.querySelectorAll("app-card-image");
  }

  function assertCardTitle(card: any, title: string) {
    expect(card.querySelector(".card-title").innerText.trim()).toBe(title);
  }

  function assertCardDescription(card: any, description: string) {
    expect(card.querySelector(".card-text").innerText.trim()).toBe(description);
  }

  beforeEach(() => {
    defaultError = {
      status: 401,
      message: "Unauthorized",
    };
  });

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
    const projects = [
      new Project({
        id: 1,
        name: "Custom Project",
        description: "Custom Description",
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    expect(cards.length).toBe(1);
  });

  it("should display single project card with title", () => {
    const projects = [
      new Project({
        id: 1,
        name: "Custom Project",
        description: "Custom Description",
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardTitle(cards[0], "Custom Project");
  });

  it("should display single project card with default description", () => {
    const projects = [
      new Project({
        id: 1,
        name: "Custom Project",
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
        id: 1,
        name: "Custom Project",
        description: "Custom Description",
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardDescription(cards[0], "Custom Description");
  });

  it("should display multiple project cards", () => {
    const projects = [
      new Project({
        id: 1,
        name: "Project 1",
        description: "Description 1",
      }),
      new Project({
        id: 2,
        name: "Project 2",
        description: "Description 2",
      }),
      new Project({
        id: 3,
        name: "Project 3",
        description: "Description 3",
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    expect(cards.length).toBe(3);
  });

  it("should display multiple project cards in order", () => {
    const projects = [
      new Project({
        id: 1,
        name: "Project 1",
        description: "Description 1",
      }),
      new Project({
        id: 2,
        name: "Project 2",
        description: "Description 2",
      }),
      new Project({
        id: 3,
        name: "Project 3",
        description: "Description 3",
      }),
    ];
    configureTestingModule(projects, undefined);
    fixture.detectChanges();

    const cards = getCards();
    assertCardTitle(cards[0], "Project 1");
    assertCardTitle(cards[1], "Project 2");
    assertCardTitle(cards[2], "Project 3");
  });

  it("should handle failed projects model", () => {
    configureTestingModule(undefined, defaultError);
    fixture.detectChanges();

    const body = fixture.nativeElement;
    expect(body.childElementCount).toBe(0);
  });
});
