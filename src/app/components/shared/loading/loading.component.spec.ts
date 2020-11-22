import {
  BootstrapColorTypes,
  BootstrapScreenSizes,
} from '@helpers/bootstrapTypes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LoadingComponent } from './loading.component';

describe('LoadingComponent', () => {
  let spec: Spectator<LoadingComponent>;
  const createComponent = createComponentFactory({
    component: LoadingComponent,
    imports: [NgbModule],
  });

  function getSpinner(klass: string) {
    return spec.query(`#spinner.${klass}`);
  }

  beforeEach(() => (spec = createComponent({ detectChanges: false })));

  describe('colors', () => {
    const colors: BootstrapColorTypes[] = [
      'primary',
      'secondary',
      'success',
      'danger',
      'warning',
      'info',
      'light',
      'dark',
    ];

    colors.forEach((color) => {
      it(`should display spinner with ${color} color`, () => {
        spec.setInput('color', color);
        spec.detectChanges();
        expect(getSpinner(`text-${color}`)).toBeTruthy();
      });
    });
  });

  describe('size', () => {
    const sizes: BootstrapScreenSizes[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    sizes.forEach((size) => {
      it(`should display border spinner with ${size} size`, () => {
        spec.setInput('type', 'border');
        spec.setInput('size', size);
        spec.detectChanges();
        expect(getSpinner(`spinner-border-${size}`)).toBeTruthy();
      });

      it(`should display grower spinner with ${size} size`, () => {
        spec.setInput('type', 'grower');
        spec.setInput('size', size);
        spec.detectChanges();
        expect(getSpinner(`spinner-grower-${size}`)).toBeTruthy();
      });
    });
  });

  describe('type', () => {
    it('should display a border type spinner', () => {
      spec.setInput('type', 'border');
      spec.detectChanges();
      expect(getSpinner('spinner-border')).toBeTruthy();
    });

    it('should display a grower type spinner', () => {
      spec.setInput('type', 'grower');
      spec.detectChanges();
      expect(getSpinner('spinner-grower')).toBeTruthy();
    });
  });
});
