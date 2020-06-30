import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { modelData } from "@test/helpers/faker";
import { assertImage } from "@test/helpers/html";
import { CardImageComponent } from "./card-image.component";

describe("CardImageComponent", () => {
  let component: CardImageComponent;
  let fixture: ComponentFixture<CardImageComponent>;
  let compiled: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardImageComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it("should create", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have title", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
    };
    fixture.detectChanges();

    const title = compiled.nativeElement.querySelector("h4").textContent;
    expect(title).toContain("title");
  });

  it("should handle local image", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "image alt" },
    };
    fixture.detectChanges();

    const image = compiled.nativeElement.querySelector("img");
    assertImage(image, `http://${window.location.host}/image`, "image alt");
  });

  it("should handle remote image", () => {
    const url = modelData.imageUrl();
    component.card = {
      title: "title",
      image: { url, alt: "image alt" },
    };
    fixture.detectChanges();

    const image = compiled.nativeElement.querySelector("img");
    assertImage(image, url, "image alt");
  });

  it("should handle description", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      description: "description",
    };
    fixture.detectChanges();

    const description = compiled.nativeElement.querySelector(".card-text");
    expect(description.textContent).toContain("description");
  });

  it("correct number of links", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      link: "https://link/",
    };
    fixture.detectChanges();

    const links = compiled.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(2);
  });

  it("should have image link", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      link: "https://link/",
    };
    fixture.detectChanges();

    const imageLink = compiled.nativeElement.querySelector("a img");

    expect(imageLink).toBeTruthy();
    expect(imageLink.parentElement.href).toBe("https://link/");
  });

  it("should have title link", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      link: "https://link/",
    };
    fixture.detectChanges();

    const headerLink = compiled.nativeElement.querySelector("h4 a");

    expect(headerLink).toBeTruthy();
    expect(headerLink.href).toBe("https://link/");
  });
});
