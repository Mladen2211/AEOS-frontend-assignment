/// <reference types="jasmine" />
import { FilterBeersPipe } from './filter-beers.pipe';
import { Beer } from './models/beer.model';

describe('FilterBeersPipe', () => {
  let pipe: FilterBeersPipe;

  const mockBeers: Beer[] = [
    {
      id: 1,
      name: 'IPA Beer',
      abv: 6.5,
      description: 'A hoppy IPA',
      tagline: 'Hoppy goodness'
    },
    {
      id: 2,
      name: 'Stout Beer',
      abv: 8.0,
      description: 'A dark stout',
      tagline: 'Dark and rich'
    },
    {
      id: 3,
      name: 'Lager Beer',
      abv: 4.5,
      description: 'A crisp lager',
      tagline: 'Crisp and clean'
    }
  ];

  beforeEach(() => {
    pipe = new FilterBeersPipe();
  });

  it('should create an instance', () => {
    (expect(pipe) as any).toBeTruthy();
  });

  it('should return all beers when no filters applied', () => {
    const result = pipe.transform(mockBeers, null, null, null, null);
    // Should be sorted by name ascending by default: IPA, Lager, Stout
    (expect(result) as any).toEqual([mockBeers[0], mockBeers[2], mockBeers[1]]);
  });

  it('should filter by name', () => {
    const result = pipe.transform(mockBeers, 'IPA', null, null, null);
    (expect(result) as any).toEqual([mockBeers[0]]);
  });

  it('should filter by alcohol content', () => {
    const result = pipe.transform(mockBeers, null, 5, null, null);
    (expect(result) as any).toEqual([mockBeers[2]]); // Only Lager has ABV <= 5
  });

  it('should filter by favorites', () => {
    const beersWithFavorites = mockBeers.map((beer, index) => ({
      ...beer,
      isFavorite: index === 0
    }));
    const result = pipe.transform(beersWithFavorites, null, null, true, null);
    (expect(result) as any).toEqual([beersWithFavorites[0]]);
  });

  it('should sort by name ascending', () => {
    const result = pipe.transform(mockBeers, null, null, null, 'name_asc');
    (expect(result[0].name) as any).toBe('IPA Beer');
    (expect(result[1].name) as any).toBe('Lager Beer');
    (expect(result[2].name) as any).toBe('Stout Beer');
  });

  it('should sort by name descending', () => {
    const result = pipe.transform(mockBeers, null, null, null, 'name_desc');
    (expect(result[0].name) as any).toBe('Stout Beer');
    (expect(result[1].name) as any).toBe('Lager Beer');
    (expect(result[2].name) as any).toBe('IPA Beer');
  });

  it('should sort by alcohol ascending', () => {
    const result = pipe.transform(mockBeers, null, null, null, 'alcohol_asc');
    (expect(result[0].abv) as any).toBe(4.5);
    (expect(result[1].abv) as any).toBe(6.5);
    (expect(result[2].abv) as any).toBe(8.0);
  });

  it('should sort by alcohol descending', () => {
    const result = pipe.transform(mockBeers, null, null, null, 'alcohol_desc');
    (expect(result[0].abv) as any).toBe(8.0);
    (expect(result[1].abv) as any).toBe(6.5);
    (expect(result[2].abv) as any).toBe(4.5);
  });

  it('should combine multiple filters', () => {
    const beersWithFavorites = mockBeers.map((beer, index) => ({
      ...beer,
      isFavorite: index < 2
    }));
    const result = pipe.transform(beersWithFavorites, 'Beer', 7, true, 'name_asc');
    (expect(result) as any).toEqual([beersWithFavorites[0]]); // Only IPA matches: name contains 'Beer', ABV <= 7, isFavorite
  });

  it('should return empty array for null input', () => {
    const result = pipe.transform(null as any, null, null, null, null);
    (expect(result) as any).toEqual([]);
  });

  it('should handle empty array input', () => {
    const result = pipe.transform([], null, null, null, null);
    (expect(result) as any).toEqual([]);
  });
});