// @flow
import * as actions from "../constants/ActionTypes";

const initialState = {
  page: "list",
};

export const mainMenuReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_PAGE:
      return {
        ...state,
        page: action.data,
      };
    default: {
      return state;
    }
  }
};

export default mainMenuReducers;
