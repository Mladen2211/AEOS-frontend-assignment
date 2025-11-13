import { createReducer, on } from '@ngrx/store';
import { FiltersState, initialFiltersState } from './filters.state';
import * as FiltersActions from './filters.actions';

export const filtersReducer = createReducer(
  initialFiltersState,
  on(FiltersActions.updateFilters, (state, { name, alcohol, favorites, sort }) => ({
    ...state,
    name,
    alcohol,
    favorites,
    sort
  }))
);