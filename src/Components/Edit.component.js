import React, { Component } from "react";
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import WorkOutlineIcon from "@material-ui/icons/WorkOutline";
import OutlinedFlagIcon from "@material-ui/icons/OutlinedFlag";
import GroupIcon from "@material-ui/icons/Group";
import Grid from "@material-ui/core/Grid";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import MainMenu from "../containers/MainMenu.js";
import SelectLocale from "./SelectLocale.component";
import DataStream from "./DataStream.component";
import DataAction from "./DataAction.component";
// import AppTheme from "../colortheme";
import actions from "../actions";

class Edit extends Component {
  contextTypes: {
    d2: React.PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { showProcessing, match } = this.props;
    showProcessing();

    if (!match || !match.params || !match.params.id) {
      this.state = { error: "No user specified" };
    } else {
      this.state = {
        uid: match.params.id,
        userType: "-",
        org: "-",
        userManager: false,
        locale: "en",
        baseLocale: "en",
        actions: {},
        streams: {},
        baseActions: {},
        baseStreams: {},
      };
    }

    this.handleChangeLocale = this.handleChangeLocale.bind(this);
    this.handleCheckUserManager = this.handleCheckUserManager.bind(this);
    this.handleChangeStream = this.handleChangeStream.bind(this);
    this.handleChangeActions = this.handleChangeActions.bind(this);
  }

  componentDidMount() {
    // make sure my auth properties have been loaded.
    // Probably haven't yet, so we check in componentDidUpdate as well
    if (this.props.core.me.hasAllAuthority || false) {
      if (this.secCheck() === true) {
        this.getUserDetails(this.state.uid);
      }
    }
  }

  componentDidUpdate(prevProps) {
    // make sure my auth properties have been loaded
    if (this.props.core.me !== prevProps.core.me) {
      // and that they can see things
      if (this.secCheck() === true) {
        // looks good, prefill form as mch as possible
        this.getUserDetails(this.state.uid);
      }
    }
  }

  // perform some security checks to make sure they can access things
  // cloned from Invite.component.js
  secCheck() {
    const { core, hideProcessing, denyAccess } = this.props;
    const isSuperUser = core.me && core.me.hasAllAuthority && core.me.hasAllAuthority();

    // access check super user
    if (!isSuperUser && !core.me.isUserAdministrator()) {
      hideProcessing();
      denyAccess(
        "Your user account does not seem to have the authorities to access this functionality."
      );
      console.warn(
        "This user is not a user administrator",
        core.me.hasAllAuthority(),
        core.me.isUserAdministrator()
      );
      return false;
    }

    // Find out if they have access to any streams (groups)
    const userGroups = core.me.userGroups || [];
    const userTypesArr = Object.keys(core.config).map(function(key) {
      let obj = core.config[key];
      obj.name = key;
      return obj;
    });
    const myStreams = userTypesArr.filter(ut => {
      return userGroups.some(ug => {
        return new RegExp(ut.groupFilter, "i").test(ug.name);
      });
    });

    if (isSuperUser || myStreams.length > 0) {
      hideProcessing();
      return true;
    } else {
      denyAccess(
        "Your user account does not seem to have access to any of the data streams."
      );
      console.warn("No valid streams. I have access to ", userGroups);
      hideProcessing();
      return false;
    }
  }

  // merge together userGroups based upon their cogs ID (for agencies and partners)
  extendObj = (obj, userGroup, name, groupType) => {
    return (function() {
      obj[name] = obj[name] || {};
      obj[name][groupType] = userGroup;
      return obj;
    })();
  };

