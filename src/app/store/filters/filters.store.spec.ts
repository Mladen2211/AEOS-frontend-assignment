/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { FiltersState, initialFiltersState } from './filters.state';
import * as FiltersActions from './filters.actions';
import * as FiltersSelectors from './filters.selectors';

describe('Filters Store', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { filters: initialFiltersState } })
      ]
    });
    store = TestBed.inject(MockStore);
  });

  describe('Actions', () => {
    it('should create updateFilters action', () => {
      const filters = { name: 'test', alcohol: 5, favorites: true, sort: 'name_asc' };
      const action = FiltersActions.updateFilters(filters);
      (expect(action.type) as any).toBe('[Filters] Update Filters');
      (expect(action.name) as any).toBe('test');
      (expect(action.alcohol) as any).toBe(5);
      (expect(action.favorites) as any).toBe(true);
      (expect(action.sort) as any).toBe('name_asc');
    });
  });

  describe('Selectors', () => {
    it('should select filter name', () => {
      store.overrideSelector(FiltersSelectors.selectFilterName, 'IPA');
      store.select(FiltersSelectors.selectFilterName).subscribe(result => {
        (expect(result) as any).toBe('IPA');
      });
    });

    it('should select filter alcohol', () => {
      store.overrideSelector(FiltersSelectors.selectFilterAlcohol, 6);
      store.select(FiltersSelectors.selectFilterAlcohol).subscribe(result => {
        (expect(result) as any).toBe(6);
      });
    });

    it('should select filter favorites', () => {
      store.overrideSelector(FiltersSelectors.selectFilterFavorites, true);
      store.select(FiltersSelectors.selectFilterFavorites).subscribe(result => {
        (expect(result) as any).toBe(true);
      });
    });

    it('should select sort order', () => {
      store.overrideSelector(FiltersSelectors.selectSortOrder, 'alcohol_desc');
      store.select(FiltersSelectors.selectSortOrder).subscribe(result => {
        (expect(result) as any).toBe('alcohol_desc');
      });
    });
  });
});