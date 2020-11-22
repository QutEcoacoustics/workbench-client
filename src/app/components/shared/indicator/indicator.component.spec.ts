import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SharedModule } from '@shared/shared.module';
import { IndicatorComponent, Status } from './indicator.component';

describe('IndicatorComponent', () => {
  let spectator: Spectator<IndicatorComponent>;
  const createComponent = createComponentFactory({
    component: IndicatorComponent,
    imports: [SharedModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.element).toBeTruthy();
  });

  it('should display success', () => {
    spectator.setInput('status', Status.Success);
    spectator.detectChanges();

    const icon = spectator.query('fa-icon');
    expect(icon).toHaveStyle({ color: 'limegreen' });
  });

  it('should display warning', () => {
    spectator.setInput('status', Status.Warning);
    spectator.detectChanges();

    const icon = spectator.query('fa-icon');
    expect(icon).toHaveStyle({ color: 'orange' });
  });

  it('should display error', () => {
    spectator.setInput('status', Status.Error);
    spectator.detectChanges();

    const icon = spectator.query('fa-icon');
    expect(icon).toHaveStyle({ color: 'red' });
  });
});
