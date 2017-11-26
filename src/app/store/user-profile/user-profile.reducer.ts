import { Observable } from 'rxjs/Observable';
import { GoogleState } from '../reducer';
import { Action } from '@ngrx/store';
import { UserProfileActions } from './user-profile.actions';

export * from './user-profile.actions';

export interface IUserProfile {
  access_token: string;
  data?: {};
  nextPageToken?: string;
  profile: GoogleBasicProfile;
}

export interface GoogleBasicProfile {
  name?: string;
  imageUrl?: string;
}

const initialUserState: IUserProfile = {
  access_token: '',
  data: {},
  nextPageToken: '',
  profile: {},
};
interface UnsafeAction extends Action {
  payload: any;
}
export function user(state = initialUserState, action: UnsafeAction): IUserProfile {
  switch (action.type) {

    case UserProfileActions.LOG_OUT:
      return { ...initialUserState };

    case UserProfileActions.UPDATE:
      return { ...state, data: action.payload };

    case UserProfileActions.UPDATE_NEXT_PAGE_TOKEN:
      return { ...state, nextPageToken: action.payload };

    case UserProfileActions.UPDATE_USER_PROFILE:
      return { ...state, profile: action.payload };

    default:
      return state;
  }
}