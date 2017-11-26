import { Action } from '@ngrx/store';
import { PeopleSearchActions } from './people-search.actions';

export * from './people-search.actions';

export interface PeopleSearch {
  query: string;
  filter: string;
  queryParams: {
    preset: string;
    duration: number;
  };
  pageToken: {
    next: string;
    prev: string;
  };
  isSearching: boolean;
  results: any[];
}

interface SearchQueryParam {
  [property: string]: any;
}

export interface PresetParam {
  label: string;
  value: any;
}
let initialState: PeopleSearch = {
  query: '',
  filter: '',
  queryParams: {
    preset: '',
    duration: -1
  },
  pageToken: {
    next: '',
    prev: ''
  },
  isSearching: false,
  results: []
};
export function search(state: PeopleSearch = initialState, action: Action): PeopleSearch {

  switch (action.type) {
    case PeopleSearchActions.SEARCH_NEW_QUERY:
      return Object.assign({}, state, {
        query: action.payload,
        isSearching: true
      });

    case PeopleSearchActions.UPDATE_QUERY_PARAM:
      const queryParams = Object.assign({}, state.queryParams, action.payload);
      return Object.assign({}, state, { queryParams });

    case PeopleSearchActions.SEARCH_RESULTS_RETURNED:
      const { nextPageToken, prevPageToken } = action.payload;
      const statePageToken = state.pageToken;
      const pageToken = {
        next: nextPageToken || statePageToken.next,
        prev: prevPageToken || statePageToken.prev
      };
      return Object.assign({}, state, { pageToken });

    case PeopleSearchActions.SEARCH_STARTED:
      return Object.assign({}, state, { isSearching: true });

    case PeopleSearchActions.ADD_RESULTS:
      return Object.assign({}, state, {
        results: [...state.results, ...action.payload],
        isSearching: false
      });

    case PeopleSearchActions.RESET_RESULTS:
      return Object.assign({}, state, { results: [] });

    default:
      // upgrade policy - for when the initialState has changed
      return Object.assign({}, initialState, state);
  }
};

export const searchRegister = {
  reducer: { search },
  actions: PeopleSearchActions
};

export const getQuery = (state: PeopleSearch) => state.query;
export const getQueryParams = (state: PeopleSearch) => state.queryParams;
export const getQueryParamPreset = (state: PeopleSearch) => state.queryParams.preset;