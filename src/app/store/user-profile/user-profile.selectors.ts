import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { IUserProfile } from './user-profile.reducer';
import { GoogleState } from '../reducer';

export function getUser$(state$: Store<GoogleState>): Observable<IUserProfile> {
  return state$.select(state => state.user);
}

export function getIsUserSignedIn$(state$: Store<GoogleState>) {
  return state$.select(state => {
    return state.user.access_token !== '';
  });
}