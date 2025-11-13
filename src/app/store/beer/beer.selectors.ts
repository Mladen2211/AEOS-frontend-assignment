import { createSelector, createFeatureSelector } from '@ngrx/store';
import { BeerState } from './beer.state';

export const selectBeerState = createFeatureSelector<BeerState>('beer');

export const selectBeers = createSelector(
  selectBeerState,
  (state: BeerState) => state.beers
);

export const selectLoading = createSelector(
  selectBeerState,
  (state: BeerState) => state.loading
);

export const selectError = createSelector(
  selectBeerState,
  (state: BeerState) => state.error
);