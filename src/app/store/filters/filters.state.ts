import { FILTER_CONSTANTS } from '../../constants/app.constants';

export interface FiltersState {
  name: string;
  alcohol: number;
  favorites: boolean;
  sort: string;
}

export const initialFiltersState: FiltersState = {
  name: '',
  alcohol: FILTER_CONSTANTS.MAX_ALCOHOL_PERCENTAGE,
  favorites: false,
  sort: 'name_asc'
};