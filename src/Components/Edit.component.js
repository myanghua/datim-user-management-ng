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

import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import MainMenu from "../containers/MainMenu.js";
import UserDetails from "./UserDetails.component";
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
      };
    }

    this.handleChangeLocale = this.handleChangeLocale.bind(this);
    this.handleCheckUserManager = this.handleCheckUserManager.bind(this);
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
    const {
      d2,
      core,
      showProcessing,
      hideProcessing,
      getUser,
      getUserLocale,
      match,
    } = this.props;

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
            });
          })
          .catch(error => {
            this.setState({
              locale: "en",
            });
            console.error(error);
          });
        return user;
      })
      .then(user => {
        // get the other details

        // original app assumed user would have only one OU (at the country level)
        const ous = user.organisationUnits.toArray()[0];
        const countries = core.countries.filter(c => ous.id === c.id);
        const country = countries[0].name;

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
        const cfg = core.config[userType] || {};

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
        // get the user actions (roles)
        const userRoles = user.userCredentials.userRoles;

        this.setState({
          user: user,
          userType: userType,
          country: country,
        });
        // agency: false,
        // partner: false,
        // streams: {},
        // actions: {},
        // myStreams: [],
        // myTypes: [],
        // userManager: false,
        // accessDenied: false,
        // countryUserGroups: [],
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

  handleChangeLocale = event => {
    if (event.target.value !== this.state.locale) {
      this.setState({ locale: event.target.value });
    }
  };

  // the User Manager checkbox
  handleCheckUserManager = () => {
    this.setState({
      userManager: !this.state.userManager,
    });
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

    // <UserDetails user={this.state.user.id || {}} />: null)
    // const ous = this.state.user.organisationUnits.toArray().map(o => o.id);

    const isGlobalUser = false;
    const isSuperUser = false;
    const streams = [];
    const actions = [];

    let cfg = core.config[this.state.userType] || {};
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
    //convert streams to array for easier sorting
    const s = Object.entries(cfg.streams)
      .map(([key, value]) => ({ key, value }))
      .sort((a, b) => a.value.sortOrder > b.value.sortOrder);
    s.forEach(stream => {
      // add each stream/group to the view
      streams.push(
        <GridListTile key={stream.key}>
          <DataStream
            stream={stream}
            selected="noaccess"
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
      actions.push(
        <DataAction
          key={action.roleUID}
          action={action}
          checked={false}
          onChangeAction={this.handleChangeActions}
          userManager={this.state.userManager}
        />
      );
    });

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
            <Grid item xs={3}>
              <GroupIcon color="secondary" style={{ verticalAlign: "middle" }} />
              Organisation:
            </Grid>
            <Grid item xs={9}>
              {this.state.org}
            </Grid>
            <Grid item xs={3}>
              <PersonOutlineIcon color="secondary" style={{ verticalAlign: "middle" }} />
              Username:
            </Grid>
            <Grid item xs={9}>
              {this.state.user.userCredentials.username}
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

        {this.state && this.state.user && this.state.user.id ? (
          <Button
            variant="contained"
            color="primary"
            style={{ display: "block", padding: "0 18em" }}
            onClick={this.handleEditUser}
          >
            Save changes
          </Button>
        ) : null}
      </div>
    );
  }
}

export default Edit;
