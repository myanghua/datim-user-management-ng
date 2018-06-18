import * as actions from '../constants/ActionTypes';
import config from './config.js';

// save a copy of D2 in the store
export function setD2(d2) {
  return (dispatch) => {
    dispatch({ type: actions.SET_D2, d2: d2 });
  }
};

// Current user and authorizations
export function setMe() {
  return (dispatch, getState) => {
    const { core } = getState();
    core.d2.Api.getApi().get('/me?fields=:all,userCredentials[:owner,!userGroupAccesses,userRoles[id,name,displayName]],!userGroupAccesses,userGroups[id,name,displayName],organisationUnits[id,name]')
      .then(me=>{
        core.d2.Api.getApi().get('/me/authorization').then( auth =>{
          me.authorizations = auth;
          dispatch({ type: actions.SET_ME, data: me });
          console.log('ME',me);
        })
        .catch(e=>{
          // @TODO:: snackbar alert
          //d2Actions.showSnackbarMessage("Error fetching data");
          console.error(e);
        });

      })
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
  }
};


export function getCountries(d2) {
  return (dispatch, getState) => {
    let params = {
      paging: true,
      fields: 'id,name,level',
      filter: 'level:eq:3'
    };
    d2.models.organisationUnits.list(params).then(ous=>{
      dispatch({ type: actions.SHOW_PROCESSING, status: true });
      dispatch({ type: actions.SET_COUNTRIES, data: ous.toArray() });
      dispatch({ type: actions.HIDE_PROCESSING, status: false });

    })
    .catch(e=>{
      // @TODO:: snackbar alert
      //d2Actions.showSnackbarMessage("Error fetching data");
      console.error(e);
    });
  }
};

export function getLocales(d2) {
  return (dispatch, getState) => {
    d2.Api.getApi().get('/locales/ui').then(res=>{
      dispatch({ type: actions.SHOW_PROCESSING, status: true });
      dispatch({ type: actions.SET_LOCALES, data: res });
      dispatch({ type: actions.HIDE_PROCESSING, status: false });
    })
    .catch(e=>{
      // @TODO:: snackbar alert
      //d2Actions.showSnackbarMessage("Error fetching data");
      console.error(e);
    });
  }
}


// Parse the main object config file
export function parseConfiguration() {
  return (dispatch, getState) => {
    dispatch({ type: actions.SHOW_PROCESSING, status: true });
    dispatch({ type: actions.SET_CONFIG, data: config });
    dispatch({ type: actions.SET_USERTYPES, data: Object.keys(config) });

    const streams = new Set();
    for (let key of Object.keys(config)){
      for (let stream of Object.keys(config[key].streams)){
        streams.add(stream);
      }
    }
    dispatch({ type: actions.SET_STREAMS, data: streams.values() });


    // @TODO:: roles, groups, locales

    dispatch({ type: actions.HIDE_PROCESSING, status: false });

  }
};
