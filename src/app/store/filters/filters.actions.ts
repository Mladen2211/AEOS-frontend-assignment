import { createAction, props } from '@ngrx/store';

export const updateFilters = createAction(
  '[Filters] Update Filters',
  props<{ name: string; alcohol: number; favorites: boolean; sort: string }>()
);