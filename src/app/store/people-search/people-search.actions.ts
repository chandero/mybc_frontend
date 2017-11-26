import { Injectable } from '@angular/core';
import { ActionCreatorFactory } from 'ngrx-action-creator-factory';

@Injectable()
export class PeopleSearchActions {
  // @ActionCreator({
  //   type: 'UPDATE_FILTER',
  //   payload: string
  // })
  // @ActionCreator<string>(PlayerSearchActions.UPDATE_FILTER)
  // update;
  static UPDATE_FILTER = '[PeopleSearch] UPDATE_FILTER';
  static UPDATE_QUERY_PARAM = '[PeopleSearch] UPDATE_QUERY_PARAM';
  static SEARCH_NEW_QUERY = '[PeopleSearch] SEARCH_NEW_QUERY';
  static SEARCH_MORE_FOR_QUERY = '[PeopleSearch] SEARCH_MORE_FOR_QUERY';
  static GET_SUGGESTIONS = '[PeopleSearch] GET_SUGGESTIONS';
  static RESET_PAGE_TOKEN = '[PeopleSearch] RESET_PAGE_TOKEN';
  static SEARCH_RESULTS_RETURNED = '[PeopleSearch] SERACH_RESULTS_RETURNED';
  static SEARCH_CURRENT_QUERY = '[PeopleSearch] SEARCH_CURRENT_QUERY';
  static SEARCH_STARTED = '[PeopleSearch] SEARCH_STARTED';

  // Results Actions
  static ADD_RESULTS = '[PeopleSearch] ADD_RESULTS';
  static RESET_RESULTS = '[PeopleSearch] RESET_RESULTS';
  static ERROR_RESULTS = '[PeopleSearch] ERROR_RESULTS';

  getSuggestions = ActionCreatorFactory.create<string>(PeopleSearchActions.GET_SUGGESTIONS);
  searchCurrentQuery = ActionCreatorFactory.create(PeopleSearchActions.SEARCH_CURRENT_QUERY);
  searchNewQuery = ActionCreatorFactory.create<string>(PeopleSearchActions.SEARCH_NEW_QUERY);
  searchMoreForQuery = ActionCreatorFactory.create(PeopleSearchActions.SEARCH_MORE_FOR_QUERY);
  updateFilter = ActionCreatorFactory.create(PeopleSearchActions.UPDATE_FILTER);
  updateQueryParam = ActionCreatorFactory.create<any>(PeopleSearchActions.UPDATE_QUERY_PARAM);
  resetPageToken = ActionCreatorFactory.create<any>(PeopleSearchActions.RESET_PAGE_TOKEN);
  searchResultsReturned = ActionCreatorFactory.create<any>(PeopleSearchActions.SEARCH_RESULTS_RETURNED);
  searchStarted = ActionCreatorFactory.create(PeopleSearchActions.SEARCH_STARTED);
  addResults = ActionCreatorFactory.create(PeopleSearchActions.ADD_RESULTS);
  resetResults = ActionCreatorFactory.create(PeopleSearchActions.RESET_RESULTS);
  errorInSearch = ActionCreatorFactory.create<any>(PeopleSearchActions.ERROR_RESULTS);
}