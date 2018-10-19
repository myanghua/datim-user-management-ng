import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { JssProvider } from "react-jss";
import HeaderBar from "@dhis2/d2-ui-header-bar";
import Snackbar from "@material-ui/core/Snackbar";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import AppTheme from "./colortheme";
import actions from "./actions";
import * as coreActions from "./actions/core";
import AccessDenied from "./Components/AccessDenied.component.js";
import Processing from "./Components/Processing.component.js";
import Invite from "./containers/InvitePage.js";
import List from "./containers/ListPage.js";
import Edit from "./containers/EditPage.js";

import "./App.css";

class App extends Component {
  getChildContext = () => ({
    d2: this.props.d2,
    muiTheme: AppTheme,
  });

  constructor(props) {
    super(props);
    this.state = { snackbar: "" };

    //bootstrap some items
    props.setD2(props.d2);
    props.setMe(props.d2);
    props.getCountries(props.d2);
    props.parseConfiguration();
    props.getLocales(props.d2);
    props.getFundingAgencyUID(props.d2);
    props.getImplementingPartnerUID(props.d2);
    props.getDoDUID(props.d2);
    props.getUserGroups(props.d2);
    // props.getUserRoles(props.d2);
  }

  componentDidMount() {
    this.subscriptions = [
      actions.showSnackbarMessage.subscribe(params => {
        if (!!this.state.snackbar) {
          this.setState({ snackbar: undefined });
          setTimeout(() => {
            this.setState({ snackbar: params.data });
          }, 150);
        } else {
          this.setState({ snackbar: params.data });
        }
      }),
    ];
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => {
      subscription.dispose();
    });
  }

  closeSnackbar() {
    actions.showSnackbarMessage(undefined);
  }

  showSnackbar(message) {
    this.setState({ snackbar: message });
  }

  render() {
    const d2 = this.props.d2;
    const me = this.props.me;
    return (
      <JssProvider>
        <div className="app-wrapper">
          <AccessDenied />
          <HeaderBar d2={d2} />
          <Processing />
          {me.id && (
            <Router>
              <Switch>
                <Route exact path="/" render={props => <List d2={d2} />} />
                <Route exact path="/invite" render={props => <Invite d2={d2} />} />
                <Route
                  exact
                  path="/edit/:id"
                  render={props => <Edit d2={d2} {...props} />}
                />
              </Switch>
            </Router>
          )}
          <Snackbar
            className="snackbar"
            message={this.state.snackbar || undefined}
            autoHideDuration={2500}
            open={!!this.state.snackbar}
            onClose={this.closeSnackbar}
          />
        </div>
      </JssProvider>
    );
  }
}

App.childContextTypes = {
  d2: PropTypes.object,
  muiTheme: PropTypes.object,
};

App.propTypes = {
  d2: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  me: state.core.me,
});
const mapDispatchToProps = dispatch => bindActionCreators(coreActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
