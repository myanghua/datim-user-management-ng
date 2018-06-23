// @flow
import * as actions from '../constants/ActionTypes';

const initialState = {
  d2: {},
  me: {},
  roles: [],
  groups: [],
  countries: [],
  userTypes: [],
  locales: [],
  fundingagency: null,
  agencies: [],
  implementingpartner: null,
  partners: [],
  dodid: null,
  dod: [],
  streams: [],
  config: {},
};

export const coreReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_D2:
      return {
        ...state,
        d2: action.d2
      };
    case actions.SET_ME:
      return {
        ...state,
        me: action.data
      };
    case actions.SET_CONFIG:
      return {
        ...state,
        config: action.data
      };
    case actions.SET_STREAMS:
      return {
        ...state,
        streams: action.data
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
    case actions.SET_FUNDINGAGENCY:
      return {
        ...state,
        fundingagency: action.data
      };
    case actions.SET_AGENCIES:
      return {
        ...state,
        agencies: action.data
      };
    case actions.SET_IMPLEMENTINGPARTNER:
      return {
        ...state,
        implementingpartner: action.data
      };
    case actions.SET_PARTNERS:
      return {
        ...state,
        partners: action.data
      };
    case actions.SET_DODUID:
      return {
        ...state,
        dodid: action.data
      };
    case actions.SET_DOD:
      return {
        ...state,
        dod: action.data
      };
    default: {
      return state;
    }
  }
};

export default coreReducers;
