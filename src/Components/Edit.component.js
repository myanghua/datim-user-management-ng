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
        const filter = cfg.groupFilter || false;

        // Get the "Organisation" which is actually a parse of userGroups
        // original app assumed user would have only one OU (at the country level)

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
