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

export const getUserLocale = username => async dispatch => {
  // d2 library does not handle other people's userSettings
  const url = "/api/29/userSettings/keyUiLocale?user=" + username;
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/html",
    },
    credentials: "same-origin", // make sure to send cookies on prod
    redirect: "follow",
  })
    .then(response => response.text())
    .then(data => {
      if (data.length > 6) {
        // in dev this call will not route properly so set a generic
        return "en";
      }
      return data;
    })
    .catch(e => {
      console.error("Error setting locale", e);
      return false;
    });
};
