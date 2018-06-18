import * as actions from '../constants/ActionTypes';

export function getCountries(d2) {
  return (dispatch, getState) => {
    let params = {
      paging: true,
      fields: 'id,name,level',
      filter: 'level:eq:3'
    };
    d2.models.organisationUnits.list(params).then(ous=>{
      dispatch({ type: actions.SET_COUNTRIES, data: ous.toArray() });
    })
    .catch(e=>{
      // @TODO:: snackbar alert
      //d2Actions.showSnackbarMessage("Error fetching data");
      console.error(e);
    });
  }
};
