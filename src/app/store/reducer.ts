import { Observable } from 'rxjs/Observable';
import { RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { IUserProfile, user, UserProfileActions } from './user-profile/user-profile.reducer';
import { PeopleSearch, search, PeopleSearchActions } from './people-search/people-search.reducer';

export interface GoogleState {
    user: IUserProfile;
    search: PeopleSearch;
  };

export let GoogleReducers = {
  user,
  search,
};
  
export let GoogleActions = [
  UserProfileActions,
  PeopleSearchActions,
];
  
export function getPeopleSearchResults$(state$: Store<GoogleState>): Observable<any[]> {
  return state$.select(state => state.search.results);
}
  