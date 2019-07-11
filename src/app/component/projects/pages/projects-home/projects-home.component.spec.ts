import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsHomeComponent } from './projects-home.component';
import { CardsComponent } from 'src/app/component/shared/cards/cards.component';
import { CardComponent } from 'src/app/component/shared/cards/card/card.component';
import { CardImageComponent } from 'src/app/component/shared/cards/card-image/card-image.component';

describe('ProjectsHomeComponent', () => {
  let component: ProjectsHomeComponent;
  let fixture: ComponentFixture<ProjectsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProjectsHomeComponent,
        CardsComponent,
        CardComponent,
        CardImageComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
