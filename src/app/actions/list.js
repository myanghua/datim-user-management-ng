import * as actions from "../constants/ActionTypes";
import * as d2Actions from "../../actions";
import filterCategories from "../components/filterCategories";

export function getUserListing(d2, filters = [], page) {
  return (dispatch, getState) => {
    dispatch({ type: actions.SHOW_PROCESSING, status: true });

    let params = {
      paging: true,
      fields:
        "id,surname,firstName,email,employer,displayName,userCredentials[username,disabled,lastLogin]",
      page: page,
    };
    if (filters.length > 0) {
      params.filter = filters.join(",");
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

export function setFilter(data) {
  return dispatch => {
    dispatch({ type: actions.SET_FILTER, data });
  };
}

export function setCurrentPage(page) {
  return dispatch => {
    dispatch({ type: actions.SET_CURRENT_PAGE, data: page });
  };
}

export function setTab(tab) {
  return dispatch => {
    dispatch({ type: actions.SET_TAB, data: tab });
  };
}