  // get a list of relevant Partners based upon the selected "country"
  // for some reason "Partners" are both userGroups and categoryOptionGroups
  // warning: this is mostly voodoo ported from the previous app
  // @TODO:: move somewhere else
  getPartnersInOrg(ouUID) {
    const { core, d2 } = this.props;
    const countryName = core.countries.filter(r => r.id === ouUID)[0].name;
    const params = {
      paging: false,
      fields: "id,name,code",
      filter: "name:ilike:" + countryName + " Partner",
    };

    return d2.models.userGroups
      .list(params)
      .then(res => {
        // these two functions are copied from the original stores.json
        // extract the partner code in  format of categoryOptionGroups "Partner_XXXX"
        let getPartnerCode = userGroup => {
          return (/Partner \d+?(?= )/i.exec(userGroup.name) || "")
            .toString()
            .replace("Partner ", "Partner_");
        };
        // figure out the user group type based on the naming convention
        let getType = userGroup => {
          return / all mechanisms - /i.test(userGroup.name)
            ? "mechUserGroup"
            : / user administrators - /i.test(userGroup.name)
              ? "userAdminUserGroup"
              : "userUserGroup";
        };

        // take the userGroups that have a name like our OU, group and index them by their partner_code
        const merged = res.toArray().reduce((obj, ug) => {
          return this.extendObj(obj, ug.toJSON(), getPartnerCode(ug), getType(ug));
        }, {});
        // shove that data into the main partners object
        const mapped = core.partners.map(p => {
          return Object.assign({}, p, merged[p.code]);
        });
        // remove any that didn't get mapped and sort
        let filtered = mapped
          .filter(
            p =>
              p.mechUserGroup &&
              p.mechUserGroup.id &&
              p.userUserGroup &&
              p.userUserGroup.id
          )
          .sort((a, b) => {
            return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
          });
        // check for DoD silliness
        filtered.forEach(p => {
          p.dodEntry = (core.dod[ouUID] || {})[p.id] || false; // will be false, 0, or 1
          p.normalEntry = p.dodEntry === false; // no DoD information
        });
        return filtered;
      })
      .catch(e => {
        console.error(e);
        return false;
      });
  }

  // get a list of relevant Agencies for this OU/Country
  // @TODO:: move somewhere else
  getAgenciesInOrg(ouUID) {
    const { core, d2 } = this.props;
    const countryName = core.countries.filter(r => r.id === ouUID)[0].name;
    const params = {
      paging: false,
      fields: "id,name,code",
      filter: "name:ilike:" + countryName + " Agency",
    };
    return d2.models.userGroups
      .list(params)
      .then(res => {
        // these two functions are copied from the original stores.json
        // extract the agency code in  format of categoryOptionGroups "Agency_XXXX"
        let getAgencyCode = userGroup => {
          return (/Agency .+?(?= all| user)/i.exec(userGroup.name) || "")
            .toString()
            .replace("Agency ", "Agency_");
        };
        // figure out the user group type based on the naming convention
        let getType = userGroup => {
          return /all mechanisms$/i.test(userGroup.name)
            ? "mechUserGroup"
            : /user administrators$/i.test(userGroup.name)
              ? "userAdminUserGroup"
              : "userUserGroup";
        };

        // take the userGroups that have a name like our OU, group and index them by their partner_code
        const merged = res.toArray().reduce((obj, ug) => {
          return this.extendObj(obj, ug.toJSON(), getAgencyCode(ug), getType(ug));
        }, {});
        // shove that data into the main partners object
        const mapped = core.agencies.map(a => {
          return Object.assign({}, a, merged[a.code]);
        });
        // remove any that didn't get mapped and sort
        let filtered = mapped
          .filter(
            a =>
              a.mechUserGroup &&
              a.mechUserGroup.id &&
              a.userUserGroup &&
              a.userUserGroup.id
          )
          .sort((a, b) => {
            return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
          });
        return filtered;
      })
      .catch(e => {
        console.error(e);
        return false;
      });
  }

  // @TODO:: build, original is convoluted because IA is spread over 3 user group patterns
  // @TODO:: move somewhere else
  getInteragencyGroups(ouUID) {
    // userUserGroup
    // "name:ilike:OU ${organisationUnit.name} Country team"
    // userAdminUserGroup
    // "name:ilike:OU ${organisationUnit.name} user administrators"
    // mechUserGroup
    // "name:ilike:OU ${organisationUnit.name} all mechanisms"
    return false;
  }

