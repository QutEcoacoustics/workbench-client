import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CardImageComponent } from "./card-image.component";

describe("CardImageComponent", () => {
  let component: CardImageComponent;
  let fixture: ComponentFixture<CardImageComponent>;
  let compiled: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardImageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardImageComponent);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
  });

  it("should create", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should have title", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" }
    };
    fixture.detectChanges();

    const title = compiled.nativeElement.querySelector("h4").textContent;
    expect(title).toContain("title");
  });

  it("should have image alt", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" }
    };
    fixture.detectChanges();

    const image = compiled.nativeElement.querySelector("img");
    expect(image.alt).toBe("alt");
  });

  it("should handle local image", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" }
    };
    fixture.detectChanges();

    const image = compiled.nativeElement.querySelector("img");
    expect(image.src).toBe(`http://${window.location.host}/image`);
  });

  it("should handle remote image", () => {
    component.card = {
      title: "title",
      image: {
        url:
          "https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186",
        alt: "alt"
      }
    };
    fixture.detectChanges();

    const image = compiled.nativeElement.querySelector("img");
    expect(image.src).toBe(
      "https://www.ecosounds.org/system/projects/images/000/001/029/span3/DSCN0286.JPG?1440543186"
    );
  });

  it("should handle description", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      description: "description"
    };
    fixture.detectChanges();

    const description = compiled.nativeElement.querySelector(".card-text");
    expect(description.textContent).toContain("description");
  });

  it("correct number of links", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      link: "https://link/"
    };
    fixture.detectChanges();

    const links = compiled.nativeElement.querySelectorAll("a");
    expect(links.length).toBe(2);
  });

  it("should have image link", () => {
    component.card = {
      title: "title",
      image: { url: "image", alt: "alt" },
      link: "https://link/"
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
      link: "https://link/"
    };
    fixture.detectChanges();

    const headerLink = compiled.nativeElement.querySelector("h4 a");

    expect(headerLink).toBeTruthy();
    expect(headerLink.href).toBe("https://link/");
  });
});
