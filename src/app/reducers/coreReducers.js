// @flow
import * as actions from '../constants/ActionTypes';

const initialState = {
  d2: {},
  roles: [],
  groups: [],
  countries: [],
  userTypes: [],
  locales: []
};

export const coreReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_D2:
      return {
        ...state,
        d2: action.d2
      };
    case actions.SET_ROLES:
      return {
        ...state,
        roles: action.data
      };
    case actions.SET_GROUPS:
      return {
        ...state,
        groups: action.data
      };
    case actions.SET_COUNTRIES:
      return {
        ...state,
        countries: action.data
      };
    case actions.SET_USERTYPES:
      return {
        ...state,
        userTypes: action.data
      };
    case actions.SET_LOCALES:
      return {
        ...state,
        locales: action.data
      };
    default: {
      return state;
    }
  }
};

export default coreReducers;
