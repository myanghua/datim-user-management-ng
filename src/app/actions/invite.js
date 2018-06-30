import * as actions from "../constants/ActionTypes";

export const showProcessing = () => dispatch => {
  dispatch({ type: actions.SHOW_PROCESSING });
};

export const hideProcessing = () => dispatch => {
  dispatch({ type: actions.HIDE_PROCESSING });
};

export const denyAccess = message => dispatch => {
  dispatch({ type: actions.SHOW_ACCESSDENIED, message: message });
};
