import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { BeerService } from '../../services/beer.service';
import * as BeerActions from './beer.actions';

@Injectable()
export class BeerEffects {
  loadBeers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeerActions.loadBeers),
      mergeMap(action =>
        action.filters
          ? this.beerService.loadBeersWithFilters(action.filters)
          : this.beerService.loadInitialBeers()
      ),
      map(beers => BeerActions.loadBeersSuccess({ beers })),
      catchError(error => of(BeerActions.loadBeersFailure({ error: error.message })))
    )
  );

  loadMoreBeers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeerActions.loadMoreBeers),
      mergeMap(action =>
        this.beerService.loadMoreBeers(action.filters).pipe(
          map(beers => BeerActions.loadMoreBeersSuccess({ beers })),
          catchError(error => of(BeerActions.loadMoreBeersFailure({ error: error.message })))
        )
      )
    )
  );

  toggleFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BeerActions.toggleFavorite),
      mergeMap(action =>
        this.beerService.toggleFavorite(action.beer).pipe(
          map(beer => BeerActions.toggleFavoriteSuccess({ beer })),
          catchError(error => of(BeerActions.toggleFavoriteFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private beerService: BeerService
  ) {}
}