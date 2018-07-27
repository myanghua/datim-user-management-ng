import * as actions from "../constants/ActionTypes";

export function closeSnackbar() {
  return {
    type: actions.CLOSE_SNACKBAR
  };
}

export function closeProgressSpinner() {
  return {
    type: actions.HIDE_PROCESSING
  };
}

export function openProgressSpinner() {
  return {
    type: actions.SHOW_PROCESSING
  };
}
