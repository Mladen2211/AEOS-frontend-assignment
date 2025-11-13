/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BeerService } from './beer.service';
import { Beer } from '../models/beer.model';
import { API_CONSTANTS } from '../constants/app.constants';

describe('BeerService', () => {
  let service: BeerService;
  let httpMock: HttpTestingController;

  const mockBeer: Beer = {
    id: 1,
    name: 'Test Beer',
    tagline: 'A test beer',
    description: 'This is a test beer',
    abv: 5.0,
    image_url: 'https://example.com/beer.jpg'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BeerService]
    });
    service = TestBed.inject(BeerService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    (expect(service) as any).toBeTruthy();
  });

  describe('getBeerById', () => {
    it('should return beer by id with favorite status', () => {
      service.getBeerById(1).subscribe(beer => {
        (expect(beer) as any).toEqual({ ...mockBeer, isFavorite: false });
      });

      const req = httpMock.expectOne(`${API_CONSTANTS.BASE_URL}/1`);
      (expect(req.request.method) as any).toBe('GET');
      req.flush([mockBeer]);
    });
  });

  describe('loadInitialBeers', () => {
    it('should load initial beers and update subject', () => {
      const beers = [mockBeer];

      service.loadInitialBeers().subscribe(result => {
        (expect(result) as any).toEqual(beers.map(beer => ({ ...beer, isFavorite: false })));
      });

      const req = httpMock.expectOne(req =>
        req.url === API_CONSTANTS.BASE_URL &&
        req.params.get('page') === '1' &&
        req.params.get('per_page') === API_CONSTANTS.DEFAULT_PAGE_SIZE.toString()
      );
      (expect(req.request.method) as any).toBe('GET');
      req.flush(beers);
    });
  });

  describe('loadMoreBeers', () => {
    it('should load more beers with filters', () => {
      const filters = { name: 'test', alcohol: 5, favorites: false, sort: 'name_asc' };
      const beers = [mockBeer];

      service.loadMoreBeers(filters).subscribe(result => {
        (expect(result) as any).toEqual(beers.map(beer => ({ ...beer, isFavorite: false })));
      });

      const req = httpMock.expectOne(req =>
        req.url === API_CONSTANTS.BASE_URL &&
        req.params.get('page') === '2' &&
        req.params.get('per_page') === API_CONSTANTS.DEFAULT_PAGE_SIZE.toString() &&
        req.params.get('beer_name') === 'test' &&
        req.params.get('abv_lt') === '5'
      );
      (expect(req.request.method) as any).toBe('GET');
      req.flush(beers);
    });

    it('should return empty array when no more beers', () => {
      // Manually set hasMore to false by accessing private property
      (service as any).hasMore = false;

      service.loadMoreBeers({ name: '', alcohol: 23, favorites: false, sort: 'name_asc' }).subscribe(result => {
        (expect(result) as any).toEqual([]);
      });
    });
  });

  describe('toggleFavorite', () => {
    it('should add beer to favorites', () => {
      const beer = { ...mockBeer, isFavorite: false };

      service.toggleFavorite(beer).subscribe(result => {
        (expect(result) as any).toEqual({ ...beer, isFavorite: true });
      });

      (expect(localStorage.getItem('beerFavorites')) as any).toBe('[1]');
    });

    it('should remove beer from favorites', () => {
      localStorage.setItem('beerFavorites', '[1]');
      const beer = { ...mockBeer, isFavorite: true };

      service.toggleFavorite(beer).subscribe(result => {
        (expect(result) as any).toEqual({ ...beer, isFavorite: false });
      });

      (expect(localStorage.getItem('beerFavorites')) as any).toBe('[]');
    });
  });

  describe('loadBeersWithFilters', () => {
    it('should load beers with name filter', () => {
      const filters = { name: 'IPA', alcohol: 23, favorites: false, sort: 'name_asc' };
      const beers = [mockBeer];

      service.loadBeersWithFilters(filters).subscribe(result => {
        (expect(result) as any).toEqual(beers.map(beer => ({ ...beer, isFavorite: false })));
      });

      const req = httpMock.expectOne(req =>
        req.url === API_CONSTANTS.BASE_URL &&
        req.params.get('beer_name') === 'IPA'
      );
      req.flush(beers);
    });

    it('should load beers with favorites filter', () => {
      localStorage.setItem('beerFavorites', '[1]');
      const filters = { name: '', alcohol: 23, favorites: true, sort: 'name_asc' };
      const beers = [mockBeer, { ...mockBeer, id: 2, name: 'Another Beer' }];

      service.loadBeersWithFilters(filters).subscribe(result => {
        (expect(result) as any).toEqual([{ ...mockBeer, isFavorite: true }]);
      });

      const req = httpMock.expectOne(req =>
        req.url === API_CONSTANTS.BASE_URL &&
        req.params.get('per_page') === API_CONSTANTS.DEFAULT_PAGE_SIZE.toString()
      );
      req.flush(beers);
    });
  });

  describe('hasMoreBeers', () => {
    it('should return true when more beers available', () => {
      (expect(service.hasMoreBeers()) as any).toBe(true);
    });
  });
});