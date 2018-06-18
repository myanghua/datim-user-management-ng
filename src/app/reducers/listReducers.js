// @flow
import * as actions from "../constants/ActionTypes";

const initialState = {
  users: [],
  pager: {},
  selectedUser: false,
  filters: [],
  tab: "all",
};

export const listReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_USERS:
      return {
        ...state,
        users: action.data,
      };
    case actions.SET_USER:
      return {
        ...state,
        selectedUser: action.data,
      };
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
