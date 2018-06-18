// @flow
import * as actions from '../constants/ActionTypes';

const initialState = {
  userCount:0,
  users:[],
  selectedUser:false,
  filters:[],
  tab: 'all'
};

export const listReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_USERS:
      return {
        ...state,
        users: action.data
      };
    case actions.SET_USER:
      return {
        ...state,
        selectedUser: action.data
      };
    case actions.SET_USERCOUNT:
      return {
        ...state,
        userCount: action.data
      };
    case actions.SET_FILTERS:
      return {
        ...state,
        filters: action.data
      };
    case actions.SET_TAB:
      return {
        ...state,
        tab: action.data
      };
    default: {
      return state;
    }
  }
};

export default listReducers;