  // find out who this person is
  getUserDetails = uid => {
    const { d2, core, showProcessing, hideProcessing, getUserLocale, match } = this.props;

    showProcessing();

    d2.models.users
      .get(match.params.id, {
        fields:
          ":all,userCredentials[:owner,!userGroupAccesses,userRoles[id,name]],!userGroupAccesses,userGroups[id,name],organisationUnits[id,name]",
      })
      .then(user => {
        getUserLocale(user.userCredentials.username)
          .then(locale => {
            if (!locale) {
              locale = "en";
            }
            this.setState({
              locale: locale,
              baseLocale: locale,
            });
          })
          .catch(error => {
            this.setState({
              locale: "en",
              baseLocale: "en",
            });
            console.error(error);
          });
        return user;
      })
      .then(user => {
        // get the other details

        // original app assumed user would have only one OU (at the country level)
        const ous = user.organisationUnits.toArray()[0];
        let countries = core.countries;
        // Don't forget to add in the Global "country"
        if (core.countries[0].id !== core.config.Global.ouUID) {
          countries.unshift({ id: core.config.Global.ouUID, name: "Global" });
        }
        const country = countries.filter(c => ous.id === c.id)[0].name;

        // need to use that country name to determine other data...
        const userGroups = user.userGroups.toArray() || [];
        const userTypesArr = Object.keys(core.config).map(function(key) {
          let obj = core.config[key];
          obj.name = key;
          return obj;
        });
        const types = userTypesArr.filter(ut => {
          return userGroups.some(ug => {
            return new RegExp(ut.groupFilter, "i").test(ug.name);
          });
        });
        const userType = ((types || [])[0] || {}).name || "";

        // Get the "Organisation" which is actually a parse of userGroups
        // original app assumed user would have only one OU (at the country level)
        // might be in partners, agencies, or interagency, start with partners
        this.getPartnersInOrg(ous.id).then(partners => {
          userGroups.forEach(ug => {
            let found = partners.filter(p => {
              return (
                p.mechUserGroup.name === ug.name ||
                p.userAdminUserGroup.name === ug.name ||
                p.userUserGroup.name === ug.name
              );
            });
            if (found[0]) {
              this.setState({ org: found[0].name });
            }
          });
        });
        this.getAgenciesInOrg(ous.id).then(agencies => {
          userGroups.forEach(ug => {
            let found = agencies.filter(a => {
              return (
                a.mechUserGroup.name === ug.name ||
                a.userAdminUserGroup.name === ug.name ||
                a.userUserGroup.name === ug.name
              );
            });
            if (found[0]) {
              this.setState({ org: found[0].name });
            }
          });
        });
        // @TODO:: interagency lookup
        // this.getInteragencyGroups(ous.id)...

        // get the data stream (groups)
        let streams = {};
        userGroups.forEach(ug => {
          streams[ug.id] = ug.name;
        });
        // get the user actions (roles)
        const userRoles = user.userCredentials.userRoles;
        let actions = {};
        userRoles.forEach(ur => {
          actions[ur.id] = true;
        });

        // are they a user admin?
        const uadmin = user.userCredentials.userRoles.filter(
          f => f.name === "User Administrator"
        );
        this.setState({
          user: user,
          userType: userType,
          country: country,
          actions: actions,
          streams: streams,
          baseActions: { ...actions },
          baseStreams: { ...streams },
          userManager: uadmin.length > 0,
        });
        hideProcessing();
      })
      .catch(error => {
        // @TODO:: Snackbar error
        console.error(error);
        this.setState({ user: false, error: "Invalid User" });
        hideProcessing();
      });
    this.setState({ userType: "xxx" });
  };

