import * as actions from "../constants/ActionTypes";
import * as d2Actions from "../../actions";

export function getUserListing(d2, filters, page) {
  return (dispatch, getState) => {
    dispatch({ type: actions.SHOW_PROCESSING, status: true });

    let params = {
      paging: true,
      fields:
        "id,surname,firstName,email,employer,displayName,userCredentials[username,disabled,lastLogin]",
      page: page,
    };
    if (Object.values(filters).length > 0) {
      params.filter = Object.values(filters).join(",");
    }
    d2.models.users
      .list(params)
      .then(u => {
        dispatch({ type: actions.SET_USERS, data: u.toArray() });
        dispatch({ type: actions.SET_PAGER, data: u.pager });
        dispatch({ type: actions.HIDE_PROCESSING, status: false });
      })
      .catch(e => {
        dispatch({ type: actions.HIDE_PROCESSING, status: false });
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
  };
}

export function setSelectedUser(user) {
  return dispatch => {
    dispatch({ type: actions.SET_USER, data: user });
  };
}

export function setFilters(filters) {
  return dispatch => {
    dispatch({ type: actions.SET_FILTERS, data: filters });
  };
}

export function setTab(tab) {
  return dispatch => {
    dispatch({ type: actions.SET_TAB, data: tab });
  };
}
