import { Beer } from '../../models/beer.model';

export interface BeerState {
  beers: Beer[];
  loading: boolean;
  error: string | null;
}

export const initialBeerState: BeerState = {
  beers: [],
  loading: false,
  error: null
};