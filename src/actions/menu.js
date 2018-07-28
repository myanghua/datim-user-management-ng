import * as actions from "../constants/ActionTypes";

export function setPage(page) {
  return dispatch => {
    dispatch({ type: actions.SET_PAGE, data: page });
  };
}
