import { createAction, props } from '@ngrx/store';
import { Beer } from '../../models/beer.model';

export const loadBeers = createAction(
  '[Beer] Load Beers',
  props<{ filters?: { name: string; alcohol: number; favorites: boolean; sort: string } }>()
);

export const loadBeersSuccess = createAction(
  '[Beer] Load Beers Success',
  props<{ beers: Beer[] }>()
);

export const loadBeersFailure = createAction(
  '[Beer] Load Beers Failure',
  props<{ error: string }>()
);

export const loadMoreBeers = createAction(
  '[Beer] Load More Beers',
  props<{ filters: { name: string; alcohol: number; favorites: boolean; sort: string } }>()
);

export const loadMoreBeersSuccess = createAction(
  '[Beer] Load More Beers Success',
  props<{ beers: Beer[] }>()
);

export const loadMoreBeersFailure = createAction(
  '[Beer] Load More Beers Failure',
  props<{ error: string }>()
);

export const toggleFavorite = createAction(
  '[Beer] Toggle Favorite',
  props<{ beer: Beer }>()
);

export const toggleFavoriteSuccess = createAction(
  '[Beer] Toggle Favorite Success',
  props<{ beer: Beer }>()
);

export const toggleFavoriteFailure = createAction(
  '[Beer] Toggle Favorite Failure',
  props<{ error: string }>()
);