import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FiltersState } from './filters.state';

export const selectFiltersState = createFeatureSelector<FiltersState>('filters');

export const selectFilterName = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.name
);

export const selectFilterAlcohol = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.alcohol
);

export const selectFilterFavorites = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.favorites
);

export const selectSortOrder = createSelector(
  selectFiltersState,
  (state: FiltersState) => state.sort
);