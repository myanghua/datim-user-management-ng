// @flow
import * as actions from "../constants/ActionTypes";

const initialState = {
  processing: true,
};

export const processingReducers = (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_PROCESSING:
      return {
        ...state,
        processing: true,
      };
    case actions.HIDE_PROCESSING:
      return {
        ...state,
        processing: false,
      };
    default: {
      return state;
    }
  }
};

export default processingReducers;
