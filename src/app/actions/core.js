import * as actions from '../constants/ActionTypes';
import config from './config.js';

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
