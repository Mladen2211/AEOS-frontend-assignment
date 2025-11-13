/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Beer } from '../../models/beer.model';
import { BeerState, initialBeerState } from './beer.state';
import * as BeerActions from './beer.actions';
import * as BeerSelectors from './beer.selectors';

describe('Beer Store', () => {
  let store: MockStore;
  const mockBeer: Beer = {
    id: 1,
    name: 'Test Beer',
    tagline: 'A test beer',
    description: 'This is a test beer',
    abv: 5.0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState: { beer: initialBeerState } })
      ]
    });
    store = TestBed.inject(MockStore);
  });

  describe('Actions', () => {
    it('should create loadBeers action', () => {
      const filters = { name: 'test', alcohol: 5, favorites: false, sort: 'name_asc' };
      const action = BeerActions.loadBeers({ filters });
      (expect(action.type) as any).toBe('[Beer] Load Beers');
      (expect(action.filters) as any).toBe(filters);
    });

    it('should create loadBeersSuccess action', () => {
      const beers = [mockBeer];
      const action = BeerActions.loadBeersSuccess({ beers });
      (expect(action.type) as any).toBe('[Beer] Load Beers Success');
      (expect(action.beers) as any).toBe(beers);
    });

    it('should create loadBeersFailure action', () => {
      const error = 'Network error';
      const action = BeerActions.loadBeersFailure({ error });
      (expect(action.type) as any).toBe('[Beer] Load Beers Failure');
      (expect(action.error) as any).toBe(error);
    });

    it('should create toggleFavorite action', () => {
      const action = BeerActions.toggleFavorite({ beer: mockBeer });
      (expect(action.type) as any).toBe('[Beer] Toggle Favorite');
      (expect(action.beer) as any).toBe(mockBeer);
    });
  });

  describe('Selectors', () => {
    it('should select beers', () => {
      const beers = [mockBeer];
      store.overrideSelector(BeerSelectors.selectBeers, beers);
      store.select(BeerSelectors.selectBeers).subscribe(result => {
        (expect(result) as any).toBe(beers);
      });
    });

    it('should select loading state', () => {
      store.overrideSelector(BeerSelectors.selectLoading, true);
      store.select(BeerSelectors.selectLoading).subscribe(result => {
        (expect(result) as any).toBe(true);
      });
    });

    it('should select error state', () => {
      const error = 'Test error';
      store.overrideSelector(BeerSelectors.selectError, error);
      store.select(BeerSelectors.selectError).subscribe(result => {
        (expect(result) as any).toBe(error);
      });
    });
  });
});