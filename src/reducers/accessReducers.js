// @flow
import * as actions from "../constants/ActionTypes";

const initialState = {
  show: false,
  message: ""
};

export const accessReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_ACCESSDENIED:
      return {
        ...state,
        show: true,
        message: action.message
      };
    default: {
      return state;
    }
  }
};

export default accessReducers;
