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
          me.authorities = auth;

          // add some functions to me to make querying easier
          me.hasRole = (role) => {
            return ((me.userCredentials || {}).userRoles || []).some(function (userRole) { return userRole.name === role; });
          }
          me.hasAllAuthority = () => {
            return (me.authorities || []).indexOf('ALL') >= 0;
          };
          me.isUserAdministrator = () => {
            return (me.hasUserRole('User Administrator'));
          };
          me.isGlobalUser = () => {
            return (me.organisationUnits && me.organisationUnits.length && me.organisationUnits[0].name === 'Global');
          };

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

    const countries = localStorage.getItem('countries');

    if (countries) {
      dispatch({ type: actions.SET_COUNTRIES, data: JSON.parse(countries)});
      console.log('COUNTRIES: pulling from cache');
    }
    else {
      let params = {
        paging: false,
        fields: 'id,name,level',
        filter: 'level:eq:3'
      };
      d2.models.organisationUnits.list(params).then(ous=>{
        dispatch({ type: actions.SHOW_PROCESSING, status: true });
        dispatch({ type: actions.SET_COUNTRIES, data: ous.toArray() });
        localStorage.setItem('countries', JSON.stringify(ous.toArray()));
        dispatch({ type: actions.HIDE_PROCESSING, status: false });
      })
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
    }
  }
};

export function getLocales(d2) {
  return (dispatch, getState) => {

    const locales = localStorage.getItem('locales');

    if (locales) {
      dispatch({ type: actions.SET_LOCALES, data: JSON.parse(locales)});
      console.log('LOCALES: pulling from cache');
    }
    else {
      d2.Api.getApi().get('/locales/ui').then(res=>{
        dispatch({ type: actions.SET_LOCALES, data: res });
        localStorage.setItem('locales', JSON.stringify(res));
      })
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
    }
  }
}

export function getUserRoles(d2) {
  return (dispatch, getState) => {
    const data = localStorage.getItem('userroles');
    if (data) {
      dispatch({ type: actions.SET_ROLES, data: JSON.parse(data)});
      console.log('ROLES: pulling from cache');
    }
    else {
      let params = {
        paging: false,
        fields: 'id,name,description',
      };
      d2.models.userRoles.list(params).then(res=>{
        res.getByName = (name) => {
          return res.filter((el) =>
            (el.name.toLowerCase() === name.toLowerCase())
          );
        };
        dispatch({ type: actions.SET_ROLES, data: res });
        localStorage.setItem('userroles', JSON.stringify(res));
      })
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
    }
  }
}

export function getFundingAgencyUID(d2) {
  return (dispatch, getState) => {
    const data = localStorage.getItem('fundingagency');
    if (data && data !== null) {
      dispatch({ type: actions.SET_FUNDINGAGENCY, data: data});
      getAgencies(d2,data,dispatch);
    }
    else {
      let params = {
        paging: false,
        fields: 'id',
        filter: 'name:eq:Funding Agency'
      };
      d2.models.categoryOptionGroupSets.list(params).then(res=>{
        dispatch({ type: actions.SET_FUNDINGAGENCY, data: res.toArray()[0].id });
        localStorage.setItem('fundingagency', res.toArray()[0].id);
        getAgencies(d2, res.toArray()[0].id, dispatch);
      })
      .then()
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
    }
  }
}

export function getAgencies(d2,fundingAgencyUID,dispatch) {
  let params = {
    paging: false,
    fields: 'categoryOptionGroups[id,name,code]',
  };
  d2.models.categoryOptionGroupSets.get(fundingAgencyUID,params).then(res=>{
    if (res.hasOwnProperty('categoryOptionGroups')) {
      const agencies = res.categoryOptionGroups.toArray().sort((a,b)=>{
        return a.name > b.name;
      });
      dispatch({ type: actions.SET_AGENCIES, data: agencies });
    }
  })
  .catch(e=>{
    // @TODO:: snackbar alert
    //d2Actions.showSnackbarMessage("Error fetching data");
    console.error(e);
  });
}

export function getImplementingPartnerUID(d2) {
  return (dispatch, getState) => {
    const data = localStorage.getItem('implementingpartner');
    if (data && data !== null) {
      dispatch({ type: actions.SET_IMPLEMENTINGPARTNER, data: data});
      getPartners(d2,data,dispatch);
    }
    else {
      let params = {
        paging: false,
        fields: 'id',
        filter: 'name:eq:Implementing Partner'
      };
      d2.models.categoryOptionGroupSets.list(params).then(res=>{
        dispatch({ type: actions.SET_IMPLEMENTINGPARTNER, data: res.toArray()[0].id });
        localStorage.setItem('implementingpartner', res.toArray()[0].id);
        getPartners(d2, res.toArray()[0].id, dispatch);
      })
      .then()
      .catch(e=>{
        // @TODO:: snackbar alert
        //d2Actions.showSnackbarMessage("Error fetching data");
        console.error(e);
      });
    }
  }
}

export function getPartners(d2,ipUID,dispatch) {
  let params = {
    paging: false,
    fields: 'categoryOptionGroups[id,name,code]',
  };
  d2.models.categoryOptionGroupSets.get(ipUID,params).then(res=>{
    if (res.hasOwnProperty('categoryOptionGroups')) {
      const partners = res.categoryOptionGroups.toArray().sort((a,b)=>{
        return a.name > b.name;
      });
      dispatch({ type: actions.SET_PARTNERS, data: partners });
    }
  })
  .catch(e=>{
    // @TODO:: snackbar alert
    //d2Actions.showSnackbarMessage("Error fetching data");
    console.error(e);
  });
}



export function getUseGroups(d2) {
  return (dispatch, getState) => {
    let params = {
      paging: false,
      fields: 'id,name,userGroupAccesses[id,displayName],managedByGroups',
    };
    d2.models.userGroups.list(params).then(res=>{
      dispatch({ type: actions.SET_GROUPS, data: res });
    })
    .catch(e=>{
      // @TODO:: snackbar alert
      //d2Actions.showSnackbarMessage("Error fetching data");
      console.error(e);
    });
  }
}

export function getUseTypes(d2) {
  return (dispatch, getState) => {
    let params = {
      paging: false,
      fields: 'id,name,userGroupAccesses[*],managedByGroups',
    };
    d2.models.userGroups.list(params).then(res=>{
      dispatch({ type: actions.SET_USERTYPES, data: res });
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
    dispatch({ type: actions.SET_STREAMS, data: [...streams] });


    // @TODO:: roles, groups, locales

    dispatch({ type: actions.HIDE_PROCESSING, status: false });

  }
};
