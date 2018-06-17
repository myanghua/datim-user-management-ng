import * as actions from '../constants/ActionTypes'

export function closeSnackbar() {
  return {
    type: actions.CLOSE_SNACKBAR
  }
}
