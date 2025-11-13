import { ActionReducerMap } from '@ngrx/store';
import { beerReducer } from './beer/beer.reducer';
import { BeerState } from './beer/beer.state';
import { filtersReducer } from './filters/filters.reducer';
import { FiltersState } from './filters/filters.state';

export interface AppState {
  beer: BeerState;
  filters: FiltersState;
}

export const reducers: ActionReducerMap<AppState> = {
  beer: beerReducer,
  filters: filtersReducer
};