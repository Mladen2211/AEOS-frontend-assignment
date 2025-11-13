import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Beer } from '../models/beer.model';
import { API_CONSTANTS, FILTER_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class BeerService {
  private beersSubject = new BehaviorSubject<Beer[]>([]);
  private currentPage = 1;
  private hasMore = true;

  public beers$ = this.beersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getBeerById(id: number): Observable<Beer> {
    return this.http.get<Beer[]>(`${API_CONSTANTS.BASE_URL}/${id}`).pipe(
      map(beers => {
        const beer = beers[0];
        const favorites = this.getFavoritesFromStorage();
        return {
          ...beer,
          isFavorite: favorites.includes(beer.id)
        };
      })
    );
  }

  loadInitialBeers(): Observable<Beer[]> {
    this.currentPage = 1;
    this.hasMore = true;
    return this.loadBeersPage(1).pipe(
      tap(beers => this.beersSubject.next(beers))
    );
  }

  loadMoreBeers(filters: { name: string; alcohol: number; favorites: boolean; sort: string }): Observable<Beer[]> {
    if (!this.hasMore) return of([]);

    let params = new HttpParams()
      .set('page', (++this.currentPage).toString())
      .set('per_page', API_CONSTANTS.DEFAULT_PAGE_SIZE.toString());

    if (filters.name && filters.name.trim()) {
      params = params.set('beer_name', filters.name.trim());
    }
    if (filters.alcohol < FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE) {
      params = params.set('abv_lt', filters.alcohol.toString());
    }

    return this.http.get<Beer[]>(API_CONSTANTS.BASE_URL, { params }).pipe(
      map(beers => {
        this.hasMore = beers.length === API_CONSTANTS.DEFAULT_PAGE_SIZE;

        let filteredBeers = beers;
        if (filters.favorites) {
          const favorites = this.getFavoritesFromStorage();
          filteredBeers = beers.filter(beer => favorites.includes(beer.id));
        }

        filteredBeers = this.sortBeers(filteredBeers, filters.sort);

        const favorites = this.getFavoritesFromStorage();
        return filteredBeers.map(beer => ({
          ...beer,
          isFavorite: favorites.includes(beer.id)
        }));
      })
    );
  }

  hasMoreBeers(): boolean {
    return this.hasMore;
  }

  private loadBeersPage(page: number): Observable<Beer[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', API_CONSTANTS.DEFAULT_PAGE_SIZE.toString());

    return this.http.get<Beer[]>(API_CONSTANTS.BASE_URL, { params }).pipe(
      map(beers => {
        const favorites = this.getFavoritesFromStorage();
        return beers.map(beer => ({
          ...beer,
          isFavorite: favorites.includes(beer.id)
        }));
      })
    );
  }

  toggleFavorite(beer: Beer): Observable<Beer> {
    const favorites = this.getFavoritesFromStorage();
    const updatedFavorites = this.toggleFavoriteInList(favorites, beer.id);
    this.saveFavoritesToStorage(updatedFavorites);

    const currentBeers = this.beersSubject.value;
    const updatedBeers = this.updateBeerInList(currentBeers, beer.id, { ...beer, isFavorite: !beer.isFavorite });
    this.beersSubject.next(updatedBeers);

    return of({ ...beer, isFavorite: !beer.isFavorite });
  }

  loadBeersWithFilters(filters: { name: string; alcohol: number; favorites: boolean; sort: string }): Observable<Beer[]> {
    this.currentPage = 1;
    this.hasMore = true;

    let params = new HttpParams()
      .set('per_page', API_CONSTANTS.DEFAULT_PAGE_SIZE.toString());

    if (filters.name && filters.name.trim()) {
      params = params.set('beer_name', filters.name.trim());
    }
    if (filters.alcohol < FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE) {
      params = params.set('abv_lt', filters.alcohol.toString());
    }

    return this.http.get<Beer[]>(API_CONSTANTS.BASE_URL, { params }).pipe(
      map(beers => {
        this.hasMore = beers.length === API_CONSTANTS.DEFAULT_PAGE_SIZE;

        let filteredBeers = beers;
        if (filters.favorites) {
          const favorites = this.getFavoritesFromStorage();
          filteredBeers = beers.filter(beer => favorites.includes(beer.id));
        }

        filteredBeers = this.sortBeers(filteredBeers, filters.sort);

        const favorites = this.getFavoritesFromStorage();
        const beersWithFavorites = filteredBeers.map(beer => ({
          ...beer,
          isFavorite: favorites.includes(beer.id)
        }));

        return beersWithFavorites;
      }),
      tap(beersWithFavorites => {
        this.beersSubject.next(beersWithFavorites);
      })
    );
  }

  private sortBeers(beers: Beer[], sort: string): Beer[] {
    const sorted = [...beers];
    switch (sort) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'alcohol_asc':
        return sorted.sort((a, b) => a.abv - b.abv);
      case 'alcohol_desc':
        return sorted.sort((a, b) => b.abv - a.abv);
      default:
        return sorted;
    }
  }

  private getFavoritesFromStorage(): number[] {
    const stored = localStorage.getItem('beerFavorites');
    return stored ? JSON.parse(stored) : [];
  }

  private saveFavoritesToStorage(favorites: number[]): void {
    localStorage.setItem('beerFavorites', JSON.stringify(favorites));
  }

  private toggleFavoriteInList(favorites: number[], beerId: number): number[] {
    return favorites.includes(beerId)
      ? favorites.filter(id => id !== beerId)
      : [...favorites, beerId];
  }

  private updateBeerInList(beers: Beer[], beerId: number, updatedBeer: Beer): Beer[] {
    return beers.map(beer => beer.id === beerId ? updatedBeer : beer);
  }
}