  // figure out which streams should be pre-selected
  // slightly different from Invite::getStreamDefaults
  getUserManagerStreams = (userType, isUserAdmin) => {
    // get the streams for this userType
    if (!userType) {
      return;
    }
    const { core } = this.props;
    const cfg = core.config;
    if (!cfg[userType]) {
      return;
    }

    const cfgStreams = cfg[userType].streams;
    // placeholder for the results
    let streams = { ...this.state.streams };
    // figure out which permission is the default
    Object.keys(cfgStreams).forEach(key => {
      const access = cfgStreams[key].accessLevels || {};
      const view = access["View Data"] || false;
      const enter = access["Enter Data"] || false;
      if (view) {
        if (isUserAdmin && view.selectWhenUA === 1) {
          streams[view.groupUID] = view.groupName;
        } else if (!isUserAdmin && view.selectWhenUA === 1 && streams[view.groupUID]) {
          delete streams[view.groupUID];
        }
      }
      if (enter) {
        if (isUserAdmin && enter.selectWhenUA === 1) {
          streams[enter.groupUID] = enter.groupName;
        } else if (!isUserAdmin && enter.selectWhenUA === 1 && streams[enter.groupUID]) {
          delete streams[enter.groupUID];
        }
      }
    });
    return streams;
  };

  // determine preselected User Actions
  // slightly different from Invite::getActionDefaults
  getUserManagerActions = (userType, isUserAdmin) => {
    // get the streams for this userType
    if (!userType) {
      return;
    }
    const { core } = this.props;
    const cfg = core.config;
    if (!cfg[userType]) {
      return;
    }

    const cfgActions = cfg[userType].actions;
    // placeholder for the results
    let actions = this.state.actions;
    cfgActions.forEach(action => {
      if (isUserAdmin && action.selectWhenUA === 1) {
        actions[action.roleUID] = true;
      } else if (!isUserAdmin && action.selectWhenUA === 1 && actions[action.roleUID]) {
        delete actions[action.roleUID];
      }
    });
    return actions;
  };

  handleChangeLocale = event => {
    if (event.target.value !== this.state.locale) {
      this.setState({ locale: event.target.value });
    }
  };

  // the User Manager checkbox
  handleCheckUserManager = (key, value) => {
    this.setState({
      userManager: value,
      streams: this.getUserManagerStreams(this.state.userType, value),
      actions: this.getUserManagerActions(this.state.userType, value),
    });
  };

  // what to do when a stream radio button is clicked
  handleChangeStream = (streamName, streamState) => {
    const { core } = this.props;
    let streams = this.state.streams;
    let actions = this.state.actions;
    const theChosenStream = core.config[this.state.userType]["streams"][streamName];

    // delete streams from this streamName, then reconsititute as necessary
    // stream rights cascade down (Enter implies View)
    if (
      (streamState === "noaccess" || streamState === "View Data") &&
      (theChosenStream["accessLevels"] || false) &&
      (theChosenStream["accessLevels"]["Enter Data"] || false) &&
      (streams[theChosenStream["accessLevels"]["Enter Data"].groupUID] || false)
    ) {
      delete streams[theChosenStream["accessLevels"]["Enter Data"].groupUID];
      //delete implied roles
      if (theChosenStream["accessLevels"]["Enter Data"].impliedRoles) {
        theChosenStream["accessLevels"]["Enter Data"].impliedRoles.forEach(r => {
          delete actions[r.roleUID];
        });
      }
    }
    if (
      streamState === "noaccess" &&
      (theChosenStream["accessLevels"] || false) &&
      (theChosenStream["accessLevels"]["View Data"] || false) &&
      (streams[theChosenStream["accessLevels"]["View Data"].groupUID] || false)
    ) {
      delete streams[theChosenStream["accessLevels"]["View Data"].groupUID];
      //delete implied roles
      if (theChosenStream["accessLevels"]["View Data"].impliedRoles) {
        theChosenStream["accessLevels"]["View Data"].impliedRoles.forEach(r => {
          delete actions[r.roleUID];
        });
      }
    }
    // Add the streams/groups
    if (streamState === "View Data" || streamState === "Enter Data") {
      streams[theChosenStream["accessLevels"]["View Data"].groupUID] =
        theChosenStream["accessLevels"]["View Data"].groupName;
      // add implied roles
      if (theChosenStream["accessLevels"]["View Data"].impliedRoles) {
        theChosenStream["accessLevels"]["View Data"].impliedRoles.forEach(r => {
          actions[r.roleUID] = r.name;
        });
      }
    }
    if (streamState === "Enter Data") {
      streams[theChosenStream["accessLevels"]["Enter Data"].groupUID] =
        theChosenStream["accessLevels"]["Enter Data"].groupName;
      // add implied roles
      if (theChosenStream["accessLevels"]["Enter Data"].impliedRoles) {
        theChosenStream["accessLevels"]["Enter Data"].impliedRoles.forEach(r => {
          actions[r.roleUID] = r.name;
        });
      }
    }
    // reconstitute implied roles that a different stream might have borked
    const otherStreamNames = Object.keys(
      core.config[this.state.userType]["streams"]
    ).filter(k => k !== streamName);
    otherStreamNames.forEach(osn => {
      const lvls = core.config[this.state.userType]["streams"][osn].accessLevels;
      let e = lvls["Enter Data"] || false;
      let v = lvls["View Data"] || false;
      if (e && streams[e.groupUID] && e.impliedRoles) {
        lvls["Enter Data"].impliedRoles.forEach(r => {
          actions[r.roleUID] = r.name;
        });
      }
      if (v && streams[v.groupUID] && v.impliedRoles) {
        lvls["Enter Data"].impliedRoles.forEach(r => {
          actions[r.roleUID] = r.name;
        });
      }
    });
    this.setState({ streams: streams, actions: actions });
  };

