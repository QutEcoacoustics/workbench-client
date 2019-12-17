import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { BehaviorSubject } from "rxjs";
import { DefaultMenu } from "src/app/helpers/page/defaultMenus";
import { SharedModule } from "../shared.module";
import { SecondaryMenuComponent } from "./secondary-menu.component";

xdescribe("SecondaryMenuComponent", () => {
  let component: SecondaryMenuComponent;
  let fixture: ComponentFixture<SecondaryMenuComponent>;
  let route: ActivatedRoute;
  const defaultLinks = DefaultMenu.contextLinks;

  it("should create", () => {
    class MockActivatedRoute {
      public data = new BehaviorSubject<any>({});
    }

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [SecondaryMenuComponent],
      providers: [{ provide: ActivatedRoute, useClass: MockActivatedRoute }]
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryMenuComponent);
    route = TestBed.get(ActivatedRoute);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  xit("should handle default links", () => {});
  xit("should handle single internal link", () => {});
  xit("should handle multiple internal links", () => {});
  xit("should handle single external link", () => {});
  xit("should handle multiple external links", () => {});
});
