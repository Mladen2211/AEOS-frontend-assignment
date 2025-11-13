import { createReducer, on } from '@ngrx/store';
import { BeerState, initialBeerState } from './beer.state';
import * as BeerActions from './beer.actions';

export const beerReducer = createReducer(
  initialBeerState,
  on(BeerActions.loadBeers, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BeerActions.loadBeersSuccess, (state, { beers }) => ({
    ...state,
    beers,
    loading: false
  })),
  on(BeerActions.loadBeersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(BeerActions.loadMoreBeers, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BeerActions.loadMoreBeersSuccess, (state, { beers }) => ({
    ...state,
    beers: [...state.beers, ...beers],
    loading: false
  })),
  on(BeerActions.loadMoreBeersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),
  on(BeerActions.toggleFavoriteSuccess, (state, { beer }) => ({
    ...state,
    beers: state.beers.map(b => b.id === beer.id ? beer : b)
  }))
);