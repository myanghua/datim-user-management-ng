import * as actions from "../constants/ActionTypes";
import filterCategories from "../Components/filter/filterCategories";
import { tabs } from "../Components/filter/tabCategories";
import { apiPatchUserDisabledState, apiFetchUser, apiFetchUsers } from "../api/users";

const filterString = (category, value) => {
  const filterParam = filterCategories[category].param;
  return value ? `${filterParam}${value}` : null;
};

const arrayToIdMap = array => {
  return array.reduce((obj, item) => {
    obj[item.id] = item;
    return obj;
  }, {});
};

export const getUserListing = () => (dispatch, getState) => {
  const state = getState();
  //TODO: create selector
  const filters = Object.values(state.list.filters);
  const tab = state.list.tab;
  const page = state.list.currentPage;

  dispatch({
    type: actions.SHOW_PROCESSING,
    status: true,
  });

  const params = {
    page,
  };

  let filterStrings = filters
    .filter(f => f.detail.length > 0)
    .map(filter => filterString(filter.category, filter.detail));

  const tabFilter = tabs[tab].param;
  if (tabFilter.length) {
    filterStrings.push(tabFilter);
  }

  if (filterStrings.length > 0) {
    params.filter = filterStrings;
  }

  apiFetchUsers(params)
    .then(u => {
      dispatch({
        type: actions.SET_USERS,
        data: arrayToIdMap(u.toArray()),
      });
      dispatch({
        type: actions.SET_PAGER,
        data: u.pager,
      });
      dispatch({
        type: actions.HIDE_PROCESSING,
        status: false,
      });
    })
    .catch(e => {
      dispatch({
        type: actions.HIDE_PROCESSING,
        status: false,
      });
      // @TODO:: snackbar alert
      //d2Actions.showSnackbarMessage("Error fetching data");
      console.error(e);
    });
};

export const setFilter = data => dispatch => {
  try {
    dispatch({ type: actions.SET_FILTER, data });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error setting filter: ", err);
    return err;
  }
};

export const removeFilter = (data, refetch) => dispatch => {
  try {
    dispatch({ type: actions.REMOVE_FILTER, data });
    if (refetch) {
      dispatch(getUserListing());
    }
  } catch (err) {
    console.log("Error removing filter: ", err);
    return err;
  }
};

export const removeFilters = () => dispatch => {
  try {
    dispatch({ type: actions.REMOVE_FILTERS });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error removing filters: ", err);
    return err;
  }
};

export const setTab = tab => dispatch => {
  try {
    dispatch({ type: actions.SET_TAB, data: tab });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error removing setting tab: ", err);
    return err;
  }
};

export const setCurrentPage = data => dispatch => {
  try {
    dispatch({ type: actions.SET_CURRENT_PAGE, data });
    dispatch(getUserListing());
  } catch (err) {
    console.log("Error setting page: ", err);
    return err;
  }
};

export function setSelectedUser(user) {
  return dispatch => {
    dispatch({ type: actions.SET_SELECTED_USER, data: user });
  };
}

export function clearSelectedUser() {
  return dispatch => {
    dispatch({ type: actions.CLEAR_SELECTED_USER });
  };
}

export const setUserDisabledState = (userId, disabled) => async dispatch => {
  const onSuccess = user => {
    return dispatch({ type: actions.SET_USER, data: user });
  };

  try {
    await apiPatchUserDisabledState(userId, disabled);
    const user = await apiFetchUser(userId);
    return onSuccess(user);
  } catch (error) {
    console.log("Error changing enabled state of user", error);
  }
};

export function setFilters(filters) {
  return dispatch => {
    dispatch({ type: actions.SET_FILTERS, data: filters });
  };
}
