import * as actions from "../constants/ActionTypes";
import {
  apiPatchUserDisabledState,
  apiFetchUser,
  apiFetchUsers,
} from "../services/users";
import { getUserType, bindUserGroupData } from "../models/user";
import { arrayToIdMap, buildFilterString } from "../utils";

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
    filter: buildFilterString(filters, tab),
  };

  apiFetchUsers(params)
    .then(u => {
      dispatch({
        type: actions.SET_PAGER,
        data: u.pager,
      });

      const usersWithType = u.toArray().map(user => {
        const type = getUserType(user);
        return Object.assign({}, user, { type });
      });

      return Promise.resolve(usersWithType);
    })
    .then(users => bindUserGroupData(users, state.core.me))
    .then(users => {
      dispatch({
        type: actions.SET_USERS,
        data: arrayToIdMap(users),
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
    const type = getUserType(user);
    const userWithType = Object.assign({}, user, { type });

    return onSuccess(userWithType);
  } catch (error) {
    console.log("Error changing enabled state of user", error);
  }
};

export function setFilters(filters) {
  return dispatch => {
    dispatch({ type: actions.SET_FILTERS, data: filters });
  };
}