  // what to do when a User Actions checkbox is clicked
  handleChangeActions = (roleUID, value) => {
    let actions = this.state.actions;
    if (actions[roleUID] && value === false) {
      delete actions[roleUID];
    } else {
      actions[roleUID] = value;
    }
    this.setState({ actions: actions });
  };

  // the grand poobah
  handleEditUser = () => {
    const { d2, showProcessing, hideProcessing } = this.props;
    showProcessing();

    //if streams or actions changed, save
    let s = Object.keys(this.state.streams)
      .sort()
      .join();
    let bs = Object.keys(this.state.baseStreams)
      .sort()
      .join();
    let a = Object.keys(this.state.actions)
      .sort()
      .join();
    let ba = Object.keys(this.state.baseActions)
      .sort()
      .join();

    if (s !== bs || a !== ba) {
      let userUID = this.state.user.id;
      const groups = Object.keys(this.state.streams).map(m => {
        return { id: m };
      });
      const roles = Object.keys(this.state.actions).map(m => {
        return { id: m };
      });

      // // @FIXME Alas the following should work if DHIS2 worked... https://jira.dhis2.org/browse/DHIS2-4405
      // const url = `/users/${userUID}`;
      // const data = {
      //   userGroups: groups,
      //   userCredentials: { userRoles: roles },
      // };
      // d2.Api.getApi()
      //   .patch(url, data)
      //   .then(res => {
      //     hideProcessing();
      //   })
      //   .catch(e => {
      //     console.error("E", e);
      //   });

      // // So we have to rely on a full PUT instead. *sigh*

      // simplify the code a bit and break any potential reference issues
      const tsu = { ...this.state.user };
      // restore OUs
      const ous = tsu.organisationUnits.toArray();
      const ouMap = ous.map(o => {
        return { id: o.id };
      });
      // restore OUs
      const dvous = tsu.dataViewOrganisationUnits.toArray();
      const dvouMap = dvous.map(o => {
        return { id: o.id };
      });
      // restore TEI
      const teis = tsu.teiSearchOrganisationUnits.toArray();
      const teiMap = teis.map(o => {
        return { id: o.id };
      });

      // make a clean user for submission
      let user = {
        // lastUpdated: tsu.lastUpdated,
        id: tsu.id,
        // created: tsu.created,
        name: tsu.name,
        displayName: tsu.displayName,
        externalAccess: tsu.externalAccess || false,
        surname: tsu.surname,
        employer: tsu.employer || "",
        firstName: tsu.firstName,
        favorite: tsu.favorite || false,
        access: tsu.access,
        userCredentials: {
          id: tsu.userCredentials.id,
          disabled: tsu.userCredentials.disabled,
          username: tsu.userCredentials.username,
          userRoles: roles,
          cogsDimensionConstraints: tsu.userCredentials.cogsDimensionConstraints,
          catDimensionConstraints: tsu.userCredentials.catDimensionConstraints,
        },
        favorites: tsu.favorites || [],
        teiSearchOrganisationUnits: teiMap,
        translations: tsu.translations || [],
        organisationUnits: ouMap,
        dataViewOrganisationUnits: dvouMap || [],
        userGroupAccesses: tsu.userGroupAccesses || [],
        attributeValues: tsu.attributeValues || [],
        userGroups: groups || [],
        userAccesses: tsu.userAccesses || [],
      };

      // And finally update the user!
      const url = `/users/${userUID}`;
      d2.Api.getApi()
        .update(url, user)
        .then(res => {
          if (res.status && res.status === "OK") {
            // Success!
            actions.showSnackbarMessage("Saved!");
            // set the base config to these new values
            this.setState({
              baseActions: this.state.actions,
              baseStreams: this.state.streams,
            });
          } else {
            actions.showSnackbarMessage("Save incomplete");
            console.error("Save failure:", res.typeReports[0].objectReports[0]);
          }
        })
        .catch(e => {
          actions.showSnackbarMessage("Network Error");
          console.error("Network error while saving.", e);
          hideProcessing();
        });
    }

    // if locale changed, save
    if (this.state.locale !== this.state.baseLocale) {
      showProcessing();
      // @TODO:: pull this from here and Invite into single location
      const url =
        //api.api.baseUrl +
        "/api/29/userSettings/keyUiLocale?user=" +
        this.state.user.userCredentials.username;
      // POST userSettings/keyUiLocale
      fetch(url, {
        method: "POST",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "text/plain" },
        redirect: "follow",
        body: this.state.locale,
      })
        .then(response => {
          if (response.ok && response.ok === true) {
            actions.showSnackbarMessage("Locale saved");
          } else {
            actions.showSnackbarMessage("Error setting locale");
            console.error("Error setting locale", response.body);
          }
          hideProcessing();
        })
        .catch(e => {
          actions.showSnackbarMessage("Error setting locale");
          hideProcessing();
          console.error("Error setting locale", e);
        });
    }
  };

  render() {
    const { core } = this.props;

    if (!this.state.uid || !this.state.user || !this.state.user.id) {
      return (
        <div className="wrapper">
          <MainMenu />
          <h2 className="title">Edit user: Error</h2>
          <h3 className="subTitle">User Management</h3>
          <div>{this.state.error}</div>
        </div>
      );
    }

    // Am I awesome and can do anything?
    const myOUs = (core.me.organisationUnits || []).map(ou => ou.id);
    const isSuperUser = core.me && core.me.hasAllAuthority && core.me.hasAllAuthority();
    const isGlobalUser = myOUs.indexOf(core.config.Global.ouUID) >= 0;

    const streams = [];
    const actions = [];

    let cfg = core.config[this.state.userType] || false;
    // Check for DoD awareness
    if (this.state.userType === "Partner" && this.state.partner) {
      // does the selected partner have DoD info
      const partner =
        this.state.partners.filter(p => {
          return p.id === this.state.partner;
        })[0] || {};

      if (partner.hasOwnProperty("normalEntry") && partner.normalEntry !== true) {
        cfg = core.config["Partner DoD"];
      }
    }
    if (cfg) {
      //convert streams to array for easier sorting
      const s = Object.entries(cfg.streams)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => a.value.sortOrder > b.value.sortOrder);
      s.forEach(stream => {
        // figure out if anything was previously selected
        const v = stream.value.accessLevels["View Data"] || {};
        const e = stream.value.accessLevels["Enter Data"] || {};
        let selected = "noaccess";
        if (this.state.streams[e.groupUID]) {
          selected = "Enter Data";
        } else if (this.state.streams[v.groupUID]) {
          selected = "View Data";
        }
        // add each stream/group to the view
        streams.push(
          <GridListTile key={stream.key}>
            <DataStream
              stream={stream}
              selected={selected}
              onChangeStream={this.handleChangeStream}
              userManager={this.state.userManager}
            />
          </GridListTile>
        );
      });
      //get only the visible actions for checkbox display
      const act = cfg.actions
        .filter(a => a.hidden === 0)
        .sort((a, b) => a.sortOrder > b.sortOrder);
      act.forEach(action => {
        // see if they have this role
        const checked = this.state.actions[action.roleUID] || false;
        actions.push(
          <DataAction
            key={action.roleUID}
            action={action}
            checked={checked}
            onChangeAction={this.handleChangeActions}
            userManager={this.state.userManager}
          />
        );
      });
    }

    // Did anything actually change? If so, enable the save button.
    let disableSave = true;
    let s = Object.keys(this.state.streams)
      .sort()
      .join();
    let bs = Object.keys(this.state.baseStreams)
      .sort()
      .join();
    let a = Object.keys(this.state.actions)
      .sort()
      .join();
    let ba = Object.keys(this.state.baseActions)
      .sort()
      .join();
    if (s !== bs || a !== ba || this.state.baseLocale !== this.state.locale) {
      disableSave = false;
    }

    return (
      <div className="wrapper">
        <MainMenu />
        <h2 className="title">Edit user</h2>
        <h3 className="subTitle">User Management</h3>
        <Paper className="card filters">
          <IconButton
            style={{ position: "absolute", top: "3em", right: "1em" }}
            component={Link}
            to={"/"}
            aria-label="Close edit user"
          >
            <CancelIcon />
          </IconButton>

          <h2>{this.state.user.name}</h2>
          <Grid container spacing={8}>
            <Grid item xs={3}>
              <WorkOutlineIcon color="secondary" style={{ verticalAlign: "middle" }} />
              User type:
            </Grid>
            <Grid item xs={9}>
              {this.state.userType}
            </Grid>
            {this.state.userType === "Global" ? null : (
              <Grid item xs={3}>
                <GroupIcon color="secondary" style={{ verticalAlign: "middle" }} />
                Organisation:
              </Grid>
            )}
            {this.state.userType === "Global" ? null : (
              <Grid item xs={9}>
                {this.state.org}
              </Grid>
            )}
            <Grid item xs={3}>
              <PersonOutlineIcon color="secondary" style={{ verticalAlign: "middle" }} />
              Username:
            </Grid>
            <Grid item xs={9}>
              {this.state.user.userCredentials.username}
            </Grid>
            <Grid item xs={3}>
              <WorkOutlineIcon color="secondary" style={{ verticalAlign: "middle" }} />
              E-mail:
            </Grid>
            <Grid item xs={9}>
              {this.state.user.email}
            </Grid>
            <Grid item xs={3}>
              <OutlinedFlagIcon color="secondary" style={{ verticalAlign: "middle" }} />
              Country:
            </Grid>
            <Grid item xs={9}>
              {this.state.country}
            </Grid>
          </Grid>
          <SelectLocale
            value={this.state.locale || "en"}
            onChange={this.handleChangeLocale}
            locales={core.locales}
          />
          <FormControlLabel
            style={{ marginTop: "1em" }}
            control={
              <Checkbox
                checked={this.state.userManager || false}
                onChange={this.handleCheckUserManager}
                disabled={!this.state.userType || (isGlobalUser && !isSuperUser)}
                value="checkedA"
              />
            }
            label="User Manager"
          />
        </Paper>
        {this.state.userType === "Global" ? null : (
          <div>
            <Paper className="card streams">
              <h3>Data Streams</h3>
              <GridList
                style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}
                cols={streams.length}
              >
                {streams.length > 0 ? streams : <p>None</p>}
              </GridList>
            </Paper>
            <Paper className="card actions">
              <h3>User Actions</h3>
              {actions.length > 0 ? actions : <p>None</p>}
            </Paper>
          </div>
        )}
        {this.state && this.state.user && this.state.user.id ? (
          <Button
            variant="contained"
            color="primary"
            style={{ display: "block", padding: "0 18em" }}
            onClick={this.handleEditUser}
            disabled={disableSave}
          >
            Save changes
          </Button>
        ) : null}
      </div>
    );
  }
}

export default Edit;
