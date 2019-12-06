import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Card } from "../cards.component";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;
  let compiled: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent],
      imports: [RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it("should create", () => {
    component.card = {
      title: "title"
    } as Card;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have title", () => {
    component.card = {
      title: "title"
    } as Card;
    fixture.detectChanges();

    const titles = fixture.debugElement.nativeElement.querySelectorAll("h4");
    expect(titles.length).toBe(1);
    expect(titles[0].innerText).toBe("title");
  });

  it("should have default description when non provided", () => {
    component.card = {
      title: "title"
    } as Card;
    fixture.detectChanges();

    const description = fixture.debugElement.nativeElement.querySelectorAll(
      "p"
    );
    expect(description.length).toBe(1);
    expect(description[0].innerText).toBe("No description given");
  });

  it("should have description when provided", () => {
    component.card = {
      title: "title",
      description: "description"
    } as Card;
    fixture.detectChanges();

    const description = fixture.debugElement.nativeElement.querySelectorAll(
      "p"
    );
    expect(description.length).toBe(1);
    expect(description[0].innerText).toBe("description");
  });

  it("should not have link if no link or route provided", () => {
    component.card = {
      title: "title"
    } as Card;
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(0);
  });

  it("should have href if link provided", () => {
    component.card = {
      title: "title",
      link: "https://brokenlink/"
    } as Card;
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0].innerText).toBe("title");
    expect(links[0].href).toBe("https://brokenlink/");
    expect(
      links[0].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeFalsy();
  });

  it("should have routerLink if route provided", () => {
    component.card = {
      title: "title",
      route: "/brokenlink"
    } as Card;
    fixture.detectChanges();

    const links = fixture.debugElement.nativeElement.querySelectorAll("a");

    expect(links.length).toBe(1);
    expect(links[0].innerText).toBe("title");
    expect(links[0].getAttribute("href")).toBe("/brokenlink");
    expect(
      links[0].attributes.getNamedItem("ng-reflect-router-link")
    ).toBeTruthy();
  });
});
