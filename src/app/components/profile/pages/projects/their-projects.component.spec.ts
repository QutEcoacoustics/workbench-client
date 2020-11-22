import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheirProjectsComponent } from './their-projects.component';

// TODO Implement
xdescribe('TheirProjectsComponent', () => {
  let component: TheirProjectsComponent;
  let fixture: ComponentFixture<TheirProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TheirProjectsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TheirProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
