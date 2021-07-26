import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeTemplateComponent } from './theme-template.component';

describe('ThemeTemplateComponent', () => {
  let component: ThemeTemplateComponent;
  let fixture: ComponentFixture<ThemeTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
