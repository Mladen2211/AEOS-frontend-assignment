import { Pipe, PipeTransform } from '@angular/core';
import { Beer } from './models/beer.model';

@Pipe({
  name: 'filterBeers',
  standalone: true,
  pure: false
})
export class FilterBeersPipe implements PipeTransform {
  transform(
    beers: Beer[],
    name: string | null,
    alcohol: number | null,
    favorites: boolean | null,
    sort: string | null
  ): Beer[] {
    if (!beers) return [];

    let filtered = beers.filter(beer =>
      (name ? beer.name.toLowerCase().includes(name.toLowerCase()) : true) &&
      (alcohol !== null ? beer.abv <= alcohol : true) &&
      (favorites !== null ? (!favorites || beer.isFavorite) : true)
    );

    const sortKey = sort || 'name_asc';
    filtered.sort((a, b) => {
      switch (sortKey) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'alcohol_asc':
          return a.abv - b.abv;
        case 'alcohol_desc':
          return b.abv - a.abv;
        default:
          return 0;
      }
    });

    return filtered;
  }
}