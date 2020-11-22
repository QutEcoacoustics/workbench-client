import { defaultApiPageSize } from '@baw-api/baw-api.service';
import { PaginationTemplate } from '@helpers/paginationTemplate/paginationTemplate';
import { AbstractModel } from '@models/AbstractModel';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Spectator } from '@ngneat/spectator';
import { DebounceInputComponent } from '@shared/debounce-input/debounce-input.component';
import { LoadingComponent } from '@shared/loading/loading.component';
import { createScanner } from 'typescript';

export function assertPaginationTemplate<
  M extends AbstractModel,
  T extends PaginationTemplate<M>
>(setup: () => Spectator<T>) {
  describe('pagination template', () => {
    let spectator: Spectator<T>;
    beforeEach(() => (spectator = setup()));

    describe('filter input', () => {
      function getFilterInput() {
        return spectator.query(DebounceInputComponent);
      }

      it('should have filter input', () => {
        const filter = getFilterInput();
        expect(filter).toBeTruthy();
        expect(filter.default).toBe('');
      });

      it('should set filter default value', () => {
        spectator.component.filter = 'Custom Filter';
        spectator.detectChanges();
        expect(getFilterInput().default).toBe('Custom Filter');
      });

      it('should trigger onFilter events', () => {
        const spy = jasmine.createSpy().and.stub();
        spectator.component.onFilter = spy;
        const filter = getFilterInput();
        filter.filter.next('Custom Filter');
        spectator.detectChanges();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('loading spinner', () => {
      function getSpinner() {
        return spectator.query(LoadingComponent);
      }

      it('should display when page is loading', () => {
        spectator.component.loading = true;
        spectator.detectChanges();
        expect(getSpinner()).toBeTruthy();
      });

      it('should not display when page has loaded', () => {
        spectator.component.loading = false;
        spectator.detectChanges();
        expect(getSpinner()).toBeFalsy();
      });
    });

    describe('pagination', () => {
      function getPagination() {
        return spectator.query(NgbPagination);
      }

      it('should hide pagination buttons if less than one pages is displayed', () => {
        spectator.component.displayPagination = false;
        spectator.detectChanges();
        expect(getPagination()).toBeFalsy();
      });

      it('should display pagination buttons if more than one page is displayed', () => {
        spectator.component.displayPagination = true;
        spectator.detectChanges();
        expect(getPagination()).toBeTruthy();
      });

      it('should display correct number of pages', () => {
        spectator.component.displayPagination = true;
        spectator.component.collectionSize = 100;
        spectator.detectChanges();
        expect(getPagination().collectionSize).toBe(100);
      });

      // TODO Figure out
      xit('should track changes to page number', () => {
        const spy = jasmine.createSpy().and.stub();
        spectator.component.displayPagination = true;
        spectator.component.apiRequest$.next = spy;
        spectator.detectChanges();
        getPagination().page = 5;
        spectator.detectChanges();
        expect(spy).toHaveBeenCalledWith({ page: 5, filterText: '' });
      });
    });
  });
}
