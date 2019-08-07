import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CardImageComponent } from "src/app/component/shared/cards/card-image/card-image.component";
import { CardComponent } from "src/app/component/shared/cards/card/card.component";
import { CardsComponent } from "src/app/component/shared/cards/cards.component";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        CardsComponent,
        CardComponent,
        CardImageComponent
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
});
