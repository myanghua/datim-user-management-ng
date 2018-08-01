// @flow
import * as actions from "../constants/ActionTypes";

const initialState = {
  users: {},
  pager: {},
  selectedUser: false,
  filters: {},
  tab: "all",
  currentPage: 0,
};

export const listReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_USERS:
      return {
        ...state,
        users: action.data,
      };
    case actions.SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: action.data,
      };
    case actions.CLEAR_SELECTED_USER:
      return {
        ...state,
        selectedUser: initialState.selectedUser,
      };
    case actions.SET_USER:
      const user = action.data;
      const users = { ...state.users, [user.id]: user };

      return { ...state, users };

    case actions.SET_PAGER:
      return {
        ...state,
        pager: action.data,
      };
    case actions.SET_FILTERS:
      return {
        ...state,
        filters: action.data,
      };

    case actions.SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.data,
      };

    case actions.SET_FILTER:
      const newFilters = Object.assign({}, state.filters, action.data);
      return {
        ...state,
        filters: newFilters,
      };
    case actions.REMOVE_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
      };

    case actions.REMOVE_FILTER:
      const { [action.data]: value, ...remainingFilters } = state.filters;

      return {
        ...state,
        filters: remainingFilters,
      };

    case actions.SET_TAB:
      return {
        ...state,
        tab: action.data,
      };
    default: {
      return state;
    }
  }
};

export default listReducers;
